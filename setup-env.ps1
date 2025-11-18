# PowerShell script to create .env.local file for WhereAt

$envContent = @"
# Next Auth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production-$(Get-Random -Minimum 1000 -Maximum 9999)
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8
Write-Host ".env.local file created successfully!" -ForegroundColor Green
Write-Host "NEXTAUTH_URL=http://localhost:3000" -ForegroundColor Cyan
Write-Host "NEXTAUTH_SECRET has been generated" -ForegroundColor Cyan

