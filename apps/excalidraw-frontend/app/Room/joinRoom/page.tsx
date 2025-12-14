"use client"
import { http_url } from "@/app/config"
import axios from "axios"
import { useEffect, useState } from "react";

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

export default function JoinRoom() {
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


    return <div className="bg-green-100 h-screen w-screen">
        <div className="py-5 bg-green-800 text-green-100 shadow-lg text-2xl px-8">
            Rooms
        </div>

        <div className="mx-20">
            <div className="rounded-lg overflow-clip">
                <div className="flex justify-around items-center">
                    <div>
                        Room Name
                    </div>
                    <div>
                        Admin Name
                    </div>
                    <div className="w-20 py-2">
                        
                    </div>
                </div>
            </div>
            <div className="rounded-lg overflow-clip">
                {rooms?.map((room) => 
                <div key={room.id} className="flex justify-around bg-green-200 items-center">
                    <div>
                        {room.slug}
                    </div>
                    <div>
                        {room.admin.username}
                    </div>
                    <div className="w-20 py-2">
                        <button className="bg-green-700 text-green-100 px-5 rounded py-0.5">
                            Join
                        </button>
                    </div>
                </div>)}
            </div>
        </div>
    </div>
}