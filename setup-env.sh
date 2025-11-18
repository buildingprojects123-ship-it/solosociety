#!/bin/bash
# Bash script to create .env.local file for WhereAt

cat > .env.local << EOF
# Next Auth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production-$(openssl rand -hex 16)
EOF

echo ".env.local file created successfully!"
echo "NEXTAUTH_URL=http://localhost:3000"
echo "NEXTAUTH_SECRET has been generated"

