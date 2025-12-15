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
        if(currShape.current == "line" || currShape.current == "arrow") {
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
        if(currShape.current == "eraser") return;
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
            
            height = e.clientY - startY
            width = e.clientX - startX
            
            renderExistingElements(existingShape , canvas , ctx)
            
            if(currShape.current == "rect") {
                ctx.strokeStyle = "rgba(10, 104, 71, 1)"
                ctx.strokeRect(startX , startY , width , height)
            }
            if(currShape.current == "circle") {
                ctx.strokeStyle = "rgba(10, 104, 71, 1)"
                ctx.beginPath()
                ctx.ellipse(startX + width/2 , startY + height /2 , Math.abs(width/2) , Math.abs(height/2) ,0 , 0,2*Math.PI)
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
            if(currShape.current == "arrow") {
                ctx.beginPath()
                canvas_arrow(ctx , startX , startY , e.clientX , e.clientY )
                ctx.stroke()
            }
            if(currShape.current == "eraser") {
                existingShape = existingShape.filter((shape) => {
                    if(shape.type == "line" || shape.type == "arrow") {
                        return checkLine(e , shape.x , shape.y , shape.width , shape.height)
                    }
                    if(shape.type == "rect") {
                        let tLine = checkLine(e , shape.x , shape.y , shape.x + shape.width , shape.y)
                        let bLine = checkLine(e , shape.x , shape.y + shape.height , shape.x + shape.width , shape.y + shape.height)
                        let lLine = checkLine(e , shape.x , shape.y , shape.x , shape.y + shape.height)
                        let rLine = checkLine(e , shape.x + shape.width , shape.y , shape.x + shape.width , shape.y + shape.height)
                        
                        return (tLine && bLine && lLine && rLine)
                    }
                    if(shape.type == "circle") {
                        return checkEllipse(e.clientX , e.clientY , shape.x + shape.width/2 , shape.y + shape.height/2 , shape.width/2 , shape.height /2)
                    }
                })
                renderExistingElements(existingShape , canvas , ctx)
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
        } else if (shape.type == "circle") {
            ctx.strokeStyle = "rgba(10, 104, 71, 1)"
            ctx.beginPath()
            ctx.ellipse(shape.x + shape.width/2 , shape.y + shape.height /2 , Math.abs(shape.width/2) , Math.abs(shape.height/2) ,0 , 0,2*Math.PI)
            ctx.stroke()
        } else if (shape.type == "line") {
            ctx.strokeStyle = "rgba(10, 104, 71, 1)";
            ctx.beginPath();
            ctx.moveTo(shape.x , shape.y)
            ctx.lineTo(shape.width , shape.height)
            ctx.stroke()
        } else if(shape.type == "arrow") {
            ctx.beginPath()
            canvas_arrow(ctx , shape.x , shape.y , shape.width , shape.height )
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

function canvas_arrow(
    ctx : CanvasRenderingContext2D,
    fromx : number, 
    fromy : number, 
    tox : number, 
    toy : number
) {
  var headlen = 10;
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  ctx.strokeStyle = "rgba(10, 104, 71, 1)";
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function linepointNearestMouse(x : number , y : number , x1 : number , y1 : number , x2 : number , y2 : number) {
    const lerp = (a : number, b : number, x: number ) => {
        return (a + x * ( b - a ))
    };
    let dx = x2 - x1
    let dy = y2 - y1

    let t = ((x - x1) * dx + (y - y1) * dy)/(dx * dx + dy * dy)

    t = Math.max(0 , Math.min(1 , t))

    let lineX = lerp(x1 , x2 , t)
    let lineY = lerp(y1 , y2 , t)

    return ({
        x : lineX,
        y : lineY
    })
}

function checkLine(e : MouseEvent , x1 : number , y1 : number , x2 : number , y2 : number) {
    let linePoint = linepointNearestMouse(e.clientX , e.clientY , x1 , y1 , x2 , y2);
    let dx = e.clientX - linePoint.x
    let dy = e.clientY - linePoint.y
    let distance  = Math.abs(Math.sqrt(dx * dx + dy * dy))
    let tolerance = 5
    return distance > tolerance
}

function checkEllipse(x : number , y : number , cx : number , cy : number , rx : number , ry : number) {
    const nx = (x - cx) / rx;
    const ny = (y - cy) / ry;

    const tolerance = 0.08 + 2 / Math.max(rx , ry)

    const value = nx * nx + ny * ny;
    if(!(Math.abs(value - 1) >= tolerance)) console.log(value , Math.abs(value - 1) >= tolerance)
    return Math.abs(value - 1) >= tolerance
}