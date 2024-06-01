import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { RABList } from "@/components/pages/RAB";
import { useRedirectBySession } from "@/components/hooks/useRedirectBySession";

const RABPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session){ redirect("/") }
    
    return (
        <RABList />
    )
}

export default RABPage