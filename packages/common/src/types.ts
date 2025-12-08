import { z } from "zod";

export const createUserSchema = z.object({
    name : z.string(),
    username : z.string().min(3).max(40),
    password : z.string().min(3).max(40).regex(/^(?=.*[!@#$%^&*()_+-={}:";'>?./<,])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/)
})

export const signinUserSchema = z.object({
    username : z.string().min(3).max(40),
    password : z.string().min(3).max(40).regex(/^(?=.*[!@#$%^&*()_+-={}:";'>?./<,])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/)
})

export const createRoomSchema = z.object({
    roomName : z.string().min(3).max(30)
})