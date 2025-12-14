"use client"
import { http_url } from "@/app/config";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { FormEvent } from "react";

export default function JoinRoom() {

    const onClickHandler = async (e : FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();

        const form = e.currentTarget;

        const formData = new FormData(form);
        
        const roomName = formData.get("roomName")

        const res = await axios.post(`${http_url}/room` , {
            roomName : roomName
        } , {
            headers : {
                Authorization : localStorage.getItem("token")
            }
        });

        if(res.data) {
            window.location.href = `http://localhost:3000/canvas/${res.data.newRoom.id}`
        }
    }

    return <div className="h-screen w-screen bg-green-50">
        <div className="py-5 bg-green-800 text-green-100 shadow-lg text-2xl px-8">
            Create rooms
        </div>
        <div className="flex justify-center h-full -translate-y-20 items-center">
            <form onSubmit={onClickHandler} className="w-fit h-fit border-2 px-20 pb-10 rounded border-green-700">
                <div className="text-center text-3xl my-6">
                    Create a room
                </div>
                <div>
                    Room Name : <br />
                    <input name="roomName" type="text" className="bg-green-200 w-full my-2 py-1.5 px-4 rounded outline-0" />
                </div>
                <Button type="submit" size="lg" varient="primary">Create Room</Button>
            </form>
        </div>
    </div>
}