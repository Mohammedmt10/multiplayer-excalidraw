"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const params = useParams().AuthPage;
  const [isSignIn, setIsSignIn] = useState(params == "SignIn" ? true : false);
    return <div className="h-screen w-screen flex items-center">
        <div className="w-full h-screen flex justify-center flex-col items-center gap-10">
            <div className="text-4xl font-semibold">
                {isSignIn ? "Sign In" : "Sign Up"}
            </div>
            <div className="text-lg">
                <div className="leading-10">
                    Username :<br />
                    <input type="text" placeholder="Username" className="leading-4 bg-neutral-100 py-3 w-80 px-4 rounded-md outline-none" />
                </div>
                <div className="leading-10">
                    Password :<br />
                    <input type="password" placeholder="Password" className="leading-4 bg-neutral-100 py-3 w-80 px-4 rounded-md outline-none" />
                </div>
                {!isSignIn && <div>
                    Name :<br />
                    <input type="text" placeholder="Name" className="leading-4 bg-neutral-100 py-3 w-80 px-4 rounded-md outline-none" />
                </div>}
                <button className="w-full duration-300 hover:bg-green-600 bg-[#0ca070] py-2 mt-4 rounded-md text-white cursor-pointer">{isSignIn ? "Sign In" : "Sign Up"}</button>
                <div className="my-2 text-center">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"} <span className="text-blue-600 cursor-pointer underline" onClick={() => setIsSignIn(c => !c)}>{isSignIn ? "Sign Up" : "Sign In"}</span>
                </div>
            </div>
        </div>
        <div className="w-full h-full bg-[#0ca070] flex justify-center items-center text-center text-white">
                <div>
                    <div className="text-3xl font-semibold mb-4">
                        {isSignIn ? "Welcome Back to Excalidraw Multiplayer" : "Welcome to Excalidraw Multiplayer"}
                    </div>
                    <div className="text-lg">
                            Collaborate with your friends in real time <br /> 
                            and bring your ideas to life on shared Excalidraw boards.
                    </div>
                </div>
        </div>
    </div>
}