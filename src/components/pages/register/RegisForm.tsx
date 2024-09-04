"use client"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/react";
import { Card, Input, Button, CardHeader, CardBody, CardFooter, Chip  } from "@nextui-org/react";

export const RegisForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const router = useRouter();
  
    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!name || !email || !password) {
            setError("All fields are necessary.");
            return;
        }
    
        try {
            
            const res = await fetch("api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });
    
            const regisRes = await res.json()            
            if (res.ok) {
                const form = e.target as HTMLFormElement;
                form.reset();                
                router.push("/");
            } else {                                
                setError(regisRes.message);
            }
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    };

    return (
        <div className="grid place-items-center h-screen">
            <Card className="max-w-[340px]">
                <CardHeader>
                    <h1 className="text-xl font-bold my-4">Register</h1>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <Input
                            value={name}
                            onValueChange={setName}
                            type="text"
                            placeholder="Name"
                        />
                        <Input
                            value={email}
                            onValueChange={setEmail}
                            type="text"
                            placeholder="Email"
                        />
                        <Input
                            value={password}
                            onValueChange={setPassword}
                            type="password"
                            placeholder="Password"
                        />
                    </form>
                </CardBody>
                <CardFooter className="flex flex-col items-stretch">
                    <div className="flex items-center justify-end basis-full">
                        <Button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2"
                            type="submit"
                        >
                            Register
                        </Button>
                    </div>
                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                        </div>
                    )}

                    <Link className="text-sm mt-3 text-right" href={"/"}>
                        Already have an account? <span className="underline">Login</span>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}