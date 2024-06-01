import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { AddRAB } from "@/components/pages/RAB/add";

const AddRABPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session){ redirect("/") }
    
    return (
        <AddRAB />
    )
}

export default AddRABPage