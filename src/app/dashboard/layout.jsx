import SideBarManu from "@/componet/dashboard/SideBarManu";
import DashboardHeader from "@/componet/dashboard/DashboardHeader";

const dashboardLayout = ({children}) => {
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

export default dashboardLayout;