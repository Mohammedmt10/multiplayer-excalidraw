'use client'
import { Button } from "@repo/ui/button";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import { http_url } from "../config";
import Link from "next/link";

interface IRooms {
    id : string,
    slug : string,
    admin : Admin
}

interface Admin {
  id: string;
  name: string;
  username: string;
}


export default function RoomPage() {

     const [rooms , setRooms] = useState<IRooms[]>();
    const [loading , setLoading] = useState(false)
    const getRooms = async () => {
        setLoading(true)
        try {
         const res = await axios.get(`${http_url}/rooms`, {
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            });
            if(res.data.rooms) {        
                setRooms(res.data.rooms)
                setLoading(true)
            }
        } finally {
            setLoading(false)
        }

        
    }
    
    useEffect(() => {
        getRooms();
    },[])

    const joinNewRoom = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        const formData = new FormData(form);
        
        const roomName = formData.get("joinRoomName")
        const roomPassword = formData.get("joinRoomPassword")

        const res = await axios.post(`${http_url}/joinRoom` , {
            roomName,
            roomPassword
        }, {
            headers : {
                Authorization : localStorage.getItem('token')
            }
        })

        if(res.data) {
            window.location.href = `http://localhost:3000/canvas/${res.data.roomId}`
        }
    }

    const createHandler = async (e : FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();

        const form = e.currentTarget;

        const formData = new FormData(form);
        
        const roomName = formData.get("createRoomName")
        const roomPassword = formData.get("createRoomPassword")

        const res = await axios.post(`${http_url}/room` , {
            roomName : roomName,
            roomPassword : roomPassword
        } , {
            headers : {
                Authorization : localStorage.getItem("token")
            }
        });

        if(res.data) {
            window.location.href = `http://localhost:3000/canvas/${res.data.newRoom.id}`
        }
    }

    return <div className="h-screen w-screen bg-linear-to-tr flex px-10 from-gradientGreen to-gradientBlue py-10">
        <Snowfall color="#fff"/>
        <div className="border-2 border-white w-full px-5 mx-10 backdrop-blur-xl bg-[#ffffff2e] h-full rounded">
            <div className="text-center text-2xl font-bold font-heading text-textColor py-1 mt-5">
                Rooms
            </div>
            {rooms?.map((room) => (
                <div key={room.id} className="w-full">
                    <div  className="flex justify-between items-center">
                        <div>
                            {room.slug} 
                        </div>
                        <div>
                            {room.admin.username}
                        </div>
                        <Link href={`/canvas/${room.id}`}>
                            <Button size="sm" varient="secondary" type="submit">Join</Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
        <div className="w-full flex flex-col gap-6">
            <form onSubmit={createHandler} className="w-full h-1/2 border-2 border-white px-10 backdrop-blur-xl bg-[#ffffff2e] rounded pt-5">
                <div className="text-center text-2xl font-bold font-heading text-textColor py-1 mt-5">
                    Create Room
                </div>
                <div className="py-2 text-center px-40">
                    <input name="createRoomName" type="text" className=" w-full text-center border border-white rounded px-3 py-1 text-textColor outline-none" placeholder="Room Nme"/>
                    <input name="createRoomPassword" type="password" className="my-4 w-full text-center border border-white rounded px-3 py-1 text-textColor outline-none" placeholder="Room Password"/>
                    <Button varient="secondary" size="lg" type="submit">Create Room</Button>
                </div>
            </form>
            <form onSubmit={joinNewRoom} className="w-full h-1/2 border-2 border-white px-10 backdrop-blur-xl bg-[#ffffff2e] rounded pt-5">
                <div className="text-center text-2xl font-bold font-heading text-textColor py-1 mt-5">
                    Join Room
                </div>
                <div className="py-2 text-center px-40">
                    <input name="joinRoomName" type="text" className=" w-full text-center border border-white rounded px-3 py-1 text-textColor outline-none" placeholder="Room Nme"/>
                    <input name="joinRoomPassword" type="password" className="my-4 w-full text-center border border-white rounded px-3 py-1 text-textColor outline-none" placeholder="Room Password"/>
                    <Button varient="secondary" size="lg" type="submit">Join Room</Button>
                </div>
            </form>
        </div>
    </div>
}