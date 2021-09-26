import { Post, User } from '../models/models'

export const GetPost = (req, res) => {
  User.find({})
    .select('-password')
    .populate({
      path: 'posts',
      match: { isNews: false },
      options: { sort: { createdAt: -1 } }
    })
    .sort('-createdAt')
    .exec((err, result) => {
      if (err) res.json({ error: err.message })
      else res.status(200).json(result)
    })
}

export const CreatePost = async (req, res) => {
  const { text, username } = req.body
  const user = await User.findOne({ username: username })
  const post = new Post({
    text: text,
    create_date: new Date(Date.now()),
    isNews: false,
    author: user._id
  })
  const postData = await post.save()
  user.posts = user.posts.concat(postData)
  await user.save()
  res.status(200).json(postData)
}

export const DeletePost = async (req, res) => {
  const { id, user } = req.query
  await User.updateOne(
    { username: user },
    {
      $pull: { posts: id }
    }
  )

  Post.deleteOne({ _id: id }, (err, result) => {
    if (err) res.json({ error: 'Error cannot delete your post' })
    else {
      res.status(200).json({ message: 'Successful' })
    }
  })
}

export const GetUserPost = (req, res) => {
  const username = req.query.user

  User.find({ username: username })
    .select('-password')
    .populate({
      path: 'posts',
      options: { sort: { createdAt: -1 } },
      match: { isNews: false }
    })
    .exec((err, result) => {
      if (err) res.json({ error: err.message })
      else res.status(200).json(result)
    })
}
