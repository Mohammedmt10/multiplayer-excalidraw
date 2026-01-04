"use client";
import { http_url } from "@/app/config";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export default function AuthPage() {

    const params = useParams().authpage;
    const [isSignIn, setIsSignIn] = useState(params == "signin" ? true : false);

    
    const buttonHandler = async (e : FormEvent<HTMLFormElement>) => {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.currentTarget;

        const formData = new FormData(form);
        
        const username = formData.get("username");
        const password = formData.get("password")
        if(isSignIn) {
            const res = await axios.post(`${http_url}/signin`,{
                username : username,
                password : password,
            })
            if(res.data) {
                localStorage.setItem("token" , res.data.token)
                window.location.href = "http://localhost:3000/"
            }
        } else {
            const name = formData.get("name")
            const res = await axios.post(`${http_url}/signup`,{
                username : username,
                password : password,
                name : name
            })
            if(res.data) {
                window.location.href = "http://localhost:3000/SignIn"
            }
        }
    }

    return <div className="h-screen w-screen flex items-center text-textColor font-titillium">
        <div className="w-full h-screen flex justify-center flex-col items-center gap-10">
            <div className="text-4xl font-semibold font-heading">
                {isSignIn ? "Sign In" : "Sign Up"}
            </div>
            <form onSubmit={buttonHandler} className="text-lg">
                <div className="leading-10">
                    Username :<br />
                    <input type="text" name="username" placeholder="Username" className="leading-4 bg-neutral-100 py-3 w-80 px-4 rounded-md outline-none" />
                </div>
                <div className={`leading-10 ${isSignIn ? "mb-4" :""}`}>
                    Password :<br />
                    <input type="password" name="password" placeholder="Password" className="leading-4 bg-neutral-100 py-3 w-80 px-4 rounded-md outline-none" />
                </div>
                {!isSignIn && <div className="mb-4">
                    Name :<br />
                    <input type="text" name="name" placeholder="Name" className="leading-4 bg-neutral-100 py-3 w-80 px-4 rounded-md outline-none" />
                </div>}
                <Button size="lg" varient="primary" type={"submit"}>{isSignIn ? "Sign In" : "Sign Up"}</Button>
                <div className="my-2 text-center">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"} <span className="text-blue-600 cursor-pointer underline" onClick={() => setIsSignIn(c => !c)}>{isSignIn ? "Sign Up" : "Sign In"}</span>
                </div>
            </form>
        </div>
        <div className="w-full h-full bg-gradientGreen flex justify-center items-center text-center">
                <div>
                    <div className="text-4xl font-semibold mb-4 font-heading">
                        {isSignIn ? "Welcome Back to Excalidraw Multiplayer" : "Welcome to Excalidraw Multiplayer"}
                    </div>
                    <div className="text-lg font-titillium font-medium">
                            Collaborate with your friends in real time <br /> 
                            and bring your ideas to life on shared Excalidraw boards.
                    </div>
                </div>
        </div>
    </div>
}