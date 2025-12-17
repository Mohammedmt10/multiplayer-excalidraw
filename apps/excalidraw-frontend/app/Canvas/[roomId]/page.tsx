"use client"
import { useEffect, useRef, useState } from "react"
import Draw, { renderExistingElements } from "./canvas"
import { useParams } from "next/navigation"
import { ws_url } from "@/app/config"
import ArrowIcon from "@/icons/arrowIcon"
import EraserIcon from "@/icons/eraserIcon"
import { existingShape } from "./canvas"

interface IinputBox {
    type : string,
    x : number,
    y : number
}


export default function Canvas() {

    //get Room ID
    const params = useParams()
    const roomId = params.roomId

    const initializedRef = useRef(false)
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    const [socket , setSocket] = useState<WebSocket | null>(null);
    
    const shapeRef = useRef("rect")
    const inputRef = useRef<HTMLInputElement>(null)
    const [currShape , setCurrShape] = useState("rect")
    
    const [inputBox , setInputBox] = useState<IinputBox>({
        type : currShape,
        x : 0,
        y : 0
    })
    const handleChange = (shape : string) => {
        shapeRef.current = shape
        setCurrShape(shape)
    }
    
    useEffect(() => {
        const ws = new WebSocket(`${ws_url}?token=${localStorage.getItem("token")}`);
        
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type : "join_room",
                roomId : roomId
            }))
        }
    }, [])

    function addInput(x : number , y : number) {
        if(currShape != "text") return;
        setInputBox({
            x : x,
            y : y - 10,
            type : currShape
        })
    }
    const ctxRef = useRef<CanvasRenderingContext2D>(null)
    //canvas logic
    useEffect(() => {
        if(initializedRef.current) {
            return;
        }
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        if(canvas) {
            if(!canvas) return;
            ctxRef.current = canvas.getContext("2d");
            if(!ctxRef.current) {
                return;
            }
            if(typeof roomId != "string") {
                return;
            }
            initializedRef.current = true
            const token = localStorage.getItem("token") || ""
            Draw(canvas , ctxRef.current , roomId , socket , shapeRef , token , inputRef)
        }
    }, [roomId, socket]);
    
    

    if(!socket) {
        return <div>
            Connecting to the server...
        </div>
    }
    return <div className="h-screen w-screen overflow-clip bg-green-50" >
        {inputBox.type == "text" && <input ref={inputRef} name="inputRef" type="text"
        className={`absolute outline-0 focus:select-auto text-[24px] font-arial`}
        style={{
            left : inputBox.x,
            top : inputBox.y - 10
        }}
        autoComplete="off"
        onKeyDown={(e) => {
            if(e.key == "Enter") {
                setCurrShape("rect")
                setInputBox((prev) => ({...prev , type : "rect"}))
                if(!inputRef.current) return
                if(!ctxRef.current) return
                ctxRef.current.font = "24px Arial"
                const width = ctxRef.current.measureText(inputRef.current.value).width
                existingShape.push({
                    type : "text",
                    x : inputBox.x,
                    y : inputBox.y,
                    text : inputRef.current.value,
                    width : width,
                    height : 24
                });
                socket.send(JSON.stringify({
                    type : "chat",
                    roomId,
                    messages : JSON.stringify({
                        shapeId : currShape + inputBox.x + inputBox.y + width + inputRef.current.value,
                        type : currShape,
                        x : inputBox.x,
                        y : inputBox.y,
                        width : width,
                        height : 24,
                        text : inputRef.current.value
                    })
                }))
                const canvas = canvasRef.current
                if(canvas && ctxRef.current)
                renderExistingElements(existingShape , canvas , ctxRef.current)
            }
        }}
        />}
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} onClick={(e : any) => {
            addInput(e.clientX , e.clientY);
        }}></canvas>
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
                <button className={` text-black p-2 rounded ${currShape == "text" ? "bg-[#4ed6ab] text-white" :"hover:bg-neutral-100"} cursor-pointer`} onClick={() => handleChange("text")}>
                    <div className="w-5 h-5 text-xl flex items-center px-0.5">A</div>
                </button>
                <button className={` text-black p-2 rounded ${currShape == "eraser" ? "bg-[#4ed6ab] text-white" :"hover:bg-neutral-100"} cursor-pointer`} onClick={() => handleChange("eraser")}>
                    <div className=""><EraserIcon /></div>
                </button>
            </div>
    </div>
}