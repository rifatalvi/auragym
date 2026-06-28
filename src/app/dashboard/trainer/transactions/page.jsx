"use client";

import React, { useState, useEffect } from "react";
import fetchSecure from '../../../../lib/fetchSecure';
import { useSession } from "@/lib/auth-client";
import { MdCreditCard, MdReceiptLong, MdCheckCircle, MdPerson } from "react-icons/md";
import Link from "next/link";

export default function TransactionsPage() {
  const { data: session, isPending } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetchSecure(`/api/trainer/${session.user.email}/bookings`);
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!isPending) fetchTransactions();
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdCreditCard className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">Earnings & Transactions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Student Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Review the students who have booked your classes and your total earnings.
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Student</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Class Booked</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
                      <MdReceiptLong className="text-2xl text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No bookings yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-6">Students haven&apos;t booked your classes yet.</p>

                    <div className="max-w-md mx-auto text-left bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mt-6">
                      <h4 className="text-sm font-bold text-red-800 dark:text-rose-400 mb-2 flex items-center gap-2"><MdCheckCircle size={16} /> Quick Tips for Trainers</h4>
                      <ul className="text-xs text-red-700/80 dark:text-rose-300/80 space-y-1.5 list-disc pl-5">
                        <li>Ensure your bank account is linked to receive payouts for your classes.</li>
                        <li>Payments for booked classes usually reflect here within 24-48 hours.</li>
                        <li>For any payment disputes, contact support with the Transaction ID.</li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tx.userDetails?.image ? (
                          <img src={tx.userDetails.image} alt={tx.userDetails.name || "Student"} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-800" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center text-gray-500">
                            <MdPerson size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                            {tx.userDetails?.name || tx.email || "Unknown Student"}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-0.5">
                            {tx.email || "No email provided"}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-0.5">
                            Phone: {tx.userDetails?.number || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/classes/${tx.classId}`} className="text-sm font-bold text-red-600 dark:text-rose-400 hover:underline">
                        {tx.classTitle || tx.classDetails?.className || "Unknown Class"}
                      </Link>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                        Tx ID: {tx.transactionId || tx._id.toString().slice(-6)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          + ${Number(tx.amount || 0).toFixed(2)}
                        </span>
                        <div className="inline-flex items-center gap-1 mt-1">
                          <MdCheckCircle size={10} className="text-green-500" />
                          <span className="text-[10px] uppercase font-semibold text-gray-500">Paid</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(tx.bookingDate || tx.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(tx.bookingDate || tx.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && transactions.length > 0 && (
          <div className="px-6 py-3.5 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01]">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Showing <span className="font-bold text-gray-700 dark:text-gray-300">{transactions.length}</span> {transactions.length === 1 ? 'booking' : 'bookings'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
