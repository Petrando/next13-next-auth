import { LoginForm } from "@/components/pages/login/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LoginForm />
    </main>
  );
}
