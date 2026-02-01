import asyncHandler from "express-async-handler";
import Complaint from "../models/complaint.js";
import User from "../models/user.js";

// @desc    Create a new complaint
// @route   POST /complaints
// @access  Private (Student)
const createComplaint = asyncHandler(async (req, res) => {
    const { type, description, roomNumber, blockNumber, priority } = req.body;

    const complaint = await Complaint.create({
        student: req.user._id,
        type,
        description,
        roomNumber: roomNumber || req.user.roomNumber,
        blockNumber: blockNumber || req.user.blockNumber,
        priority: priority || "Medium",
        status: "Raised",
    });

    if (complaint) {
        res.status(201).json(complaint);
    } else {
        res.status(400);
        throw new Error("Invalid complaint data");
    }
});

// @desc    Get all complaints (Admin/Warden)
// @route   GET /complaints
// @access  Private (Admin/Warden)
const getComplaints = asyncHandler(async (req, res) => {
    const { status, type, priority, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const complaints = await Complaint.find(filter)
        .populate("student", "name email roomNumber blockNumber phoneNumber")
        .populate("assignedStaff", "name email phoneNumber")
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip(skip);

    const count = await Complaint.countDocuments(filter);

    res.json({
        complaints,
        page: pageNum,
        pages: Math.ceil(count / limitNum),
        total: count,
    });
});

// @desc    Get my complaints (Student)
// @route   GET /complaints/my
// @access  Private (Student)
const getMyComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ student: req.user._id })
        .populate("assignedStaff", "name phoneNumber")
        .sort({ createdAt: -1 });

    res.json(complaints);
});

// @desc    Get complaints assigned to staff
// @route   GET /complaints/assigned
// @access  Private (Staff)
const getAssignedComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ assignedStaff: req.user._id })
        .populate("student", "name email roomNumber blockNumber phoneNumber")
        .sort({ createdAt: -1 });

    res.json(complaints);
});

// @desc    Get complaint by ID
// @route   GET /complaints/:id
// @access  Private
const getComplaintById = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate("student", "name email roomNumber blockNumber phoneNumber")
        .populate("assignedStaff", "name email phoneNumber");

    if (complaint) {
        // Check if user has access to this complaint
        if (
            req.user.role === "warden" ||
            complaint.student._id.toString() === req.user._id.toString() ||
            (complaint.assignedStaff &&
                complaint.assignedStaff._id.toString() === req.user._id.toString())
        ) {
            res.json(complaint);
        } else {
            res.status(403);
            throw new Error("Not authorized to view this complaint");
        }
    } else {
        res.status(404);
        throw new Error("Complaint not found");
    }
});

// @desc    Update complaint (Assign staff, update status)
// @route   PUT /complaints/:id
// @access  Private (Admin/Warden/Staff)
const updateComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        const { assignedStaff, status, priority } = req.body;

        // Warden can assign staff and update status
        if (req.user.role === "warden") {
            if (assignedStaff) {
                const staff = await User.findById(assignedStaff);
                if (staff && staff.role === "staff") {
                    complaint.assignedStaff = assignedStaff;
                    if (complaint.status === "Raised") {
                        complaint.status = "Assigned";
                    }
                } else {
                    res.status(400);
                    throw new Error("Invalid staff user");
                }
            }
            if (status) complaint.status = status;
            if (priority) complaint.priority = priority;
        }

        // Staff can update status of their assigned complaints
        if (
            req.user.role === "staff" &&
            complaint.assignedStaff &&
            complaint.assignedStaff.toString() === req.user._id.toString()
        ) {
            if (status) {
                complaint.status = status;
                if (status === "Resolved") {
                    complaint.isResolved = true;
                    complaint.resolvedAt = new Date();
                }
            }
        }

        const updatedComplaint = await complaint.save();
        const populatedComplaint = await Complaint.findById(updatedComplaint._id)
            .populate("student", "name email roomNumber blockNumber phoneNumber")
            .populate("assignedStaff", "name email phoneNumber");

        res.json(populatedComplaint);
    } else {
        res.status(404);
        throw new Error("Complaint not found");
    }
});

// @desc    Submit feedback and close complaint (Student)
// @route   PUT /complaints/:id/feedback
// @access  Private (Student)
const submitFeedback = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        // Check if student owns this complaint
        if (complaint.student.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("Not authorized to submit feedback for this complaint");
        }

        // Check if complaint is resolved
        if (complaint.status !== "Resolved") {
            res.status(400);
            throw new Error("Can only submit feedback for resolved complaints");
        }

        const { feedback, rating } = req.body;

        complaint.feedback = feedback;
        complaint.rating = rating;
        complaint.status = "Closed";
        complaint.closedAt = new Date();

        const updatedComplaint = await complaint.save();
        const populatedComplaint = await Complaint.findById(updatedComplaint._id)
            .populate("student", "name email roomNumber blockNumber phoneNumber")
            .populate("assignedStaff", "name email phoneNumber");

        res.json(populatedComplaint);
    } else {
        res.status(404);
        throw new Error("Complaint not found");
    }
});

// @desc    Get complaint statistics (Admin/Warden)
// @route   GET /complaints/stats/dashboard
// @access  Private (Admin/Warden)
const getComplaintStats = asyncHandler(async (req, res) => {
    const totalComplaints = await Complaint.countDocuments();
    const raisedComplaints = await Complaint.countDocuments({ status: "Raised" });
    const assignedComplaints = await Complaint.countDocuments({
        status: "Assigned",
    });
    const inProgressComplaints = await Complaint.countDocuments({
        status: "In Progress",
    });
    const resolvedComplaints = await Complaint.countDocuments({
        status: "Resolved",
    });
    const closedComplaints = await Complaint.countDocuments({ status: "Closed" });

    const complaintsByType = await Complaint.aggregate([
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
            },
        },
    ]);

    const complaintsByPriority = await Complaint.aggregate([
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1 },
            },
        },
    ]);

    const averageRating = await Complaint.aggregate([
        {
            $match: { rating: { $exists: true, $ne: null } },
        },
        {
            $group: {
                _id: null,
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    res.json({
        total: totalComplaints,
        raised: raisedComplaints,
        assigned: assignedComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        closed: closedComplaints,
        byType: complaintsByType,
        byPriority: complaintsByPriority,
        averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0,
    });
});

export {
    createComplaint,
    getComplaints,
    getMyComplaints,
    getAssignedComplaints,
    getComplaintById,
    updateComplaint,
    submitFeedback,
    getComplaintStats,
};
