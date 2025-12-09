import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"

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
            
            ws.on("message" , function message(data) {
                const parsedData = JSON.parse(data.toString())
                if(parsedData.type === "join_room") {
                    const user = users.find(x => x.ws == ws)
                    user?.rooms.push(parsedData.roomId)
                }
                
                if(parsedData.type == "leave_room") {
                    const user = users.find(x => x.ws == ws)
                    if(!user) {
                        ws.close()
                        return null;
                    }
                    user.rooms = user?.rooms.filter(x => x === parsedData.room)
                }
                
                if(parsedData.type == "chat") {
                    const roomId = parsedData.roomId;
                    const message = parsedData.message
                    
                    users.forEach(user => {
                        if(user.rooms.includes(roomId)) {
                            user.ws.send(JSON.stringify({
                                type : "chat",
                                message : message,
                                roomId
                            }))
                        }
                    })
                }
            })
    } catch (e) {
        ws.close();
        return;
    }
})