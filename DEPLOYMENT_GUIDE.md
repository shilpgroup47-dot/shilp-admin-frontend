# 🚀 cPanel Auto-Deployment Setup Guide

यह guide आपको बताएगी कि कैसे GitHub से automatically cPanel पर deploy करें।

## 📋 **Required Information**

आपको ये details चाहिए होंगी:

### cPanel FTP Details:
- **FTP Server**: (जैसे: ftp.yourdomain.com या cpanel server IP)
- **FTP Username**: (आपका cPanel username)
- **FTP Password**: (आपका cPanel password)
- **Server Directory**: (जैसे: ./public_html/ या ./public_html/admin/)

### Domain Information:
- **API Base URL**: https://backend.shilpgroup.com (Backend API के लिए)
- **Image Base URL**: https://admin.shilpgroup.com (Images serve करने के लिए)

## 🔑 **Step 1: GitHub Secrets Setup**

1. **GitHub Repository पर जाएं**
   - Repository → Settings → Secrets and variables → Actions

2. **ये Secrets add करें:**

### Required Secrets:
```
CPANEL_FTP_SERVER=ftp.yourdomain.com
CPANEL_FTP_USERNAME=your-cpanel-username
CPANEL_FTP_PASSWORD=your-cpanel-password
```

### Optional Secrets (recommended):
```
CPANEL_SERVER_DIR=./public_html/
VITE_API_BASE_URL=https://backend.shilpgroup.com
VITE_IMAGE_BASE_URL=https://admin.shilpgroup.com
```

## 🚀 **Step 2: Deploy Process**

### Automatic Deployment:
```bash
# सिर्फ यह command run करें:
git add .
git commit -m "Deploy to production"
git push origin main
```

### Manual Deployment (if needed):
```bash
# Local build करें:
npm run build:prod

# Files manually upload करें cPanel File Manager से
```

## 📱 **Step 3: Deployment Verification**

### Success Indicators:
- ✅ GitHub Actions में green checkmark
- ✅ cPanel File Manager में dist files visible
- ✅ Website live और working

### Common Issues & Solutions:

#### 🔴 **FTP Connection Failed**
```
Solution: Check FTP credentials in GitHub Secrets
- Server URL should be correct
- Username/password should be valid
- Server directory should exist
```

#### 🔴 **Build Failed**
```
Solution: Check local build first
npm run build:prod
# If fails locally, fix errors first
```

#### 🔴 **Files Not Uploading**
```
Solution: Check server directory path
- Use ./public_html/ for main domain
- Use ./public_html/subdomain/ for subdomain
- Check cPanel File Manager for correct path
```

## 🎯 **Step 4: Testing Checklist**

### Before First Deployment:
- [ ] GitHub Secrets configured
- [ ] Local build working (`npm run build:prod`)
- [ ] cPanel FTP access verified
- [ ] Server directory path confirmed

### After Deployment:
- [ ] GitHub Actions completed successfully
- [ ] Files visible in cPanel File Manager
- [ ] Website accessible in browser
- [ ] Login functionality working
- [ ] API calls working properly

## 🔧 **Advanced Configuration**

### Multiple Environments:
```bash
# For staging:
CPANEL_SERVER_DIR=./public_html/staging/

# For production:
CPANEL_SERVER_DIR=./public_html/
```

### Custom Domain Setup:
```bash
# Update these in GitHub Secrets:
VITE_API_BASE_URL=https://your-custom-domain.com
VITE_IMAGE_BASE_URL=https://your-custom-domain.com
```

## 📞 **Support**

अगर कोई issue आए तो:
1. GitHub Actions logs check करें
2. cPanel File Manager में files check करें
3. Browser console में errors check करें

**Ready to deploy!** 🎉