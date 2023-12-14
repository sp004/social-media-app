import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv'
import helmet from "helmet";
import cors from 'cors'
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import userRouter from './routes/user.js';
import cookieParser from 'cookie-parser';
import bookmarkRouter from './routes/bookmark.js';
import friendRouter from './routes/friend.js';
import { createServer } from "http";
import { notFound } from './middleware/ErrorHandler.js';
import { Server } from 'socket.io';
import conversationRouter from './routes/conversation.js';
import messageRouter from './routes/message.js';
import commentRouter from './routes/comment.js';

const app = express()
const httpServer = createServer(app);

dotenv.config()
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  }))

const port = process.env.PORT || 8000

connectDB()

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/comment', commentRouter)
app.use('/api/conversation', conversationRouter)
app.use('/api/message', messageRouter)
app.use('/api/friend', friendRouter)
app.use('/api/bookmark', bookmarkRouter)

app.get('*', (req, res) => res.send('Page not found'))
app.use(notFound)

app.use((err, req, res, next) => {
    const validationError = err?.errors && err?.errors[Object.keys(err?.errors)[0]];
    const errStatus = err.status ? err.status : 500 
    const errMsg = validationError?.message 
                    ? validationError.message
                    : err?.message 
                        ? err.message 
                        : 'Something went wrong'
    const stack = process.env.NODE_ENV !== 'production' ? err.stack : null
    res.status(errStatus).json({status: 'error', message: errMsg, stack})
})

mongoose.connection.on('open', () => {
    console.log("Connection established")
    httpServer.listen(port, () => console.log(`meetfrend server listening on port ${port}!`))
})

//--------- initialize Socket ----------------
const io = new Server(httpServer, { 
    //pingTimeout: 60000, //connection will be closed afted 60s if not used
    cors: {
        origin: [process.env.CLIENT_URL],
        credentials: true,
    }
});

let users = []

const addUser = (userId, socketId, fullname) => {
    userId && socketId && !users.some(user => user.userId === userId) &&
        users.push({userId, socketId, fullname})
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
} 

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

io.on("connection", (socket) => {
    // console.log("connected to socket.io")

    socket.on("setup", (user) => {
        addUser(user?.id, socket?.id, user?.fullname)
        // console.log("users", users)
        io.emit("online", users)
    })

    socket.on("message", (messageReceived) => {
        const receiver = getUser(messageReceived?.receiver)
        // console.log(receiver)
        // let conversation = messageReceived.conversationId
        io.to(receiver?.socketId).emit("sentMessage", messageReceived)
    })

    socket.on("sentNotification", (data) => {
        // console.log("data", data)
        const receiver = getUser(data?.receiver)
        const sender = getUser(data?.sender)
        // console.log(receiver, sender?.fullname)
        io.to(receiver?.socketId).emit("getNotification", {
            sender: sender?.fullname, 
            type: data?.type,
            createdAt: data?.createdAt
        })
    })
    
    socket.on("disconnect", () => {
        // console.log("User left")
        removeUser(socket.id)
        // console.log("users", users)
        io.emit("online", users)
    })
})



// let onlineUsers = []

// const addOnlineUsers = (userId, socketId) => {
//     //if user is already online
//     if(onlineUsers?.some(user => user.userId === userId)) return 

//     onlineUsers.push({userId, socketId})
//     // console.log("add", onlineUsers)
// }

// const removeOnlineUser = (socketId) => {
//     //if user is not online
//     // if(onlineUsers?.some(user => user.socketId !== socketId)) return 
//     // console.log(onlineUsers)
//     onlineUsers = onlineUsers?.filter(user => user.socketId !== socketId)
//     // console.log("remove", onlineUsers)
// }

// io.on("connection", (socket) => {
//     socket.on("setup", (userId) => {
//         console.log(userId, "Connected")
//     })

//     socket.on("user-online", userId => {
//         // console.log(userId)
//         addOnlineUsers(userId, socket.id)
//         // console.log(onlineUsers)
//         socket.broadcast.emit("get-online-users", onlineUsers)
//     })
    
//     socket.on("send-message", (data) => {
//         // console.log(data)
//         // io.to(receiver).emit("send-from-server", {sender, message})
//         socket.broadcast.emit("send-from-server", data);
//     });

//     socket.on("typing-started", () => {
//         socket.broadcast.emit("typing-started-server");
//     });

//     socket.on("typing-stopped", () => {
//         socket.broadcast.emit("typing-stopped-server");
//     });

//     socket.on("disconnect", () => {
//         console.log("User left")
//         removeOnlineUser(socket.id)
//         socket.broadcast.emit("get-online-users", onlineUsers)
//     })
// });


// const fakeDelay = (promise) => {
//     return new Promise(resolve => {
//         setTimeout(resolve, 3000);
//     }).then(() => promise)
// }

// const Comment = lazy(() => fakeDelay(import('./pasges/Comment.js')))