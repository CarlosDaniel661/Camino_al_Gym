# Guía de Despliegue: Camino al Gym

Esta guía te ayuda a desplegar el blog **Camino al Gym** a producción usando:
- **Frontend**: Vercel (gratuito)
- **Backend**: Fly.io con PostgreSQL (plan gratuito con límites)

## Requisitos Previos

1. Cuenta en [Fly.io](https://fly.io) (gratuita)
2. Cuenta en [Vercel](https://vercel.com) (gratuita, se conecta a GitHub)
3. GitHub con tu repositorio (ya tienes)
4. `flyctl` instalado localmente

---

## Paso 1: Instalar `flyctl`

### Windows (PowerShell)
```powershell
# Opción A: Usar Chocolatey (si lo tienes)
choco install flyctl

# Opción B: Descargar desde https://fly.io/docs/hands-on/install-flyctl/
# Descarga el instalador Windows y sigue el asistente
```

Verifica que se instaló:
```powershell
flyctl version
```

---

## Paso 2: Autenticarse en Fly.io

```powershell
flyctl auth login
```

Esto abrirá el navegador. Inicia sesión o crea una cuenta gratuita en Fly.io.

---

## Paso 3: Crear la Aplicación en Fly.io

Desde el directorio `backend/`:

```powershell
cd C:\Users\timon\Documents\camino_al_gym_full_project\backend
flyctl launch --name camino-al-gym-backend --region ord
```

El wizard te hará preguntas:
- **"Would you like to use Postgres?"** → Responde `y` (sí)
- **"Would you like to set up a Redis instance?"** → Responde `n` (no)
- **"Would you like to deploy now?"** → Responde `n` (no, primero setearemos secrets)

Esto crea `fly.toml` (ya lo tengo preparado).

---

## Paso 4: Obtener la URL de PostgreSQL

Después del `launch`, Fly debería haber creado una base de datos Postgres automáticamente.

Para obtener la `DATABASE_URL`:

```powershell
flyctl postgres describe camino-al-gym-db -a camino-al-gym-backend
```

O busca la variable de entorno directamente:
```powershell
flyctl secrets list -a camino-al-gym-backend
```

Deberías ver `DATABASE_URL` en la lista. **Cópia su valor** (será algo como `postgres://user:password@host:port/dbname`).

---

## Paso 5: Setear Secrets (Variables de Entorno)

Ejecuta este comando en PowerShell (TODO EN UNA LÍNEA):

```powershell
flyctl secrets set `
  SECRET_KEY="TaV4YqAiroOggHX2kK6a3C3fN1KBsoy3M3RMAxet5I" `
  ADMIN_USERNAME="admin" `
  ADMIN_PASSWORD="Azur+2026/B3stia" `
  FLASK_ENV="production" `
  LOG_LEVEL="INFO" `
  CORS_ORIGINS="http://localhost:3000,https://camino-al-gym.vercel.app" `
  -a camino-al-gym-backend
```

**Nota**: Si cambias la URL del frontend en Vercel, actualiza `CORS_ORIGINS`.

---

## Paso 6: Desplegar Backend

```powershell
flyctl deploy -a camino-al-gym-backend
```

Espera a que termine (verás logs en verde). Cuando termina, obtendrás la URL pública algo como:
```
Visit your newly deployed app at https://camino-al-gym-backend.fly.dev
```

Guarda esta URL.

---

## Paso 7: Aplicar Migraciones de Base de Datos

Una vez la app esté corriendo:

```powershell
flyctl run 'flask db upgrade' -a camino-al-gym-backend
```

Esto crea las tablas en Postgres automáticamente.

---

## Paso 8: Verificar Backend

Prueba que el backend funcione:

```powershell
# Ver logs en vivo
flyctl logs -a camino-al-gym-backend

# Abrir la app en el navegador
flyctl open -a camino-al-gym-backend
```

Visita `https://camino-al-gym-backend.fly.dev/api/posts` en el navegador. Deberías ver un JSON vacío `[]` (o con posts si ya hay).

---

## Paso 9: Desplegar Frontend a Vercel

### Opción A: Automático (recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión (con GitHub).
2. Click en **"New Project"**.
3. Selecciona tu repositorio `Camino_al_Gym`.
4. Vercel detectará que es un Create React App:
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `build` (automático)
5. En **"Environment Variables"** añade:
   - Clave: `REACT_APP_API_URL`
   - Valor: `https://camino-al-gym-backend.fly.dev`
6. Click en **"Deploy"**.

Espera ~2-3 minutos. Vercel te dará una URL pública (algo como `https://camino-al-gym.vercel.app`).

### Opción B: Manual desde CLI (si prefieres)

```powershell
# Instalar Vercel CLI
npm install -g vercel

# Desde frontend dir
cd C:\Users\timon\Documents\camino_al_gym_full_project\frontend
vercel --prod
# Sigue el wizard y seteea REACT_APP_API_URL durante el deploy
```

---

## Paso 10: Actualizar CORS en Backend

Si tu frontend en Vercel tiene URL diferente, actualiza CORS:

```powershell
flyctl secrets set CORS_ORIGINS="http://localhost:3000,https://tu-frontend-url.vercel.app" -a camino-al-gym-backend
flyctl deploy -a camino-al-gym-backend
```

---

## Paso 11: Probar el Blog Completo

1. Visita tu frontend: `https://camino-al-gym.vercel.app`
2. Ve a **Admin Dashboard** (si existe), logueate con:
   - Usuario: `admin`
   - Contraseña: `Azur+2026/B3stia`
3. Crea un post/servicio/reservación de prueba.
4. Verifica que aparezca en la página principal y en la API.

---

## Troubleshooting

### El backend dice "502 Bad Gateway"
- Verifica logs: `flyctl logs -a camino-al-gym-backend`
- Chequea que `DATABASE_URL` esté seteado: `flyctl secrets list`
- Verifica que las migraciones se aplicaron: `flyctl run 'flask db current'`

### El frontend no ve el backend
- Ve a DevTools (F12) → Network y chequea que las requests a `/api/*` vayan a `https://camino-al-gym-backend.fly.dev`
- Verifica `REACT_APP_API_URL` en las build variables de Vercel

### Base de datos vacía
- Ejecuta `flyctl run 'flask db upgrade'` de nuevo
- Verifica que la conexión a Postgres sea correcta

---

## Próximos Pasos (Opcional)

- **Dominio personalizado**: Compra un dominio y apunta a Fly/Vercel (documentación en ambos proveedores).
- **AWS S3**: Si quieres guardar media en la nube, configura `AWS_S3_BUCKET` y credenciales.
- **YouTube uploads**: Si integras carga de vídeos a YouTube, configura credenciales OAuth.
- **Backups**: Configura backups automáticos de Postgres en Fly.io.

---

## Costos

- **Frontend (Vercel)**: Gratis para proyectos personales.
- **Backend (Fly.io)**: Gratis hasta 3 "shared-cpu-1x" VMs + 3 GB storage Postgres (suficiente para un blog pequeño).
- **Dominio personalizado**: ~$10-15 USD/año en registradores como GoDaddy, Namecheap, etc.

---

**¿Preguntas o problemas?** Comparte el output de los logs o el error exacto.

¡Espero que tu blog se desplegue sin problemas! 🚀
