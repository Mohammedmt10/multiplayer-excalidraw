import express from "express"
import dotenv from "dotenv";
import { prisma } from "@repo/db/client";
import { signinUserSchema, createRoomSchema , createUserSchema } from "@repo/common/types";
import { middleware } from "./middleware";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import ca from "zod/v4/locales/ca.js";
import { includes } from "zod";

dotenv.config();
const app = express()
app.use(express.json())

app.post("/signup" , async (req , res) => {
    
    const safeParsed = createUserSchema.safeParse(req.body);

    if(!safeParsed.success) {
        return res.status(400).json({
            message : "invalid inputs"
        })
    }

    const newUser = safeParsed.data
    
    try {
        const existingUser = await prisma.user.findUnique({
            where : {
                username : newUser.username
            }
        })
        
        if(existingUser) {
            return res.status(411).json({
                message : "user already exists"
            })
        }
        
        const hashedPassword = await bcrypt.hash(newUser.password , 5)
        const createUser = await prisma.user.create({
            data : {
                username : newUser.username,
                password : hashedPassword,
                name : newUser.name
            }
        })
        if(createUser.id) {
            return res.json({
                message : "user has been created"
            })
        }
    } catch(e) {
        return res.json({
            message : e
        })
    }

})

app.post("/signin" , async (req , res) => {
    const safeParsed = signinUserSchema.safeParse(req.body)

    if(!safeParsed.success) {
        return res.status(400).json({
            message : "invalid input"
        })
    }

    const userData = safeParsed.data;

    try {
        const user = await prisma.user.findFirst({
            where : {
                username : userData.username
            }
        });

        if(!user) {
            return res.status(403).json({
                message : "not authorized"
            });
        }

        const passwordVerification = await bcrypt.compare(userData.password , user.password)
    
        if(!passwordVerification) {
            return res.status(401).json({
                message : "incorrect username or password"
            })
        }
        const token = jwt.sign({
            userId : user.id
        }, JWT_SECRET)
    
        res.status(200).json({
            token
        })
    } catch (e) {
        return res.json({
            message : "something went wrong"
        })
    }
})

app.post("/room" , middleware , async (req , res) => {
    const safeParsed = createRoomSchema.safeParse(req.body)

    if(!safeParsed.success) {
        return res.status(400).json({
            message : "invalid input"
        })
    }

    const userId = req.userId
    const safeData = safeParsed.data

    try {
        const newRoom = await prisma.room.create({
            data : {
                slug : safeData.roomName,
                adminId : userId
            }
        })

        return res.json({
            newRoom
        })
    } catch (e) {
        return res.status(400).json({
            message : "something went wrong"
        })
    }
})

app.get("/chats/:roomId" , middleware , async(req , res , next) => {
    const roomId = Number(req.params["roomId"]);
    const userId = req.userId;

    try {
        const roomAccess = await prisma.room.findFirst({
            where : {
                id : roomId,
                members : {
                    some : { id : userId }
                }
            },
        });

        if(!roomAccess) {
            return res.status(403).json({
                message : "access denied"
            })
        }
        const messages = await prisma.chat.findMany({
            where : {
                roomId : roomId
            },
            orderBy : {
                Id : "desc"
            }, 
            take : 50
        })
        return res.json({
            messages
        })
    } catch (e) {
        return res.status(400).json({
            message : "something went wrong"
        })
    }
})

app.listen(3001)