# Dockerfile para desarrollo del SDK TecnoFact Node.js
FROM node:20-alpine

# Instalar herramientas de desarrollo
RUN apk add --no-cache git

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Copiar código fuente (necesario antes de npm ci por el script prepare)
COPY tsconfig.json ./
COPY src ./src

# Instalar dependencias (esto ejecutará prepare que compila el código)
RUN npm ci --ignore-scripts && npm run build

# Copiar el resto del código
COPY . .

# Exponer puerto para debugging si es necesario
EXPOSE 9229

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]
