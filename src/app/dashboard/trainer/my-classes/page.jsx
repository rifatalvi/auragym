"use client";

import React, { useState, useEffect, useCallback } from "react";
import fetchSecure from '../../../../lib/fetchSecure';
import { useSession } from "@/lib/auth-client";
import { MdLibraryBooks, MdEdit, MdDelete, MdPeople, MdClose, MdCheckCircle, MdCancel, MdPendingActions } from "react-icons/md";
import Image from "next/image";

export default function MyClassesPage() {
  const { data: session, isPending } = useSession();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewingAttendees, setViewingAttendees] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const fetchClasses = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/trainer/${session.user.email}/classes`);
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!isPending) {
      const timer = window.setTimeout(() => {
        void fetchClasses();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [session, isPending, fetchClasses]);

  const confirmDelete = async (e) => {
    e.preventDefault();
    if (!deletingClass) return;
    setDeleteLoading(true);

    try {
      // In a real scenario, the reason could be sent to the backend for logging
      // e.g. body: JSON.stringify({ reason: deleteReason })
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/${deletingClass._id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setClasses(classes.filter((c) => c._id !== deletingClass._id));
        setDeletingClass(null);
        setDeleteReason("");
      }
    } catch (err) {
      console.error("Failed to delete class:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewAttendees = async (classId) => {
    setViewingAttendees(classId);
    setAttendeesLoading(true);
    try {
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/${classId}/attendees`);
      if (res.ok) {
        const data = await res.json();
        setAttendees(data);
      }
    } catch (err) {
      console.error("Failed to fetch attendees:", err);
    } finally {
      setAttendeesLoading(false);
    }
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/${editingClass._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingClass),
      });
      if (res.ok) {
        setClasses(classes.map(c => c._id === editingClass._id ? editingClass : c));
        setEditingClass(null);
      }
    } catch (err) {
      console.error("Failed to update class:", err);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdLibraryBooks className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">My Classes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Manage My Classes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          View your submitted classes, check attendees, and manage class details.
        </p>
      </div>

      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Class Name</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">You haven&apos;t added any classes yet.</p>
                    <div className="max-w-md mx-auto text-left bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2"><MdCheckCircle size={16} /> Class Management Tips</h4>
                      <ul className="text-xs text-blue-700/80 dark:text-blue-300/80 space-y-1.5 list-disc pl-5">
                        <li>Go to &quot;Add Class&quot; to create your first session.</li>
                        <li>Detailed and engaging descriptions attract more students.</li>
                        <li>Keep your schedule updated to avoid booking conflicts.</li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cls.image ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/[0.1] relative">
                            <Image
                              src={cls.image}
                              alt={cls.className || cls.name || "Class Image"}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.05] flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-white/[0.1]">
                            <MdLibraryBooks className="text-gray-400" size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{cls.className || cls.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{cls.duration} | ${cls.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.1] text-xs font-medium text-gray-600 dark:text-gray-300">
                        {cls.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-wider ${cls.status === 'Approved' ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                        : cls.status === 'Rejected' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                          : 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                        }`}>
                        {cls.status === 'Approved' ? <MdCheckCircle size={14} /> : cls.status === 'Rejected' ? <MdCancel size={14} /> : <MdPendingActions size={14} />}
                        {cls.status || 'Pending'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewAttendees(cls._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-colors flex items-center gap-2 group"
                          title="View enrolled students"
                        >
                          <MdPeople size={16} />
                          <span>Students</span>
                          {/* Beautiful booking count badge */}
                          <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-blue-200 dark:bg-blue-500/30 text-[10px] text-blue-800 dark:text-blue-200 group-hover:scale-110 transition-transform">
                            {cls.bookingCount || 0}
                          </span>
                        </button>
                        <button
                          onClick={() => setEditingClass(cls)}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingClass(cls)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Class Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#120010] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-white/[0.06] shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-[#120010] border-b border-gray-100 dark:border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Update Class</h2>
              <button onClick={() => setEditingClass(null)} className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateClass} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class Name</label>
                  <input
                    type="text"
                    value={editingClass.className || editingClass.name}
                    onChange={e => setEditingClass({ ...editingClass, className: e.target.value, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price ($)</label>
                  <input
                    type="number"
                    value={editingClass.price}
                    onChange={e => setEditingClass({ ...editingClass, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                  <select
                    value={editingClass.category}
                    onChange={e => setEditingClass({ ...editingClass, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white"
                  >
                    <option value="Yoga">Yoga</option>
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Cycling">Cycling</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    rows="3"
                    value={editingClass.description}
                    onChange={e => setEditingClass({ ...editingClass, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-white/[0.06] mt-6">
                <button type="button" onClick={() => setEditingClass(null)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-600/20">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Attendees Modal */}
      {viewingAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#120010] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-100 dark:border-white/[0.06] shadow-xl flex flex-col">
            <div className="bg-white dark:bg-[#120010] border-b border-gray-100 dark:border-white/[0.06] px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MdPeople className="text-blue-500" /> Class Attendees
              </h2>
              <button onClick={() => setViewingAttendees(null)} className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {attendeesLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No one has booked this class yet.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {attendees.map((attendee, idx) => (
                    <li key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 shrink-0">
                        {attendee.email?.[0]?.toUpperCase() || attendee.attendeeEmail?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {attendee.user?.name || "Member"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {attendee.email || attendee.attendeeEmail || attendee.userId}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] shrink-0 text-right">
              <button onClick={() => setViewingAttendees(null)} className="px-5 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.1] hover:bg-gray-100 dark:hover:bg-white/[0.1] transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#120010] rounded-2xl max-w-md w-full border border-gray-100 dark:border-white/[0.06] shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
                <MdDelete className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Class</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-bold text-gray-700 dark:text-gray-200">{deletingClass.className || deletingClass.name}</span>? This action cannot be undone.
              </p>

              <form onSubmit={confirmDelete}>
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Reason for deletion (Optional)</label>
                  <textarea
                    rows="3"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="e.g., No longer offering this class, schedule conflicts..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => { setDeletingClass(null); setDeleteReason(""); }}
                    disabled={deleteLoading}
                    className="px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteLoading}
                    className="px-4 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-600/20 disabled:opacity-70 flex items-center gap-2"
                  >
                    {deleteLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <MdDelete size={16} />
                    )}
                    Confirm Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
