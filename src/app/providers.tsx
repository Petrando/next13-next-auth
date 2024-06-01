"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import {NextUIProvider} from '@nextui-org/react'
import { Navigation } from "@/components/navbar";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    return (
        <NextUIProvider>
            <SessionProvider>
                <Navigation />
                {children}
            
            </SessionProvider>
        </NextUIProvider>
        );
};
