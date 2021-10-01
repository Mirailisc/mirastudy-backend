import express from 'express'
import cors from 'cors'
import verify from './middlewares/AuthMiddleware'
import dotenv from 'dotenv'
import { upload } from './middlewares/imageUpload'
import mongoose from 'mongoose'

import { GetUser, CreateUser, UpdateUser, UpdateImage } from './controller/User'
import { Login, getCurrent } from './controller/Auth'
import { GetPost, CreatePost, DeletePost, GetUserPost } from './controller/Post'
import { DevGetPost, DevCreatePost } from './controller/Dev'

dotenv.config()
const app = express()

let PORT = process.env.PORT || 5000

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@main.p5rx0.mongodb.net/MiraDB?retryWrites=true&w=majority`
)

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://mirastudy.vercel.app'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
  })
)
app.use('/images', express.static(process.cwd() + '/public/static/uploads/'))
app.use(express.json())

// User
app.get('/user/info', GetUser)
app.post('/user/create', CreateUser)
app.put('/user/update/info', UpdateUser)
app.put('/user/update/avatar', upload.single('file'), UpdateImage)

// Authentication
app.post('/auth/sign-in', Login)
app.get('/auth/curUser', verify, getCurrent)

// Post
app.get('/post', GetPost)
app.post('/post/create', CreatePost)
app.delete('/post/delete', DeletePost)
app.get('/post/user', GetUserPost)

// Post
app.get('/dev/post', DevGetPost)
app.post('/dev/post/create', DevCreatePost)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
