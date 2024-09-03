'use client'
import { signOut } from "next-auth/react"
import { Button } from "@nextui-org/react"

export const MainPageContent = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Button color="primary"
                onPress={()=>{signOut()}}
            >
                Sign Out
            </Button>
        </div>
    )
}