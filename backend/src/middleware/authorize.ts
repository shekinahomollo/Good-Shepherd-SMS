import { Request, Response, NextFunction } from 'express'

export const authorize = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    next()
  }