
require('dotenv').config()
const express = require("express")
const harperSaveMessage = require("./services/harper-save-messages")
const harperGetMessages = require("./services/harper-get-messages")
const app = express();
const http = require('http')
const cors= require('cors')

app.use(cors()) // cors middleware
//Cors allows our client to make requests to other origins – necessary for socket.io to work properly. 
const { Server } = require('socket.io')
const server= http.createServer(app)
const leaveRoom = require("./utils/leave-room")
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});
app.get("/", (req,res)=>{
    res.send("Hello World")
})
const Chat_Bot= "ChatBot";
let ChatRoom ="";
let allUsers=[]; 
// Listen for when the client connects via socket.io-client
io.on("connection", (socket)=>{
    console.log("Uesr connected", socket.id);
    //Socket event listeners will be there
    socket.on("join-room", (userData)=>{
        const {username, room} =userData; // Data sent from client when join-room event emitted
        socket.join(room) // Join the user to a socket room
        let createdTime = Date.now(); //current TimeStamp
            // Send message to all users currently in the room, apart from the user that just joined
     socket.to(room).emit('receive_message',{
        message : `${username} has just joined the chat room`,
        username : Chat_Bot,
        createdTime,
     });
     //Welcome message to the user who has just joined
     socket.emit('receive_message',{
        message: `Welcome ${username}`,
        username: Chat_Bot,
        createdTime
     });
     ChatRoom=room;
     allUsers.push({id: socket.id, username, room})
     ChatRoomUsers = allUsers.filter(user=> user.room === room);
     socket.to(room).emit("chatroom_users", ChatRoomUsers);
     socket.emit('chatroom_users', ChatRoomUsers)

     socket.on("send_message", (data)=>{
        const {message, username, room, createdTime} = data;
        io.in(room).emit("receive_message", data) 
        harperSaveMessage(message, username, room, createdTime)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
     })
     harperGetMessages(room)
     .then((last100Messages)=>{
        console.log("Latest Messages", last100Messages)
        socket.emit("last_100_messages", last100Messages)
     })
     .catch(err=> console.log(err))
    });
    socket.on("leave_room", data=>{
        const {username, room} = data;
        socket.leave(room);
        const createdTime = Date.now();
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit("chatroom_users", allUsers);
        socket.to(room).emit('receive_message', {
            username: Chat_Bot,
            message: `${username} has left the room`,
            createdTime
        })
        console.log(`${username} has left the room`)
    })
    socket.on("disconnect", ()=>{
        const user =allUsers.find(user=>user.id===socket.id)
        const createdTime= Date.now()
        if(user?.username){
            allUsers=leaveRoom(socket.id, allUsers)
            socket.to(ChatRoom).emit('chatroom_users', allUsers)
            socket.to(ChatRoom).emit('receive_message',{
                message: `${user.username} has disconnected from the chat.`,
                createdTime,
            })
        }
    })
});
server.listen(8080, ()=>{
    console.log("Server is lentening to port 8080")
})