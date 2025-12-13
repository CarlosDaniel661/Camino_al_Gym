# Script de despliegue a Fly.io para Camino al Gym
# Ejecutar en PowerShell desde el directorio del proyecto

# PASO 1: Instalar flyctl (si no lo tienes)
# Descargar desde: https://fly.io/docs/hands-on/install-flyctl/
# O ejecutar (si tienes choco):
# choco install flyctl

# PASO 2: Loguearse en Fly (REQUIERE INTERACCIÓN - tu ejecutas esto)
Write-Host "=== PASO 2: Autenticar en Fly.io ===" -ForegroundColor Green
Write-Host "Ejecuta el siguiente comando en tu terminal y sigue las instrucciones:" -ForegroundColor Yellow
Write-Host "flyctl auth login" -ForegroundColor Cyan

# PASO 3: Crear la app en Fly
Write-Host "`n=== PASO 3: Crear aplicacion en Fly ===" -ForegroundColor Green
Write-Host "Ejecuta:" -ForegroundColor Yellow
Write-Host "flyctl launch --name camino-al-gym-backend --region ord" -ForegroundColor Cyan
Write-Host "Nota: responde 'y' cuando pregunte si usar Postgres, 'n' para Redis, y 'y' para deploy" -ForegroundColor Magenta

# PASO 4: Obtener la URL de Postgres (después del launch con Postgres)
Write-Host "`n=== PASO 4: Obtener DATABASE_URL ===" -ForegroundColor Green
Write-Host "Si no creaste Postgres en el launch, ejecuta:" -ForegroundColor Yellow
Write-Host "flyctl postgres create --name camino-al-gym-db --region ord" -ForegroundColor Cyan
Write-Host "Luego obtén la URL con:" -ForegroundColor Yellow
Write-Host "flyctl postgres attach camino-al-gym-db --app camino-al-gym-backend" -ForegroundColor Cyan

# PASO 5: Setear secrets (credenciales y env vars)
Write-Host "`n=== PASO 5: Setear secrets en Fly ===" -ForegroundColor Green
Write-Host "Después de obtener DATABASE_URL de Postgres, ejecuta (TODO EN UNA LÍNEA):" -ForegroundColor Yellow
Write-Host @"
flyctl secrets set `
  SECRET_KEY="TaV4YqAiroOggHX2kK6a3C3fN1KBsoy3M3RMAxet5I" `
  ADMIN_USERNAME="admin" `
  ADMIN_PASSWORD="Azur+2026/B3stia" `
  FLASK_ENV="production" `
  LOG_LEVEL="INFO" `
  CORS_ORIGINS="http://localhost:3000,https://camino-al-gym.vercel.app" `
  -a camino-al-gym-backend
"@ -ForegroundColor Cyan

Write-Host "`nNota: Reemplaza DATABASE_URL con la que obtuviste de Postgres." -ForegroundColor Magenta

# PASO 6: Desplegar
Write-Host "`n=== PASO 6: Desplegar ===" -ForegroundColor Green
Write-Host "Ejecuta:" -ForegroundColor Yellow
Write-Host "flyctl deploy -a camino-al-gym-backend" -ForegroundColor Cyan

# PASO 7: Aplicar migraciones de base de datos
Write-Host "`n=== PASO 7: Aplicar migraciones ===" -ForegroundColor Green
Write-Host "Una vez que la app esté corriendo, ejecuta:" -ForegroundColor Yellow
Write-Host "flyctl run 'flask db upgrade' -a camino-al-gym-backend" -ForegroundColor Cyan

# PASO 8: Verificar que funcionó
Write-Host "`n=== PASO 8: Verificar ===" -ForegroundColor Green
Write-Host "Verifica los logs:" -ForegroundColor Yellow
Write-Host "flyctl logs -a camino-al-gym-backend" -ForegroundColor Cyan
Write-Host "Visita tu app:" -ForegroundColor Yellow
Write-Host "flyctl open -a camino-al-gym-backend" -ForegroundColor Cyan

Write-Host "`n✅ Script completado. Sigue los pasos anteriores en orden." -ForegroundColor Green
