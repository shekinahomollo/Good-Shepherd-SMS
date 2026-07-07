import dotenv from 'dotenv'
dotenv.config()

export const config = {
  PORT:             process.env.PORT || 4000,
  NODE_ENV:         process.env.NODE_ENV || 'development',
  FRONTEND_URL:     process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_URL:     process.env.DATABASE_URL!,
  JWT_SECRET:       process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production',
}