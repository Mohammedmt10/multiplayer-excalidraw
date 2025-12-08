import express from "express"
import dotenv from "dotenv";
dotenv.config();

import { prisma } from "@repo/db/client";
import { signinUserSchema, createRoomSchema , createUserSchema } from "@repo/common/types";
import { middleware } from "./middleware";

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
            return res.json({
                message : "user already exists"
            })
        }
        const createUser = await prisma.user.create({
            data : {
                username : newUser.username,
                password : newUser.password,
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

app.post("/signin" , (req , res) => {
    const safeParsed = signinUserSchema.safeParse(req.body)

    if(!safeParsed.success) {
        return res.status(400).json({
            message : "invalid input"
        })
    }
})

app.post("/room" , middleware , (req , res) => {
    const safeParsed = createRoomSchema.safeParse(req.body)

    if(!safeParsed.success) {
        return res.status(400).json({
            message : "invalid input"
        })
    }
})

app.listen(3001)