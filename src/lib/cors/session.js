import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })

    return session?.user || null;
}

export const RequireRole = async (role) => {
    const user = await getUserSession();
    if(!user) {
        redirect("/auth/signin");
    }
    // Accept a single role string or an array of roles
    const allowedRoles = Array.isArray(role) ? role : [role];
    if(!allowedRoles.includes(user?.role)) {
        redirect("/unauthorized");
    }

}