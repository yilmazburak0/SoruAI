import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

// Register a new user endpoing /auth/register
router.post('/register', async (req, res) => {
    const { firstName, lastName, userName, password } = req.body

    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to the db
    try {
        const student = await prisma.students.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                user_name: userName,
                password_hash: hashedPassword
            }
        })

        // create a token
        const token = jwt.sign({ id: student.id, name: student.first_name }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        // Check if the error is due to a unique constraint violation (duplicate username)
        if (err.code === 'P2002' && err.meta?.target?.includes('user_name')) {
            return res.status(409).json({ message: "Bu kullanıcı adı zaten kullanılmakta. Lütfen farklı bir kullanıcı adı seçin." })
        }
        res.status(503).json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." })
    }
})

router.post('/login', async (req, res) => {
    const { userName, password } = req.body

    try {
        const student = await prisma.students.findUnique({
            where: {
                user_name: userName
            }
        })

        // if we cannot find a user associated with that username, return out from the function
        if (!student) { return res.status(404).send({ message: "Kullanıcı adı yanlış" }) }

        // Fix: Changed student.password to student.password_hash to match the schema
        const passwordIsValid = bcrypt.compareSync(password, student.password_hash)
        
        // if the password does not match, return out of the function
        if (!passwordIsValid) { return res.status(401).send({ message: "hatalı şifre" }) }
        
        // then we have a successful authentication
        const token = jwt.sign({ id: student.id, name: student.first_name }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

// Verify token endpoint
router.post('/verify-token', async (req, res) => {
    const { token } = req.body
    
    if (!token) {
        return res.status(400).json({ valid: false, message: "No token provided" })
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Check if the user exists in database (optional but adds security)
        const student = await prisma.students.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                user_name: true
            }
        })
        
        if (!student) {
            return res.status(404).json({ valid: false, message: "User not found" })
        }
        
        // Return user info without sensitive data
        return res.json({ 
            valid: true, 
            user: {
                id: student.id,
                firstName: student.first_name,
                lastName: student.last_name,
                userName: student.user_name
            },
            expiresAt: new Date(decoded.exp * 1000) // Convert UNIX timestamp to JS Date
        })
    } catch (err) {
        // If token verification fails
        return res.status(401).json({ valid: false, message: "Invalid token" })
    }
})

export default router