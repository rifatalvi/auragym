import { stripe } from '@/lib/stripe';
import { Button, Card, CardFooter, CardHeader } from '@heroui/react';
import Link from 'next/link';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import BookingFinalizer from './BookingFinalizer';

export default async function PaymentSuccess({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    });

    const paymentData = { 
        amount: session?.metadata?.amount, 
        classId: session?.metadata?.classId, 
        classTitle: session?.metadata?.className, 
        quantity: session?.metadata?.quantity, 
        email: session?.metadata?.email, 
        userId: session?.metadata?.userId,
        paymentType: "booking", 
        transactionId: session?.payment_intent?.id, 
        paymentStatus: session?.payment_status 
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-[#0B0B0D] px-6 py-12 pt-24">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent -z-10" />

            <Card className="w-full max-w-lg border border-gray-200 dark:border-white/5 bg-white/70 dark:bg-[#1C1C1F]/70 backdrop-blur-xl shadow-2xl p-4">
                <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center">
                    <div className="p-3 bg-green-500/10 rounded-full text-green-600 dark:text-green-500 border border-green-500/20 mb-2">
                        <FaCheckCircle size={48} className="animate-bounce" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                        Your class is booked. Here are your booking details.
                    </p>
                </CardHeader>

                <BookingFinalizer paymentData={paymentData} />

                <div className="gap-6 bg-gray-50 dark:bg-[#0B0B0D]/40 p-6 rounded-2xl border border-gray-200 dark:border-white/5">
                    <div className="space-y-3">
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg line-clamp-1">{session?.metadata?.className}</h3>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
                            <span>Attendee Email:</span>
                            <span className="text-gray-900 dark:text-white font-semibold">
                                {session?.customer_email}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
                            <span>Reserved Slots:</span>
                            <span className="text-gray-900 dark:text-white font-semibold"> {session?.metadata?.quantity} Ticket(s)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
                            <span>Total Amount Paid:</span>
                            <span className="text-green-600 dark:text-green-400 font-extrabold">
                                ${Number(session?.metadata?.amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
                            <span>Transaction ID:</span>
                            <span className="text-red-600 dark:text-red-400 font-semibold truncate max-w-50">
                                {session?.payment_intent?.id}
                            </span>
                        </div>
                    </div>
                </div>
                <CardFooter className="flex flex-col sm:flex-row gap-3 pt-8 justify-center">
                    <Link href="/dashboard/user/booked-classes">
                        <Button
                            className="w-full sm:w-auto bg-linear-to-r from-red-700 to-red-600 text-white font-bold h-11 px-6 shadow-lg hover:shadow-red-500/20"
                            radius="lg"
                            endContent={<FaArrowRight />}
                        >
                            View Booked Classes
                        </Button>
                    </Link>
                    <Link href="/classes">
                        <Button
                            variant="bordered"
                            className="w-full sm:w-auto border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white font-semibold h-11 px-6"
                            radius="lg"
                        >
                            Browse More Classes
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
