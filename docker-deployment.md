# 🚀 Manual de Despliegue Docker - Next.js + Prisma

 
## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)

Verifica las instalaciones:

```bash
docker --version
docker-compose --version
```

---

## ⚙️ Configuración Inicial

### 1. Crear el archivo de variables de entorno

Crea un archivo llamado `.docker_env` en la raíz del proyecto con el siguiente contenido:

```properties
# Puerto de la aplicación
PORT=3005

# Base de datos PostgreSQL (Neon)
DATABASE_URL="postgresql://usuario:password@host/database?sslmode=require"

# Entorno
NODE_ENV="production"

# Firebase Configuration (PÚBLICAS - se embeben en el frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx

# JWT (PRIVADO - solo backend)
JWT_SECRET=tu_clave_super_secreta_de_minimo_32_caracteres
JWT_EXPIRES_IN=7d
```

### 2. Estructura de archivos requerida

Asegúrate de tener estos archivos en tu proyecto:

```
tu-proyecto/
├── .docker_env              # ✅ Variables de entorno
├── .dockerignore            # ✅ Archivos a ignorar
├── dockerfile.prod          # ✅ Dockerfile de producción
├── docker-compose.prod.yml  # ✅ Compose de producción
├── next.config.mjs          # ✅ Con output: 'standalone'
└── package.json
```

### 3. Verificar `next.config.mjs`

Asegúrate de que tu `next.config.mjs` incluya:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ⚠️ CRÍTICO para Docker
}

export default nextConfig
```

---

## 🚀 Comandos de Despliegue

### 🏗️ Primera vez: Build completo

```bash
# 1. Limpia caché anterior (opcional pero recomendado)
docker system prune -af

# 2. Construye la imagen desde cero
docker-compose -f docker-compose.prod.yml --env-file .docker_env build --no-cache

# 3. Verifica el tamaño de la imagen (debería ser ~150-350MB)
docker images | grep contrataciones

# 4. Levanta el contenedor
docker-compose -f docker-compose.prod.yml up -d

# 5. Verifica que esté corriendo
docker-compose -f docker-compose.prod.yml ps
```

---

## 🎮 Gestión de Contenedores

### 🟢 Levantar (si ya está buildeado)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Salida esperada:**
```
[+] Running 1/1
 ✔ Container app_contrataciones_prod  Started
```

---

### 🔴 Detener

```bash
docker-compose -f docker-compose.prod.yml down
```

**¿Qué hace?**
- Detiene el contenedor
- Elimina el contenedor
- **NO** elimina la imagen ni los volúmenes

**Para eliminar TODO (incluyendo volúmenes):**
```bash
docker-compose -f docker-compose.prod.yml down -v
```

---

### 🔄 Reiniciar

```bash
docker-compose -f docker-compose.prod.yml restart
```

**Reiniciar solo si hay cambios en `.docker_env`:**
```bash
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

---

### 📋 Ver logs

```bash
# Ver logs en tiempo real (presiona Ctrl+C para salir)
docker-compose -f docker-compose.prod.yml logs -f

# Ver últimas 50 líneas
docker-compose -f docker-compose.prod.yml logs --tail=50

# Ver logs de las últimas 2 horas
docker-compose -f docker-compose.prod.yml logs --since 2h

# Logs con timestamps
docker-compose -f docker-compose.prod.yml logs -f -t
```

---

### 📊 Ver estado

```bash
docker-compose -f docker-compose.prod.yml ps
```

**Salida esperada:**
```
NAME                        STATUS          PORTS
app_contrataciones_prod     Up 5 minutes    0.0.0.0:3005->3005/tcp
```

**Ver estadísticas de recursos (CPU, RAM):**
```bash
docker stats app_contrataciones_prod
```

---

## 🔍 Comandos de Diagnóstico

### Entrar al contenedor

```bash
docker exec -it app_contrataciones_prod sh
```

**Dentro del contenedor puedes:**
```bash
# Ver archivos
ls -la

# Ver variables de entorno
env | grep NEXT

# Ver procesos
ps aux

# Probar Prisma
npx prisma db pull

# Salir
exit
```

---

### Ver información de la imagen

```bash
# Tamaño de la imagen
docker images | grep contrataciones

# Historial de layers (qué ocupa espacio)
docker history app_contrataciones:prod --human --no-trunc | head -20

# Inspeccionar configuración
docker inspect app_contrataciones_prod
```

---

### Probar la aplicación

```bash
# Desde terminal
curl http://localhost:3005

# Verificar health endpoint (si lo tienes configurado)
curl http://localhost:3005/api/health

# Desde navegador
# Abre: http://localhost:3005
```

---

## 🛠️ Troubleshooting

### ❌ Error: "Cannot find module"

**Síntoma:** La app no arranca y dice que no encuentra módulos.

**Solución:**
```bash
# Reconstruye sin caché
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

### ❌ Error: "Firebase: Error (auth/invalid-api-key)"

**Síntoma:** Errores de Firebase durante el build.

**Solución:**
1. Verifica que `.docker_env` tenga las variables correctas:
```bash
grep NEXT_PUBLIC .docker_env
```

2. Asegúrate de pasar las variables al build:
```bash
docker-compose -f docker-compose.prod.yml --env-file .docker_env build
```

---

### ❌ Error: "Port 3005 already in use"

**Síntoma:** El puerto ya está ocupado.

**Solución:**
```bash
# Ver qué proceso usa el puerto
lsof -i :3005  # En Linux/Mac
netstat -ano | findstr :3005  # En Windows

# Cambiar el puerto en docker-compose.prod.yml
ports:
  - "3006:3005"  # Usa 3006 en el host
```

---


## 🎯 Mejores Prácticas

### 🔒 Seguridad

```bash
# ❌ NO subas estos archivos a Git
.docker_env
.env
.env.local
*.log

# ✅ Agrega a .gitignore
echo ".docker_env" >> .gitignore
```

### 📦 Actualización de código

```bash
# Cuando cambies código fuente:
git pull  # Obtén últimos cambios
docker-compose -f docker-compose.prod.yml build  # Rebuilds
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

### 🔄 Backup de base de datos

```bash
# Exportar datos de Prisma
docker exec app_contrataciones_prod npx prisma db pull > schema-backup.prisma
```

### 🧹 Limpieza periódica

```bash
# Cada semana/mes, limpia recursos sin usar
docker system prune -af

# Ver cuánto espacio ocupa Docker
docker system df
```

---

## 📖 Comandos Rápidos (Cheat Sheet)

| Acción | Comando |
|--------|---------|
| **Build inicial** | `docker-compose -f docker-compose.prod.yml build --no-cache` |
| **Levantar** | `docker-compose -f docker-compose.prod.yml up -d` |
| **Detener** | `docker-compose -f docker-compose.prod.yml down` |
| **Reiniciar** | `docker-compose -f docker-compose.prod.yml restart` |
| **Ver logs** | `docker-compose -f docker-compose.prod.yml logs -f` |
| **Ver estado** | `docker-compose -f docker-compose.prod.yml ps` |
| **Entrar al contenedor** | `docker exec -it app_contrataciones_prod sh` |
| **Ver tamaño** | `docker images \| grep contrataciones` |
| **Limpiar todo** | `docker system prune -af` |

---

 

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0