import { getServerSession } from "next-auth";
import {redirect} from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route";
import UserInfo from "@/components/pages/user-info/UserInfo";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");

  return <UserInfo />;
}