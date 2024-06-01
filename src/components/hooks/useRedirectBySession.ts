import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const useRedirectBySession = async ({toLogin}:{toLogin:boolean}) => {
    const session = await getServerSession(authOptions);

    console.log(toLogin)
    console.log(session)
    if(toLogin && !session){
        return redirect("/")
    }

    if(!toLogin && session){
        return redirect("/RAB")
    }

    return null
}