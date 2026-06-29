# Etapa 1: Construcción
FROM node:18-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servidor de producción con Nginx
FROM nginx:alpine

# Copiar archivos de compilación al contenedor de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Eliminar configuración por defecto de Nginx y usar una propia si la tienes
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Comando para correr Nginx
CMD ["nginx", "-g", "daemon off;"]
