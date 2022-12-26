const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messagesRoute = require('./routes/messagesRoute');
const app = express();
const socket = require('socket.io');

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/messages", messagesRoute)


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(( ) => {
    console.log("connexion DB OK!");
}).catch((err) => {
    console.log(err.message);
});


const server = app.listen(process.env.PORT, () =>{
    console.log(`Server on port ${process.env.PORT}`);
});

const io = socket(server,{
    cors:{
        origin: "http://localhost:5000",
        credential: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId)=> {
        onlineUsers.set(userId,socket.id);
});

    socket.on("send-msg",(data) => {
        const sendUserSocket = OnlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});
