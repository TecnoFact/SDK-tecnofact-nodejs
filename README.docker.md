# Desarrollo con Docker

Este documento explica cómo usar Docker para el desarrollo del SDK TecnoFact Node.js.

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+

## Servicios Disponibles

### 1. Desarrollo (sdk-dev)

Ejecuta el compilador de TypeScript en modo watch:

```bash
docker-compose up sdk-dev
```

### 2. Tests (sdk-test)

Ejecuta los tests con cobertura:

```bash
docker-compose up sdk-test
```

### 3. Linter (sdk-lint)

Ejecuta ESLint para verificar el código:

```bash
docker-compose up sdk-lint
```

## Comandos Útiles

### Construir la imagen

```bash
docker-compose build
```

### Ejecutar tests específicos

```bash
docker-compose run --rm sdk-test npm test -- --testPathPattern=Config
```

### Ejecutar comandos personalizados

```bash
docker-compose run --rm sdk-dev npm run build
```

### Limpiar contenedores y volúmenes

```bash
docker-compose down -v
```

## Desarrollo sin Docker Compose

Si prefieres usar solo Docker:

```bash
# Construir imagen
docker build -t tecnofact-sdk .

# Ejecutar tests
docker run --rm -v $(pwd):/app tecnofact-sdk npm test

# Modo desarrollo
docker run --rm -v $(pwd):/app tecnofact-sdk npm run dev
```

## Notas

- Los cambios en el código se reflejan automáticamente gracias a los volúmenes montados
- `node_modules` se mantiene en un volumen separado para mejor rendimiento
- El puerto 9229 está expuesto para debugging con herramientas como VS Code
