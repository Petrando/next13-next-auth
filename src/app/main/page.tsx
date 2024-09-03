import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MainPageContent } from "@/components/pages/main";

const RABPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session){ redirect("/") }
    
    return (
        <MainPageContent />
    )
}

export default RABPage