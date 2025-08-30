import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundGif from "../assets/gif.gif";
import "./AdminPanel.css"; // normal CSS file

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const admin = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch users error:", err.response || err);
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const toggleBlockUser = async (id) => {
  try {
    // Optimistically update UI
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, blocked: !user.blocked } : user
      )
    );

    await axios.patch(
      `http://localhost:3001/api/admin/user/${id}/block`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    // Optional: fetchUsers() to ensure latest from server
    // fetchUsers();
  } catch (err) {
    console.error(err);
    alert("Failed to update user.");

    // Revert optimistic update on failure
    fetchUsers();
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-panel">
      {/* Overlay */}
      <div className="overlay"></div>

      <div className="content-wrapper">
        <h1 className="panel-title">Admin Panel - Manage Users</h1>

        <div className="table-container">
          {loading ? (
            <p className="status-text">Loading users...</p>
          ) : error ? (
            <p className="status-text error">{error}</p>
          ) : users.length === 0 ? (
            <p className="status-text">No users found.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  {["Name", "Email", "Username", "Phone", "Role", "Blocked", "Actions"].map(
                    (head) => (
                      <th key={head}>{head}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>{u.username}</td>
                    <td>{u.phone}</td>
                    <td>{u.role}</td>
                    <td>{u.blocked ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className={u.blocked ? "unblock-btn" : "block-btn"}
                        onClick={() => toggleBlockUser(u._id)}
                      >
                        {u.blocked ? "Unblock" : "Block"}
                      </button>
                      <button className="delete-btn" onClick={() => deleteUser(u._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
