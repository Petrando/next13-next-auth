import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../api/auth/[...nextauth]/route";


const RABDetailPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session){ redirect("/") }    
    
    return (
        <div className="flex items-center justify-center">
            <p className="font-semibold">Charity RAB detail</p>
        </div>
    )
}

export default RABDetailPage