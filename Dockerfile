# Etapa 1: Construcción usando Debian Slim (Evita conflictos con binarios de Rust/C++)
FROM node:18-slim AS build

WORKDIR /app

# Instalar herramientas básicas necesarias para binarios nativos (opcional por seguridad)
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Limpiamos e instalamos dependencias de forma estricta
RUN npm ci

COPY . .

# Compilar la aplicación estática
RUN npm run build

# Etapa 2: Servidor de producción ultra ligero con Nginx Alpine
FROM nginx:alpine

# Copiar los archivos estáticos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración personalizada de Nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]