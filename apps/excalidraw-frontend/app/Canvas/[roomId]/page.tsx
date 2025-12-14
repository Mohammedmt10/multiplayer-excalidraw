"use client"
import { useEffect, useRef, useState } from "react"
import Draw from "./canvas"
import { useParams } from "next/navigation"
import { ws_url } from "@/app/config"
import ArrowIcon from "@/icons/arrowIcon"
import PenIcon from "@/icons/penIcon"


export default function Canvas() {

    //get Room ID
    const params = useParams()
    const roomId = params.roomId

    const initializedRef = useRef(false)

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [socket , setSocket] = useState<WebSocket | null>(null);

    const shapeRef = useRef("rect")
    const [currShape , setCurrShape] = useState("rect")

    const handleChange = (shape : string) => {
        shapeRef.current = shape
        setCurrShape(shape)
    }

    
    useEffect(() => {
        const ws = new WebSocket(`${ws_url}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlOWY2ZWU4My1kMDdkLTQyMzktODJlNy01NDA2NmY0YTM5NjciLCJpYXQiOjE3NjU2MjEwODR9.3wB1_521ld4kiDHEiO_4f18NlZWSpJmXamnSAtzBc1I`);
        
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type : "join_room",
                roomId : roomId
            }))
        }
        console.log(shapeRef.current)
    }, [])
    //canvas logic
    useEffect(() => {
        const canvas = canvasRef.current
        if(!socket || initializedRef.current) {
            return;
        }
        if(canvas) {
            const ctx = canvas.getContext("2d");
            if(!ctx) {
                return;
            }
            if(typeof roomId != "string") {
                return;
            }
            initializedRef.current = true
            Draw(canvas , ctx , roomId , socket , shapeRef)
        }
    }, [roomId, socket]);
    if(!socket) {
        return <div>
            Connecting to the server...
        </div>
    }
    return <div className="h-screen w-screen overflow-clip bg-green-50">
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth}>
        </canvas>
            <div className="fixed top-5 translate-x-20 right-[50%] bg-white flex rounded p-1">
                <button className={` text-black p-2 rounded ${currShape == "rect" ? "bg-[#4ed6ab] text-white" :"hover:bg-neutral-100"} cursor-pointer`} onClick={() => handleChange("rect")}>
                    <div className="border-2 w-5 h-5 rounded "></div>
                </button>
                <button className={` text-black p-2 rounded ${currShape == "circle" ? "bg-[#4ed6ab] text-white" :"hover:bg-neutral-100"} cursor-pointer`} onClick={() => handleChange("circle")}>
                    <div className="border-2 w-5 h-5 rounded-full "></div>
                </button>
                <button className={` text-black p-2 rounded ${currShape == "line" ? "bg-[#4ed6ab] text-white" :"hover:bg-neutral-100"} cursor-pointer`} onClick={() => handleChange("line")}>
                    <div className="h-0 w-5 border-t-2"></div>
                </button>
                <button className={` text-black p-2 rounded ${currShape == "arrow" ? "bg-[#4ed6ab] text-white" :"hover:bg-neutral-100"} cursor-pointer`} onClick={() => handleChange("arrow")}>
                    <div className="-rotate-90"><ArrowIcon /></div>
                </button>
                <button className={` text-black p-2 rounded ${currShape == "pen" ? "bg-[#4ed6ab] text-white" :"hover:bg-neutral-100"} cursor-pointer`} onClick={() => handleChange("pen")}>
                    <div className=""><PenIcon /></div>
                </button>
            </div>
    </div>
}