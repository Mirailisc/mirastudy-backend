import { User } from '../models/models'
import bcrypt from 'bcrypt'
import sharp from 'sharp'

export const GetUser = async (req, res) => {
  const username = req.query.user
  const data = await User.findOne({ username: username }).select('-password')

  if (data) res.status(200).json(data)
  else res.status(404).json({ error: 'User not found' })
}

export const CreateUser = async (req, res) => {
  const { username, firstname, lastname, email, password, rePassword } =
    req.body
  if (password !== rePassword) {
    return res.json({ error: 'Password not match' })
  } else {
    const UserCheck = await User.findOne({
      $or: [{ username: username }, { email: email }]
    })
    if (UserCheck) {
      return res.json({ error: 'User already exists' })
    } else {
      const encryptedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        username: username,
        firstname: firstname,
        lastname: lastname,
        avatar: null,
        email: email,
        password: encryptedPassword,
        isAdmin: false
      })

      user.save((err, result) => {
        if (err) res.json({ message: 'Cannot create data' })
        else
          res.status(201).json({
            message: 'Create user successfully, Welcome to MiraStudy!',
            data: result
          })
      })
    }
  }
}

export const UpdateUser = (req, res) => {
  const { firstname, lastname, email, account } = req.body
  User.updateOne(
    { username: account },
    {
      firstname: firstname,
      lastname: lastname,
      email: email
    },
    (err, result) => {
      if (err) res.json({ error: 'Cannot update data' })
      else res.status(202).json('Update successfully')
    }
  )
}

export const UpdateImage = async (req, res) => {
  if (!req.file) {
    res.status(404).json({ error: 'No file upload' })
  } else {
    const imgsrc =
      'https://mirastudy-backend.herokuapp.com/images/' + req.file.filename
    const user = req.body.user
    await sharp(req.file.path)
      .resize(200, 200)
      .jpeg({ quality: 30 })
      .toFile(process.cwd(), '/public/static/uploads/' + req.file.filename)
    User.updateOne(
      { username: user },
      {
        avatar: imgsrc
      },
      (err, result) => {
        if (err) return res.json({ error: 'Cannot update your avatar' })
        else res.json({ message: 'Update successfully' })
      }
    )
  }
}
