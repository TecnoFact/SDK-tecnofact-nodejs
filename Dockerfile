# Dockerfile para desarrollo del SDK TecnoFact Node.js
FROM node:20-alpine

# Instalar herramientas de desarrollo
RUN apk add --no-cache git

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Exponer puerto para debugging si es necesario
EXPOSE 9229

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]
