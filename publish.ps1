# Publica el sitio en axsistecmkt/shutpoint usando la credencial de axsistecmkt
# ya guardada en Windows Credential Manager. El token nunca se imprime.
# Uso:  ./publish.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$owner = 'axsistecmkt'
$repo  = 'shutpoint'
$desc  = 'Sitio funcional de Shutpoint CRM (powered by axsis)'

Write-Host "Obteniendo credencial de github.com (axsistecmkt)..." -ForegroundColor Cyan
$cred  = ("protocol=https`nhost=github.com`n" | git credential fill)
$token = ($cred | Where-Object { $_ -like 'password=*' }) -replace '^password=',''
if (-not $token) { throw "No se encontro credencial de github.com. Ejecuta primero: git credential fill" }

$headers = @{ Authorization = "token $token"; 'User-Agent' = 'axsis-shutpoint'; Accept = 'application/vnd.github+json' }

# Verifica que la credencial sea de axsistecmkt
$who = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers
Write-Host ("Autenticado como: " + $who.login) -ForegroundColor Green
if ($who.login -ne $owner) {
  Write-Warning "La credencial activa es '$($who.login)', no '$owner'. El repo se creara bajo '$($who.login)'."
  $owner = $who.login
}

# 1) Crear el repo (si no existe)
$exists = $true
try { Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo" -Headers $headers | Out-Null }
catch { $exists = $false }

if ($exists) {
  Write-Host "El repo $owner/$repo ya existe. Se usara el existente." -ForegroundColor Yellow
} else {
  Write-Host "Creando repo $owner/$repo ..." -ForegroundColor Cyan
  $body = @{ name = $repo; description = $desc; private = $false; has_issues = $true } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri 'https://api.github.com/user/repos' -Headers $headers -Body $body | Out-Null
  Write-Host "Repo creado." -ForegroundColor Green
}

# 2) Configurar remote y hacer push
$remoteUrl = "https://github.com/$owner/$repo.git"
if (git remote 2>$null | Select-String -Quiet '^origin$') { git remote set-url origin $remoteUrl }
else { git remote add origin $remoteUrl }

Write-Host "Subiendo codigo (push a main)..." -ForegroundColor Cyan
git push -u origin main

# 3) Activar GitHub Pages (rama main, raiz)
Write-Host "Activando GitHub Pages..." -ForegroundColor Cyan
$pagesBody = @{ source = @{ branch = 'main'; path = '/' } } | ConvertTo-Json
try {
  Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$owner/$repo/pages" -Headers $headers -Body $pagesBody | Out-Null
  Write-Host "Pages activado." -ForegroundColor Green
} catch {
  # Si ya estaba activo, intenta actualizar
  try { Invoke-RestMethod -Method Put -Uri "https://api.github.com/repos/$owner/$repo/pages" -Headers $headers -Body $pagesBody | Out-Null; Write-Host "Pages actualizado." -ForegroundColor Green }
  catch { Write-Warning "No se pudo activar Pages automaticamente. Actívalo en Settings > Pages (rama main, /root)." }
}

Write-Host ""
Write-Host "LISTO" -ForegroundColor Green
Write-Host ("Repo:  https://github.com/$owner/$repo")
Write-Host ("Live:  https://$owner.github.io/$repo/  (tarda 1-2 min en publicar)")
