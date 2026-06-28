"use client";

import { useEffect, useState } from 'react';
import fetchSecure from '@/lib/fetchSecure';

export default function BookingFinalizer({ paymentData }) {
  const [status, setStatus] = useState({ loading: true, error: null, success: false });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const createBooking = async () => {
      if (!apiUrl) {
        setStatus({ loading: false, error: 'Missing NEXT_PUBLIC_API_URL', success: false });
        return;
      }

      try {
        const response = await fetchSecure(`${apiUrl}/api/classes/booking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error || body?.message || 'Booking request failed');
        }

        setStatus({ loading: false, error: null, success: true });
      } catch (err) {
        setStatus({ loading: false, error: err.message || 'Booking failed', success: false });
      }
    };

    if (paymentData?.classId && paymentData?.transactionId) {
      createBooking();
    } else {
      setStatus({ loading: false, error: 'Invalid booking data', success: false });
    }
  }, [paymentData, apiUrl]);

  if (status.loading) {
    return null;
  }

  if (status.error) {
    return (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/10 dark:text-red-200">
        <strong>Booking confirmation failed:</strong> {status.error}
      </div>
    );
  }

  return null;
}
