import { Request, Response }             from 'express'
import { prisma }                        from '../lib/prisma'
import { hashPassword, comparePassword } from '../utils/hash'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

// ── POST /api/auth/register ──────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, firstName, lastName, phone } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: { email, passwordHash, role, firstName, lastName, phone },
    })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── POST /api/auth/login ─────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const payload = { userId: user.id, role: user.role, email: user.email }

    const accessToken  = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    // store refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({
      accessToken,
      user: {
        id:        user.id,
        email:     user.email,
        role:      user.role,
        firstName: user.firstName,
        lastName:  user.lastName,
        avatarUrl: user.avatarUrl,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── POST /api/auth/refresh ───────────────────────────────────
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      res.status(401).json({ error: 'No refresh token' })
      return
    }

    const payload     = verifyRefreshToken(token)
    const accessToken = signAccessToken({
      userId: payload.userId,
      role:   payload.role,
      email:  payload.email,
    })

    res.json({ accessToken })
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' })
  }
}

// ── POST /api/auth/logout ────────────────────────────────────
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out successfully' })
}

// ── GET /api/auth/me ─────────────────────────────────────────
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user

    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: {
        id: true, email: true, role: true,
        firstName: true, lastName: true,
        phone: true, avatarUrl: true, isActive: true,
      },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}