"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, UserX, Search, Filter, MoreVertical, Shield, Ban, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  
  // Stats State
  const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0 });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/users?page=${page}&limit=5&search=${search}&role=${role}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setStats(data.summaryStats);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role]);

  // Debounced Search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1); // Reset to page 1 on new search
      fetchUsers();
    }, 500);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
      alert(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (err) {
      console.error("Error toggling block status:", err);
      alert("Failed to update user status");
    }
  };

  const handleMakeAdmin = async (userId) => {
    if(!window.confirm("Are you sure you want to make this user an Admin?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/users/${userId}/make-admin`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to promote to admin");
      alert("User promoted to Admin successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error making admin:", err);
      alert("Failed to promote user to Admin");
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 bg-red-50 rounded-xl m-6">
        <h3 className="text-xl font-bold">{error}</h3>
        <button onClick={fetchUsers} className="btn btn-primary mt-4">Try Again</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Stats Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1 max-w-md text-sm">
            Monitor, manage, and secure your platforms user base. Review user status and manage access permissions.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[140px]">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Total Users</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[140px]">
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Active</p>
              <p className="text-xl font-bold">{stats.active}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[140px]">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              <UserX size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Blocked</p>
              <p className="text-xl font-bold">{stats.blocked}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Table Section */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="input input-bordered w-full pl-10 bg-gray-50 rounded-xl focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Filter size={18} />
                </div>
                <select 
                  className="select select-bordered w-full pl-10 bg-gray-50 rounded-xl focus:bg-white transition-colors appearance-none font-medium text-gray-700"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role & Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-16 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search size={48} className="text-gray-300 mb-4" />
                          <p className="text-lg font-semibold">No users found</p>
                          <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                              {user.image ? (
                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {/* Online indicator dot */}
                              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'blocked' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{user.name || "N/A"}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                                JOINED {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                              ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 
                                user.role === 'trainer' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                                'bg-gray-100 text-gray-700 border border-gray-200'}`}
                            >
                              {user.role === 'admin' && <Shield size={12} />}
                              {user.role === 'trainer' && <Users size={12} />}
                              {user.role === 'user' && <UserCheck size={12} />}
                              <span className="capitalize">{user.role || 'user'}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                              <span className={`w-2 h-2 rounded-full ${user.status === 'blocked' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                              <span className={user.status === 'blocked' ? 'text-red-600' : 'text-green-600'}>
                                {user.status === 'blocked' ? 'Blocked' : 'Active'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => handleMakeAdmin(user._id)}
                                className="btn btn-sm bg-white border border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 shadow-sm"
                                title="Promote to Admin"
                              >
                                <Shield size={14} className="mr-1" /> Make Admin
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleBlockToggle(user._id, user.status)}
                              className={`btn btn-sm shadow-sm ${
                                user.status === 'blocked' 
                                  ? 'bg-white border-green-200 text-green-700 hover:bg-green-50' 
                                  : 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                              }`}
                            >
                              {user.status === 'blocked' ? (
                                <><UserCheck size={14} className="mr-1" /> Unblock</>
                              ) : (
                                <><Ban size={14} className="mr-1" /> Block</>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="text-sm text-gray-500 font-medium">
                  Showing page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                </div>
                <div className="join shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    className="join-item btn btn-sm bg-white border-0 hover:bg-gray-100 text-gray-700 disabled:bg-gray-50 disabled:text-gray-300" 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button className="join-item btn btn-sm bg-white border-0 text-gray-700 px-4 pointer-events-none font-semibold">
                    {page}
                  </button>
                  <button 
                    className="join-item btn btn-sm bg-white border-0 hover:bg-gray-100 text-gray-700 disabled:bg-gray-50 disabled:text-gray-300" 
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary" /> Admin Guide
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Permission Guidelines
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Only grant <strong>Admin</strong> roles to trusted staff members. Admins have full access to platform configurations, user data, and financial records.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Blocked Users Info
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Users Can:</p>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-center gap-2"><UserCheck size={14} className="text-green-500" /> Login to account</li>
                      <li className="flex items-center gap-2"><UserCheck size={14} className="text-green-500" /> Browse classes</li>
                      <li className="flex items-center gap-2"><UserCheck size={14} className="text-green-500" /> View forum posts</li>
                    </ul>
                  </div>
                  <div className="divider my-2"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Users Cannot:</p>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-center gap-2"><UserX size={14} className="text-red-500" /> Book classes</li>
                      <li className="flex items-center gap-2"><UserX size={14} className="text-red-500" /> Apply for trainer</li>
                      <li className="flex items-center gap-2"><UserX size={14} className="text-red-500" /> Create comments/posts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
