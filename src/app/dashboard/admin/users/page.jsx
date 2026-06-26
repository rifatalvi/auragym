"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/users`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "blocked" ? "active" : "blocked";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (err) {
      console.error("Error toggling block status:", err);
      toast.error("Failed to update user status");
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/users/${userId}/make-admin`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to promote to admin");
      toast.success("User promoted to Admin successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error making admin:", err);
      toast.error("Failed to promote user to Admin");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover">
                <td>
                  <div className="font-bold">{user.name || "N/A"}</div>
                </td>
                <td>{user.email}</td>
                <td>
                  <div className={`badge ${user.role === 'admin' ? 'badge-primary' : user.role === 'trainer' ? 'badge-secondary' : 'badge-ghost'}`}>
                    {user.role || 'user'}
                  </div>
                </td>
                <td>
                  <div className={`badge ${user.status === 'blocked' ? 'badge-error' : 'badge-success'}`}>
                    {user.status === 'blocked' ? 'Blocked' : 'Active'}
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    {/* Make Admin Button */}
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleMakeAdmin(user._id)}
                        className="btn btn-sm btn-outline btn-info"
                      >
                        Make Admin
                      </button>
                    )}
                    
                    {/* Block/Unblock Button */}
                    <button 
                      onClick={() => handleBlockToggle(user._id, user.status)}
                      className={`btn btn-sm ${user.status === 'blocked' ? 'btn-success' : 'btn-error'}`}
                    >
                      {user.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
