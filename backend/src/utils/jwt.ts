import jwt from 'jsonwebtoken'
import { config } from '../config'

export interface TokenPayload {
  userId: string
  role:   string
  email:  string
}

export const signAccessToken = (payload: TokenPayload): string =>
  jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' })

export const signRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '7d' })

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, config.JWT_SECRET) as TokenPayload

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload