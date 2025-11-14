#!/bin/bash

# Manual FTP Upload Script for cPanel
# Uploads dist folder to public_html/admin.shilpgroup.com/

echo "🚀 Manual FTP Upload to cPanel"
echo "================================"

# Build project first
echo "📦 Building project..."
npm run build:prod

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""

# FTP credentials
FTP_SERVER="ftp.shilpgroup.com"
FTP_USER="shilfmfe"
FTP_PASS="wxbr7!ANf{9u"
REMOTE_DIR="./public_html/admin.shilpgroup.com"

echo "📤 Uploading files to cPanel..."
echo "Server: $FTP_SERVER"
echo "Remote Directory: $REMOTE_DIR"
echo ""

# Create FTP commands file
cat > ftp_commands.txt << EOF
open $FTP_SERVER
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_DIR
lcd dist
prompt off
mput *
mput -r assets
mput -r chunks
quit
EOF

# Upload using FTP
ftp -v < ftp_commands.txt

# Clean up
rm ftp_commands.txt

echo ""
echo "🎉 Upload completed!"
echo "🌐 Check your website: https://admin.shilpgroup.com"

# Alternative LFTP method (if available)
echo ""
echo "💡 Alternative: Using LFTP (if installed):"
echo "lftp -e 'mirror -R dist/ $REMOTE_DIR/; quit' -u $FTP_USER,$FTP_PASS $FTP_SERVER"