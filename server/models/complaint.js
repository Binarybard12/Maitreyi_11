import mongoose from "mongoose";

const complaintSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        type: {
            type: String,
            required: true,
            enum: ["Electrical", "Plumbing", "Furniture", "Mess", "Cleaning", "Other"],
        },
        description: {
            type: String,
            required: true,
        },
        roomNumber: {
            type: String,
            required: true,
        },
        blockNumber: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            enum: ["Raised", "Assigned", "In Progress", "Resolved", "Closed"],
            default: "Raised",
        },
        assignedStaff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        feedback: {
            type: String,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        isResolved: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },
        resolvedAt: {
            type: Date,
        },
        closedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
