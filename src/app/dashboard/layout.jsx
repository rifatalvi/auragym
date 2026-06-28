"use client";

import React, { useEffect, useState } from "react";
import fetchSecure from '../../lib/fetchSecure';
import SideBarManu from "@/componet/dashboard/SideBarManu";
import DashboardHeader from "@/componet/dashboard/DashboardHeader";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DashboardLayout = ({children}) => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            if (isPending) return;
            
            if (!session?.user) {
                router.push('/');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;
                const res = await fetchSecure(`/api/users/${session.user.email}/stats`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.userStatus === 'blocked') {
                        // User is blocked, kick them out to home
                        router.push('/');
                        setTimeout(() => {
                           alert("Your account has been restricted by an Admin. You cannot access the dashboard.");
                        }, 500);
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to check status", err);
            }
            
            setIsChecking(false);
        };

        checkStatus();
    }, [session, isPending, router]);

    if (isPending || isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50/30 dark:bg-[#0a0007]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen bg-gray-50/30 dark:bg-[#0a0007]'>
            <SideBarManu></SideBarManu>
            <div className='flex-1 flex flex-col min-w-0'>
                <DashboardHeader />
                <main className='flex-1 p-6 overflow-y-auto'>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;