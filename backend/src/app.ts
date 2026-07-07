import express          from 'express'
import cors             from 'cors'
import helmet           from 'helmet'
import morgan           from 'morgan'
import cookieParser     from 'cookie-parser'
import rateLimit        from 'express-rate-limit'
import { config }       from './config'

import authRoutes         from './routes/auth.routes'
import studentRoutes      from './routes/students.routes'
import classRoutes        from './routes/classes.routes'
import attendanceRoutes   from './routes/attendance.routes'
import assignmentRoutes   from './routes/assignments.routes'
import gradeRoutes        from './routes/grades.routes'
import reportRoutes       from './routes/reports.routes'
import announcementRoutes from './routes/announcements.routes'

const app = express()

// ── Security middleware ───────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Rate limiting ─────────────────────────────────────────────
const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      200,
  message:  { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
})

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,             // stricter for login
  message:  { error: 'Too many login attempts, please try again later.' },
})

app.use('/api', globalLimit)
app.use('/api/auth/login', authLimit)

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:  'ok',
    school:  'Good Shepherd SMS',
    version: '1.0.0',
    time:    new Date().toISOString(),
  })
})

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes)
app.use('/api/students',      studentRoutes)
app.use('/api/classes',       classRoutes)
app.use('/api/attendance',    attendanceRoutes)
app.use('/api/assignments',   assignmentRoutes)
app.use('/api/grades',        gradeRoutes)
app.use('/api/reports',       reportRoutes)
app.use('/api/announcements', announcementRoutes)

// ── Global error handler ──────────────────────────────────────
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app