"use client"

import { FormEvent } from "react";
import { Card, Input, Button, CardHeader, CardBody, CardFooter, Chip  } from "@nextui-org/react";
//import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/react";

export const LoginForm = () => {    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fetchState, setFetchState] = useState("")

    const router = useRouter();

    const handleSubmit = async (/*e:FormEvent<HTMLFormElement>*/) => {
        //e.preventDefault();
        setFetchState("logging")
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
        } finally {
            setFetchState("")
        }
    };
    return (
        <div className="grid place-items-center h-screen">
            <Card className="max-w-[340px]">
                <CardHeader>
                    <h1 className="text-xl font-bold my-4 text-center w-full">Login</h1>
                </CardHeader>
                <CardBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <Input
                        value={name}
                        onValueChange={setName}
                        type="text"
                        placeholder="nama login"
                        disabled={fetchState === "logging"}                        
                    />
                    <Input  
                        value={password}
                        onValueChange={setPassword}
                        type="password"
                        placeholder="password"
                        disabled={fetchState === "logging"}                        
                    />
                </form>
                </CardBody>
                <CardFooter className="px-2 flex flex-wrap">
                    <div className="w-full flex justify-end">
                        <Button 
                            color="primary"
                            onPress={(e)=>{
                                handleSubmit()
                            }}
                            disabled={fetchState === "logging"}                        
                        >
                            Login
                        </Button>                
                    </div>
                    {error && (
                        <Chip color="danger">
                            {error}
                        </Chip>
                    )}
                    {
                        /*
                        <Link className="text-sm mt-3 text-right" href={"/register"}>
                            Don{`'`}t have an account? <span className="underline">Register</span>
                        </Link>
                        */
                    }
                </CardFooter>
                
            </Card>
        </div>
    )
}