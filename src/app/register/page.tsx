import { RegisForm } from "@/components/pages/register/RegisForm"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

const RegisterPage = async () => {
    const session = await getServerSession(authOptions);
    
    if (session) redirect("/dashboard");
    
    return (
        <RegisForm />
    )
}

export default RegisterPage