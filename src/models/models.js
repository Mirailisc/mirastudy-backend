import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    avatar: String,
    posts: [{type: Schema.Types.ObjectId, ref: 'Posts'}]
}, {timestamps: true})

export const User = mongoose.model('Users', userSchema)

const postSchema = new Schema({
    text: String,
    isNews: Boolean,
    author: { type: Schema.Types.ObjectId, ref: 'Users'}
}, {timestamps: true})

export const Post = mongoose.model('Posts', postSchema)