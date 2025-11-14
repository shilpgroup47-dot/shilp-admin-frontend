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

## 🌐 cPanel Deployment Guide

### Method 1: Manual Deployment (Recommended for First Setup)

1. **Build the project locally:**
   ```bash
   ./deploy-cpanel.sh
   ```

2. **Upload to cPanel:**
   - Login to your cPanel
   - Go to File Manager
   - Navigate to `public_html` directory
   - Upload all files from the `dist` folder
   - Make sure `.htaccess` file is uploaded

3. **Set Environment Variables in cPanel:**
   - Go to Node.js Setup in cPanel
   - Add environment variables:
     ```
     VITE_API_BASE_URL=https://your-domain.com
     VITE_IMAGE_BASE_URL=https://your-domain.com
     VITE_APP_NAME=Shilp Admin Panel
     ```

### Method 2: Automatic Deployment with GitHub Actions

1. **Set up GitHub Secrets:**
   Go to your GitHub repository → Settings → Secrets and variables → Actions
   
   Add these secrets:
   ```
   CPANEL_FTP_SERVER=your-cpanel-server.com
   CPANEL_FTP_USERNAME=your-cpanel-username
   CPANEL_FTP_PASSWORD=your-cpanel-password
   VITE_API_BASE_URL=https://your-domain.com
   VITE_IMAGE_BASE_URL=https://your-domain.com
   ```

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Setup for cPanel deployment"
   git push origin main
   ```

### cPanel Node.js Setup

1. **Enable Node.js in cPanel:**
   - Go to "Node.js Setup" in cPanel
   - Click "Create Application"
   - Select Node.js version (18.x recommended)
   - Set Application root: `public_html`
   - Set Application URL: your domain
   - Set Application startup file: `index.html`

2. **Install dependencies in cPanel:**
   ```bash
   cd public_html
   npm install --production
   ```

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

For deployment issues, contact: support@shilpgroup.com