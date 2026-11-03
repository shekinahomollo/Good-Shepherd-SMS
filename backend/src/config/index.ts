import dotenv from 'dotenv'
dotenv.config()

export const config = {
  PORT:               process.env.PORT || 4000,
  NODE_ENV:           process.env.NODE_ENV || 'development',
  FRONTEND_URL:       process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_URL:       process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/good_shepherd_sms',
  JWT_SECRET:         process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production',
  R2_ENDPOINT:       process.env.R2_ENDPOINT || '',
  R2_ACCESS_KEY:     process.env.R2_ACCESS_KEY || '',
  R2_SECRET_KEY:     process.env.R2_SECRET_KEY || '',
  R2_BUCKET:         process.env.R2_BUCKET || 'good-shepherd-sms',
  R2_PUBLIC_URL:     process.env.R2_PUBLIC_URL || 'https://example.com/good-shepherd-sms',
}