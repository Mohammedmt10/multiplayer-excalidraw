import { http_url } from "@/app/config";
import axios from "axios"
import { RefObject } from "react";

type Shape = {
    type : string,
    x : number,
    y : number,
    width : number,
    height : number
}


export default async function Draw(
    canvas : HTMLCanvasElement , 
    ctx : CanvasRenderingContext2D,
    roomId : string,
    socket : WebSocket | null,
    currShape : {current : string}
) {
    
    let existingShape : Shape[] = [];
    const previousElements = await getExistingElements(roomId)
    previousElements.map((element : any) => {
        existingShape.push(JSON.parse(element.message))
    })
    renderExistingElements(existingShape , canvas , ctx)

    const getPos = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };


    if(socket) {

        socket.onmessage = (event) => {
            const shapes = JSON.parse(event.data);
            if(shapes.type == "chat") {
                if (typeof shapes.message !== "string") return;
                existingShape.push(JSON.parse(shapes.message))
                renderExistingElements(existingShape , canvas , ctx)
            }
        }
    }
    
    let clicked = false
    let startX = 0;
    let startY = 0;
    
    let width = 0;
    let height = 0;
    canvas.addEventListener("mousedown" , (e) => {
        startX = e.clientX
        startY = e.clientY
    
        clicked = true
    })
    
    
    canvas.addEventListener("mouseup" , (e) => {
        clicked = false;
        
        console.log(currShape.current)
        if(currShape.current == "line") {
            height = e.clientY;
            width = e.clientX
        } else {
            height = e.clientY - startY
            width = e.clientX - startX

        }
        existingShape.push({
            type : currShape.current,
            x : startX,
            y : startY,
            width : width,
            height : height
        })
        renderExistingElements(existingShape , canvas , ctx)
        socket?.send(JSON.stringify({
            type : "chat",
            roomId,
            messages : JSON.stringify({
                type : currShape.current,
                x : startX,
                y : startY,
                width : width,
                height : height
            })
        }));
    })
    canvas.addEventListener("mousemove" , (e) => {
        if(clicked) {
            const {x , y} = getPos(e)
            height = e.clientY - startY
            width = e.clientX - startX
            
            renderExistingElements(existingShape , canvas , ctx)
            
            if(currShape.current == "rect") {
                ctx.strokeStyle = "rgba(10, 104, 71, 1)"
                ctx.strokeRect(startX , startY , width , height)
            }
            if(currShape.current == "circle") {
                ctx.strokeStyle = "rgba(10, 104, 71, 1)"
                let radius = Math.hypot(height , width)
                ctx.beginPath()
                ctx.arc(startX, startY, radius , 0 , 2*Math.PI)
                ctx.stroke()
            }
            if(currShape.current == "line") {
                ctx.strokeStyle = "rgba(10, 104, 71, 1)";
                ctx.beginPath();
                console.log(width , height)
                ctx.moveTo(startX , startY)
                ctx.lineTo(e.clientX , e.clientY)
                ctx.lineWidth = 2;
                ctx.stroke()
            }
        }
    });
    
    
}

function renderExistingElements(
    existingShape : Shape[] ,
    canvas : HTMLCanvasElement,
    ctx : CanvasRenderingContext2D
) {
    
    
    ctx.clearRect(0 , 0 , canvas.width , canvas.height)
    
    ctx.fillStyle = "rgba(236, 253, 245, 1)"
    ctx.fillRect(0 , 0 , canvas.width , canvas.height)
    existingShape.map((shape : Shape) => {
        
        if(shape.type == "rect") {
             ctx.strokeStyle = "rgba(10, 104, 71, 1)"
             ctx.strokeRect(shape.x , shape.y , shape.width , shape.height)
        }
        if(shape.type == "circle") {
            ctx.strokeStyle = "rgba(10, 104, 71, 1)"
            let radius = Math.hypot(shape.width , shape.height)
            ctx.beginPath()
            ctx.arc(shape.x , shape.y , radius ,0,2*Math.PI)
            ctx.stroke()
        }
        if(shape.type == "line") {
            ctx.strokeStyle = "rgba(10, 104, 71, 1)";
            ctx.beginPath();
            ctx.moveTo(shape.x , shape.y)
            ctx.lineTo(shape.width , shape.height)
            ctx.lineWidth = 2;
            ctx.stroke()
        }
    })
}

async function getExistingElements(roomId : string) {

    const res = await axios.get(`${http_url}/chats/${roomId}` , {
        headers : {
            Authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlOWY2ZWU4My1kMDdkLTQyMzktODJlNy01NDA2NmY0YTM5NjciLCJpYXQiOjE3NjU2MjEwODR9.3wB1_521ld4kiDHEiO_4f18NlZWSpJmXamnSAtzBc1I"
        }
    })
    
    const data = res.data.messages;

    return data
}