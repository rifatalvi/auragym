import SideBarManu from "@/componet/dashboard/SideBarManu";


const dashboardLayout = ({children}) => {
    return (
        <div className='flex min-h-screen'>
            <SideBarManu></SideBarManu>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
};

export default dashboardLayout;