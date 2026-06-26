"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { MdCreditCard, MdReceiptLong, MdCheckCircle, MdCancel } from "react-icons/md";
import Link from "next/link";

export default function TransactionsPage() {
  const { data: session, isPending } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`$\{process.env.NEXT_PUBLIC_API_URL\}/api/users/${session.user.id}/payments`);
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdCreditCard className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">My Payments</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Review your payment history and billing receipts for booked classes.
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Transaction ID</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
                      <MdReceiptLong className="text-2xl text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No transactions found</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-6">You haven&apos;t made any payments yet.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center text-gray-500">
                          <MdReceiptLong size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-mono text-gray-900 dark:text-white truncate max-w-[200px]">
                            {tx.transactionId}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                            {tx.paymentType || "Booking"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(tx.paidAt || tx.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(tx.paidAt || tx.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ${Number(tx.amount).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400">
                        <MdCheckCircle size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">{tx.paymentStatus || "Paid"}</span>
                      </div>
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
              Showing <span className="font-bold text-gray-700 dark:text-gray-300">{transactions.length}</span> {transactions.length === 1 ? 'transaction' : 'transactions'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
