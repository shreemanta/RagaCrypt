// routes/history.js
import express from "express";
import History from "../models/History.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify user token
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Get history for logged-in user
router.get("/user/:userId", verifyUser, async (req, res) => {
  try {
    // Only allow user to access their own history
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const history = await History.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new history record
router.post("/add", verifyUser, async (req, res) => {
  try {
    const { type, action, input, output } = req.body;
    const newRecord = new History({
      userId: req.user.id,
      type,
      action,
      input,
      output
    });
    await newRecord.save();
    res.status(201).json({ message: "History saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
