import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/models'

const jwtSecret = process.env.JWT_SECRET

export const Login = async (req, res) => {
  const { email, password } = req.body

  const data = await User.findOne({ email: email })
  if (!data) {
    res.json({ error: 'User does not exist' })
  } else {
    bcrypt.compare(password, data.password, (error, response) => {
      if (response) {
        const id = data._id
        const token = jwt.sign({ id }, jwtSecret, {
          expiresIn: '1d'
        })

        res.status(202).json({ token: token })
      } else {
        res.json({ error: 'Incorrect Email or Password' })
      }
    })
  }
}

export const getCurrent = (req, res) => {
  const id = req.userId
  User.findOne(
    { _id: id },
    { username: 1, firstname: 1, lastname: 1, isAdmin: 1, avatar: 1 },
    (err, result) => {
      if (err) {
        res.json({ error: 'Cannot get user information' })
      } else {
        res.status(200).json(result)
      }
    }
  )
}
