import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts"
import { Application, Router } from "@oak/oak"

const app = new Application()
const router = new Router()
const rooms = new Map()

router.get('rooms', context => {
  return rooms.values().toArray()
})

app.use(router.routes())
app.use(router.allowedMethods())


const io = new Server()

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`)

  socket.emit("hello", "world")

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)
  })
})

const handler = io.handler(async (req) => {
  return await app.handle(req) || new Response(null, { status: 404 })
})

Deno.serve({
  handler,
  port: 3000,
})
