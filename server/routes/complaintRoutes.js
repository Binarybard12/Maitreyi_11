import express from "express";
import {
    createComplaint,
    getComplaints,
    getMyComplaints,
    getAssignedComplaints,
    getComplaintById,
    updateComplaint,
    submitFeedback,
    getComplaintStats,
} from "../controllers/complaintController.js";
import { protect, warden, staff, student } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student routes
router.route("/").post(protect, createComplaint);
router.route("/my").get(protect, getMyComplaints);
router.route("/:id/feedback").put(protect, submitFeedback);

// Warden/Admin routes
router.route("/").get(protect, warden, getComplaints);
router.route("/stats/dashboard").get(protect, warden, getComplaintStats);

// Staff routes
router.route("/assigned").get(protect, staff, getAssignedComplaints);

// Shared routes (with role-based access control in controller)
router
    .route("/:id")
    .get(protect, getComplaintById)
    .put(protect, updateComplaint);

export default router;
