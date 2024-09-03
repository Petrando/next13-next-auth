'use client'

import React from "react";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { signOut } from "next-auth/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {motion} from "framer-motion"
//import {AcmeLogo} from "./AcmeLogo.jsx";

export function Navigation() {
    //const session = getServerSession(authOptions)
    const { data: session, status } = useSession()

    if(status === 'unauthenticated'){
        return null
    }
    return (
        <Navbar maxWidth="full">
            <NavbarBrand>
                {/*<AcmeLogo />*/}
                <p className="font-bold text-inherit">Kreativitas Muda Nusantara</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="end">
                <NavbarItem isActive>
                    <Link href="/RAB" aria-current="page">
                        Content
                    </Link>
                </NavbarItem>
                {/*
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Penerima
                    </Link>
                </NavbarItem>
                
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Bantuan
                    </Link>
                </NavbarItem>
                */}
            </NavbarContent>
            <NavbarContent justify="end">
                {
                    /*
                    <NavbarItem className="hidden lg:flex">
                        <Link href="#">Login</Link>
                    </NavbarItem>
                    */
                }
                
                <NavbarItem>
                    <Button color="primary" href="#" variant="flat" onClick={()=>{signOut()}}>
                        Logout
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
