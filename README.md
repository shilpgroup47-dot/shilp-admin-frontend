# Shilp Admin Frontend

A modern React + TypeScript admin dashboard for managing real estate projects.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build:prod
```

## 🚀 Quick Deployment

### Super Quick Deploy (One Command):
```bash
npm run deploy:quick
```

### Interactive Deploy:
```bash
npm run deploy:auto
# or
./deploy.sh
```

### Manual Deploy:
```bash
git add .
git commit -m "Your message"
git push origin main
```

## 🔧 First Time Setup

### 1. GitHub Secrets Setup:
Go to Repository → Settings → Secrets → Add these:

```
CPANEL_FTP_SERVER=your-ftp-server.com
CPANEL_FTP_USERNAME=your-cpanel-username
CPANEL_FTP_PASSWORD=your-cpanel-password
CPANEL_SERVER_DIR=./public_html/
```

### 2. Deploy:
```bash
npm run deploy:quick
```

**That's it!** 🎉 Your app will be live in 2-3 minutes.

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env.production` and update values:

```bash
VITE_API_BASE_URL=https://your-domain.com
VITE_IMAGE_BASE_URL=https://your-domain.com
VITE_APP_NAME="Shilp Admin Panel"
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── api/            # API layer and services
├── types/          # TypeScript type definitions
├── routes/         # Routing configuration
└── assets/         # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for development
- `npm run build:prod` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and prepare for deployment

## 📦 Deployment Commands

```bash
# Build for production
npm run build:prod

# Deploy to cPanel (manual)
./deploy-cpanel.sh

# Deploy with auto upload (if configured)
npm run deploy
```

## 🔐 Features

- 🔒 JWT Authentication
- 📊 Project Management (CRUD)
- 🖼️ Image Upload & Management
- 📱 Responsive Design
- 🎨 Modern UI with TailwindCSS
- 🚀 Fast builds with Vite
- 💪 Full TypeScript support

## 🤝 Support

For deployment issues, contact: support@shilpgroup.coms