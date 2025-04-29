import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import examsRoutes from './routes/examsRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5003

// Middleware
app.use(express.json())

// Configure CORS - allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable credentials
}))

// Routes
app.use('/auth', authRoutes)
app.use('/exams', authMiddleware, examsRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})