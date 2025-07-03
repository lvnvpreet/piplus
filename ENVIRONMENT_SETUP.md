# PiPlus Trading Platform - Environment Setup Guide

## 🚀 Quick Setup

### 1. Backend Environment Setup
```bash
cd backend
cp .env.sample .env
```
Edit the `.env` file and update the values:
- `JWT_SECRET`: Generate a secure random string
- `MONGODB_URI`: Update if using a different MongoDB instance

### 2. Frontend Environment Setup
```bash
cd frontend
cp .env.sample .env.local
```
Edit the `.env.local` file and update the values:
- `NEXTAUTH_SECRET`: Generate a secure random string
- Update URLs if running on different ports

### 3. Generate Secure Secrets
For production, generate secure secrets:
```bash
# For JWT_SECRET and NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📝 Environment Variables Explained

### Backend (.env)
- **PORT**: Port where backend server runs (default: 5000)
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT token signing
- **NODE_ENV**: Environment mode (development/production)

### Frontend (.env.local)
- **NEXT_PUBLIC_API_URL**: Backend API URL (must include /api)
- **NEXTAUTH_URL**: Frontend URL where NextAuth is running
- **NEXTAUTH_SECRET**: Secret key for NextAuth session signing

## 🔒 Security Notes
- Never commit actual `.env` files to version control
- Use strong, unique secrets for production
- Keep `.env.sample` files updated as templates
- For production, use environment-specific configuration

## 🐳 Docker Support (Optional)
If using Docker, you can also use docker-compose.yml environment sections:
```yaml
environment:
  - PORT=5000
  - MONGODB_URI=mongodb://mongo:27017/piplus
  - JWT_SECRET=${JWT_SECRET}
```
