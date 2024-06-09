"use client"

import { FormEvent } from "react";
//import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/react";
import { Button } from '@nextui-org/button';

export const LoginForm = () => {
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                name,
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid Credentials");
                return;
            }

            console.log(res)
            router.replace("RAB");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
                <h1 className="text-xl font-bold my-4">Login</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    onChange={(e) => {setName(e.target.value)}}
                    type="text"
                    placeholder="name"
                />
                <input
                    onChange={(e) => {setPassword(e.target.value)}}
                    type="password"
                    placeholder="Password"
                />
                <Button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2"
                    type="submit"
                >
                    Login
                </Button>
                {error && (
                    <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                    {error}
                    </div>
                )}
                {
                    /*
                    <Link className="text-sm mt-3 text-right" href={"/register"}>
                        Don{`'`}t have an account? <span className="underline">Register</span>
                    </Link>
                    */
                }
                
                </form>
            </div>
        </div>
    )
}