import express from "express";
const router = express.Router();
import {
  getDashboardStats,
  getFacultyDetailsForAdmin,
  getFacultyList,
  deleteFaculty,
  updateFaculty,
  getSettings,
  updateSettings,
  exportPayments,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";

// Middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
router.use(protect, adminOnly);
// All routes are protected and for admins only
router.get("/stats", getDashboardStats);
router.get("/faculty-list", getFacultyList);
router.get("/faculty/:_id/details", getFacultyDetailsForAdmin);
router.delete("/faculty/:_id", deleteFaculty);
router.put("/faculty/:id", updateFaculty);
router.get("/settings/platform-fee", getSettings);
router.put("/settings/platform-fee", updateSettings);
router.get("/export-payments", exportPayments);

export default router;
