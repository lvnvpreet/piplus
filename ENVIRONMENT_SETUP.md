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

### 3. Start the Application

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend (with Node.js v18+ compatibility):**
```bash
cd frontend
npm install

# For Node.js v18+ (Windows PowerShell)
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm run dev

# For Node.js v18+ (Windows CMD)
set NODE_OPTIONS=--openssl-legacy-provider && npm run dev

# For Node.js v18+ (Linux/macOS)
export NODE_OPTIONS="--openssl-legacy-provider" && npm run dev
```

### 4. Generate Secure Secrets
For production, generate secure secrets:
```bash
# For JWT_SECRET and NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## ⚠️ Node.js Compatibility

This project uses Next.js 10.2.3 which requires the legacy OpenSSL provider for Node.js v18+:

### Why This Error Occurs:
- **Node.js Version**: v18+ uses OpenSSL 3.0+ 
- **Next.js Version**: 10.2.3 uses deprecated OpenSSL functions
- **Solution**: Use `--openssl-legacy-provider` flag

### Alternative Solutions:
1. **Use the legacy provider** (recommended for this project)
2. **Downgrade Node.js** to v16 or lower
3. **Upgrade Next.js** to v12+ (requires code changes)

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
  - NODE_OPTIONS=--openssl-legacy-provider  # For frontend container
```
