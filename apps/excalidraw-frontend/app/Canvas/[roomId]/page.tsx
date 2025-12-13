"use client"
import { useEffect, useRef } from "react"
import Draw from "./canvas"


export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if(canvas) {
            const ctx = canvas.getContext("2d");
            if(!ctx) {
                return;
            }
            Draw(canvas , ctx)
        }
    }, [canvasRef])

    return <div>
        <canvas ref={canvasRef} height={800} width={1800}>

        </canvas>
    </div>
}