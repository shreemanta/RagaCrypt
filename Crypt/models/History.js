// models/History.js
import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },      // e.g., "Caesar Cipher"
  action: { type: String, required: true },    // "Encryption" or "Decryption"
  input: { type: String, required: true },
  output: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("History", historySchema);
