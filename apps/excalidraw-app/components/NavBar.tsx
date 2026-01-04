"use client"
import Logo from "@/icons/logo";
import Link from "next/link";

export default function NavBar() {
    
    return <div className="px-18 pb-4 flex items-center justify-between z-20 text-textColor">
        <a href="/" className="cursor-pointer rotate-180">
            <Logo />
        </a>
        <div className="flex gap-5 h-fit font-medium text-lg">
            <a href="#aboutUs" className="cursor-pointer">
                About Us
            </a>
            <a href="#features" className="cursor-pointer">
                Features
            </a>
        </div>
        <div className="flex bg-white h-fit rounded-full cursor-pointer">
            <Link href={"/auth/signin"} className="px-4 py-1 bg-textColor text-white rounded-full">
                Sign In
            </Link>
            <Link href={"/auth/signup"} className="px-2 pr-3 py-1">
                Sign Up
            </Link>
        </div>
    </div>
}