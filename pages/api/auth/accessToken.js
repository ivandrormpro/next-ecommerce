import bcrypt from 'bcrypt'
import connectDB from '../../../utils/connectDB'
import User from '../../../models/userModel'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'
import jwt from 'jsonwebtoken'

connectDB()

export default async (req, res) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if(!rf_token) return res.status(400).json({err: 'Please login now!'})

        const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET)
        if(!result) return res.status(400).json({err: 'Your token is incorrect or has expired!'})
   
        const user = await User.findById(result.id)
        if(!user) return res.status(400).json({err: 'User does not exist!'})

        const access_token = createAccessToken({id: user._id})
        res.json({
            access_token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root
            }
        })
    } catch (err) {
        return res.status(500).json({err:err.message})
    }
}
