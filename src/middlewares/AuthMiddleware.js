import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const jwtSecret = process.env.JWT_SECRET

const verify = (req, res, next) => {
    const token = req.headers['x-access-token']

    if(!token) {
        res.status(403).send({ error: "The Token is invalid" })
    } else {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if(err) {
                res.send({ error: "You are not authenticated"})
            } else {
                req.userId = decoded.id
                next()
            }
        })
    }
}

export default verify