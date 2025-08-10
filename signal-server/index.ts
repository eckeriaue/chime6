import { Server } from "socket.io"

const io = new Server()

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`)

  socket.emit("hello", "world")

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)
  })
})


Deno.serve({
  port: 3000,
}, io.adapter)
