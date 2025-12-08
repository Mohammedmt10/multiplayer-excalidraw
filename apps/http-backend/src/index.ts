import express from "express"
import { prisma } from "@repo/db";
import { signinUserSchema, createRoomSchema , createUserSchema } from "@repo/common/types";
import { middleware } from "./middleware";
const app = express()

app.post("/signup" , async (req , res) => {
    const safeParsed = createUserSchema.safeParse(req.body);

    if(!safeParsed.success) {
        return res.status(400).json({
            message : "invalid inputs"
        })
    }

    const newUser = safeParsed.data

    const existingUser = await prisma.user.findFirst({
        where : {
            email : newUser.email
        }
    })

    if(existingUser) {
        return res.json({
            message : "user already exists"
        })
    }

    const createUser = await prisma.user.create({
        data : {
            
        }
    })
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

app.listen(3000)