#Etapa de construcción con Node.js
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias de producción
RUN npm ci --only=production

# Copia el resto del código
COPY . .

# Construye la aplicación para producción
RUN npm install

#Etapa final con Nginx para servir el frontend
FROM nginx:alpine

# Copia los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
