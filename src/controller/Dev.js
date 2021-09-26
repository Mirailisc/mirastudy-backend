import { Post, User } from '../models/models'

export const DevGetPost = (req, res) => {
  User.find({})
    .select('-password')
    .populate({
      path: 'posts',
      options: { sort: { createdAt: -1 } },
      match: { isNews: true }
    })
    .exec((err, result) => {
      if (err) res.json({ error: err.message })
      else res.status(200).json(result)
    })
}

export const DevCreatePost = async (req, res) => {
  const { text, username } = req.body
  const user = await User.findOne({ username: username })
  const post = new Post({
    text: text,
    create_date: new Date(Date.now()),
    isNews: true,
    author: user._id
  })
  const postData = await post.save()
  user.posts = user.posts.concat(postData)
  await user.save()
  res.status(200).json(postData)
}
