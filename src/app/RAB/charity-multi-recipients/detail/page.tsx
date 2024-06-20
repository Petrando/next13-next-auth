import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { RABDetail } from "@/components/pages/RAB/charity-multi-recipients/detail";

const RABDetailPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session){ redirect("/") }    
    
    return (
        <RABDetail />
    )
}

export default RABDetailPage