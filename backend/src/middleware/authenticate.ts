import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  try {
    const payload = verifyAccessToken(header.slice(7))
    ;(req as any).user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' })
  }
}