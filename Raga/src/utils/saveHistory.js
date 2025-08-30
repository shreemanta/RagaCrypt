// src/utils/saveHistory.js
export const saveHistory = async ({ type, action, input, key, output }) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch("http://localhost:3001/api/history/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        action,
        input,
        key,
        output,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("Failed to save history:", err);
  }
};
