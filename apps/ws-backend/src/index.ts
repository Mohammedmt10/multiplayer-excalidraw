import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db/client"
const wss = new WebSocketServer({ port : 8081 })

interface IUsers {
    ws : WebSocket,
    rooms : string[],
    userId : string
}

const users : IUsers[] = []

function checkUser(token : string) : string | null {
    const decoded = jwt.verify(token , JWT_SECRET)

    if(typeof decoded == "string") {
        return null;
    }

    if(!decoded || !decoded.userId) {
        return null;
    }
    return decoded.userId;
}

wss.on("connection" , function connection(ws , request) {
    const url = request.url;

    if(!url) {
        return ;
    }

    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get('token') || "";
    
    try {
        const userId = checkUser(token)

        if(userId == null) {
            ws.close()
            return null;
        }
        
            users.push({
                ws : ws,
                rooms : [],
                userId
            });
            
            ws.on("message" , async function message(data) {
                const parsedData = JSON.parse(data.toString())
                if(parsedData.type === "join_room") {
                    const user = users.find(x => x.ws == ws)
                    try {
                        const connected = await prisma.room.update({
                            where : {
                                id : Number(parsedData.roomId)
                            },
                            data : {
                                users : {
                                    connect : {
                                        id : userId
                                    }
                                }
                            }
                        });
                    } catch (e) {
                        ws.close()
                        return;
                    }
                    user?.rooms.push(parsedData.roomId)
                }
                
                if(parsedData.type == "leave_room") {
                    const user = users.find(x => x.ws == ws)
                    if(!user) {
                        ws.close()
                        return null;
                    }
                    await prisma.room.update({
                        where : {
                            id : parsedData.roomId
                        },
                        data : {
                            users : {
                                disconnect : { id : userId }
                            }
                        }
                    })
                    user.rooms = user?.rooms.filter(x => x === parsedData.room)
                }
                
                if(parsedData.type == "chat") {
                    const roomId = Number(parsedData.roomId);
                    const message = parsedData.messages
                    
                    const chat = await prisma.chat.create({
                        data : {
                            roomId : roomId,
                            message : message,
                            userId : userId,
                            shapeId : JSON.parse(message).shapeId
                        }
                    })

                    if(chat.Id) {
                        users.forEach(user => {
                            if(user.rooms) {
                                user.ws.send(JSON.stringify({
                                    type : "chat",
                                    message : message,
                                    roomId
                                }))
                            }
                        })
                    }
                }
                if(parsedData.type == "delete") {
                    console.log(JSON.parse(parsedData.shapeId))
                    await prisma.chat.delete({
                        where : {
                            shapeId : JSON.parse(parsedData.shapeId)
                        }
                    })
                }
            })
    } catch (e) {
        ws.close();
        return;
    }
})