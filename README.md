# TecnoFact SDK para Facturación Electrónica CFDI 4.0 - Node.js

[![npm version](https://img.shields.io/npm/v/%40tecnofact%2Fsdk-nodejs.svg)](https://www.npmjs.com/package/@tecnofact/sdk-nodejs)
[![npm downloads](https://img.shields.io/npm/dm/@tecnofact/sdk-nodejs.svg)](https://www.npmjs.com/package/@tecnofact/sdk-nodejs)
[![CI](https://github.com/TecnoFact/SDK-tecnofact-nodejs/actions/workflows/ci.yml/badge.svg)](https://github.com/TecnoFact/SDK-tecnofact-nodejs/actions/workflows/ci.yml)
[![CodeQL](https://github.com/TecnoFact/SDK-tecnofact-nodejs/actions/workflows/codeql.yml/badge.svg)](https://github.com/TecnoFact/SDK-tecnofact-nodejs/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/TecnoFact/SDK-tecnofact-nodejs/blob/main/CONTRIBUTING.md)

SDK oficial de Node.js/TypeScript para la integración con el servicio de Timbrado CFDI 4.0 de TecnoFact. Facilita la emisión, cancelación y consulta de facturas electrónicas cumpliendo con los requisitos del SAT mexicano.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del SDK](#estructura-del-sdk)
- [Uso Básico](#uso-básico)
- [Modelos de Datos](#modelos-de-datos)
- [Manejo de Errores](#manejo-de-errores)
- [Testing](#testing)
- [Contribuciones](#contribuciones)
- [Soporte](#soporte)
- [Licencia](#licencia)

## ✨ Características

- **Timbrado CFDI 4.0**: Emisión de facturas electrónicas cumpliendo con la versión 4.0 del CFDI
- **Timbrado CFDI 3.3**: Soporte retroactivo para facturación CFDI 3.3
- **Cancelación**: Cancelación de CFDIs con diferentes motivos
- **Consultas**: Búsqueda y recuperación de CFDIs timbrados
- **Reportes**: Generación de reportes y estadísticas
- **Validaciones**: Validación de RFCs y catálogos del SAT
- **Health Checks**: Verificación del estado de servicios
- **TypeScript**: Totalmente tipado con TypeScript para mejor experiencia de desarrollo
- **Manejo de Errores**: Sistema robusto de excepciones personalizadas
- **Async/Await**: API moderna basada en promesas

## 🔧 Requisitos

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0 (opcional, para desarrollo)
- **Dependencias**: dotenv

## 📦 Instalación

### Usando npm

```bash
npm install @tecnofact/sdk-nodejs
```

### Usando yarn

```bash
yarn add @tecnofact/sdk-nodejs
```

### Usando pnpm

```bash
pnpm add @tecnofact/sdk-nodejs
```

### Desde el código fuente

```bash
git clone https://github.com/TecnoFact/SDK-tecnofact-nodejs.git
cd SDK-tecnofact-nodejs
npm install
npm run build
```

### Para desarrollo

```bash
npm install --save-dev @types/node @types/jest
npm run dev
```

## ⚙️ Configuración

### Constructor Directo

```typescript
import { Config, Environment } from '@tecnofact/sdk-nodejs';

const config = new Config({
  email: 'tu_email@tudominio.com',
  password: 'tu_password',
  environment: Environment.PRODUCTION,
  timeout: 30,
  retries: 3,
});

console.log(`Entorno: ${config.getEnvironment()}`);
console.log(`URL Base: ${config.getBaseUrl()}`);
console.log(`Timeout: ${config.getTimeout()} s`);
```

### Variables de Entorno

Crea un archivo `.env`:

```env
TECN_FACT_EMAIL=tu_email@tudominio.com
TECN_FACT_PASSWORD=tu_password
TECN_FACT_ENVIRONMENT=production
TECN_FACT_TIMEOUT=30
TECN_FACT_RETRIES=3
# TECN_FACT_VERIFY_SSL=true
```

```typescript
import * as dotenv from 'dotenv';
import { Config } from '@tecnofact/sdk-nodejs';

dotenv.config();

const config = Config.fromEnvironment();

console.log(`Entorno: ${config.getEnvironment()}`);
console.log(`URL Base: ${config.getBaseUrl()}`);
console.log(`Timeout: ${config.getTimeout()} s`);
```

## 🏗️ Estructura del SDK

```
src/
├── config/
│   └── Config.ts              # Configuración del SDK
├── contracts/
│   └── IHttpClient.ts         # Interfaz para el cliente HTTP
├── enums/
│   ├── Environment.ts         # Entornos (Production)
│   └── TipoComprobante.ts     # Tipos de CFDI
├── exceptions/
│   ├── TecnoFactException.ts       # Excepción base
│   ├── AuthenticationException.ts  # Error de autenticación
│   ├── ValidationException.ts      # Error de validación
│   ├── TimbradoException.ts        # Error de timbrado
│   ├── CancelacionException.ts     # Error de cancelación
│   ├── NotFoundException.ts        # Recurso no encontrado
│   ├── RateLimitException.ts       # Límite de peticiones
│   └── ServerException.ts          # Error del servidor
├── http/
│   └── HttpClient.ts          # Cliente HTTP con fetch
├── models/
│   ├── Emisor.ts              # Datos del emisor
│   ├── Receptor.ts            # Datos del receptor
│   ├── Concepto.ts            # Conceptos de factura
│   ├── Cfdi4Request.ts        # Solicitud CFDI 4.0
│   ├── PagoRequest.ts         # Solicitud de complemento de pago
│   ├── Impuestos.ts           # Impuestos globales
│   ├── ImpuestosConcepto.ts   # Impuestos por concepto
│   ├── Traslado.ts            # Traslado de impuestos
│   ├── TrasladoGlobal.ts      # Traslado global
│   ├── Retencion.ts           # Retención de impuestos
│   └── RetencionGlobal.ts     # Retención global
├── responses/
│   ├── ResultadoTimbrado.ts   # Respuesta de timbrado
│   ├── EstatusCfdi.ts         # Estatus/validación de CFDI
│   └── AcuseCancelacion.ts    # Acuse de cancelación
├── services/
│   ├── Service.ts             # Base abstracta de servicios
│   ├── AuthService.ts        # Login / refresh / logout (JWT)
│   ├── CfdiService.ts        # Timbrado, validación, XML/PDF/HTML
│   ├── CancelacionService.ts  # Cancelación de CFDI
│   ├── ConsultasService.ts    # Consultas por RFC/UUID/Serie/SAT
│   ├── ReportesService.ts     # Reportes y exportaciones
│   └── ValidacionesService.ts # Validación de XML/RFC/catálogos
└── xml/
    └── CfdiXmlBuilder.ts      # Constructor de XML CFDI 4.0 / Pagos 2.0
```

## 💻 Uso Básico

### Ejemplo: Crear Configuración

```typescript
import { Config, Environment } from '@tecnofact/sdk-nodejs';

const config = new Config({
  email: 'tu_email@tudominio.com',
  password: 'tu_password',
  environment: Environment.PRODUCTION,
  timeout: 30,
  retries: 3,
});

console.log(`Entorno: ${config.getEnvironment()}`);
console.log(`URL Base: ${config.getBaseUrl()}`);
console.log(`Timeout: ${config.getTimeout()} s`);

// Convertir a objeto
const data = config.toObject();
console.log(data);
```

### Ejemplo: Enum Environment

```typescript
import { Environment, EnvironmentHelper } from '@tecnofact/sdk-nodejs';

// Usar enum con autocompletado
const env = Environment.PRODUCTION;

if (env === Environment.PRODUCTION) {
  console.log('Entorno de producción');
}

// Métodos del helper
console.log(EnvironmentHelper.isProduction(env)); // true
console.log(EnvironmentHelper.getLabel(env));     // 'Producción'
console.log(EnvironmentHelper.getBaseUrl(env));   // https://panelcfdi.tecnofact.mx
```

## 🔐 Autenticación

El SDK usa autenticación basada en **email/password + JWT Bearer** gestionado por
`AuthService`. El flujo típico es:

1. Crear `Config` con `email` y `password` (sin token aún).
2. Crear un `HttpClient` inyectando esa `Config`.
3. Llamar a `new AuthService(config, httpClient).login(email, password)`.
   - El JWT (`access_token`) devuelto se almacena automáticamente en la
     instancia de `Config` mediante `config.setToken(...)`.
4. A partir de ese momento, todas las llamadas del resto de servicios
   (`CfdiService`, `CancelacionService`, etc.) incluyen automáticamente la
   cabecera `Authorization: Bearer <token>`, ya que extienden la misma
   `Config`.

> Antes del `login` no se envía `Authorization` (se evita enviar un
> `Bearer null` inválido). Tras `logout()` el token se limpia de `Config`.

```typescript
import { Config, HttpClient, AuthService } from '@tecnofact/sdk-nodejs';

const config = new Config({
  email: 'tu_email@tudominio.com',
  password: 'tu_password',
});

const httpClient = new HttpClient(config);
const auth = new AuthService(config, httpClient);

await auth.login('tu_email@tudominio.com', 'tu_password');

// config.getToken() ahora contiene el JWT; las llamadas siguientes
// lo incluyen automáticamente como Authorization: Bearer <token>.
```

## 🧰 Servicios disponibles

Todos los servicios extienden `Service` (inyectan `Config` + `IHttpClient`) y
se exponen desde la raíz del paquete:

| Servicio | Método principal |
| --- | --- |
| `AuthService` | `auth.login(email, password)` |
| `CfdiService` | `cfdi.timbrar(cfdi)` — también `cfdi.timbrarPago(pagoRequest)`, `cfdi.validar(xml)` |
| `CancelacionService` | `cancelacion.cancelar(rfc, uuid, motivo)` |
| `ConsultasService` | `consultas.buscarPorUuid(uuid)` — también por RFC, serie/folio y SAT |
| `ReportesService` | `reportes.exportarCsv(fechaInicio, fechaFin)` — también Excel, resumen, ventas, cancelaciones |
| `ValidacionesService` | `validaciones.validarRfc(rfc)` — también XML, no. de certificado y catálogos |

Ejemplo rápido:

```typescript
import { Config, HttpClient, AuthService, CfdiService } from '@tecnofact/sdk-nodejs';

const config = new Config({ email: 'tu_email@tudominio.com', password: 'tu_password' });
const httpClient = new HttpClient(config);

await new AuthService(config, httpClient).login('tu_email@tudominio.com', 'tu_password');

const cfdi = new CfdiService(config, httpClient);
const resultado = await cfdi.timbrar(cfdiRequest);
console.log(resultado.getUuid(), resultado.getXmlTimbrado());
```

## 📋 Modelos de Datos

### Emisor

```typescript
import { Emisor } from '@tecnofact/sdk-nodejs';

const emisor = new Emisor({
  rfc: 'XAXX010101000',
  nombre: 'EMPRESA EMISORA SA DE CV',
  regimenFiscal: '601',
  cp: '06300',
});

console.log(emisor.getRfc());     // XAXX010101000
console.log(emisor.getNombre());  // EMPRESA EMISORA SA DE CV
console.log(emisor.toObject());
```

### Receptor

```typescript
import { Receptor } from '@tecnofact/sdk-nodejs';

const receptor = new Receptor({
  rfc: 'XAXX010101001',
  nombre: 'CLIENTE RECEPTOR',
  usoCfdi: 'G03',
  domicilioFiscalReceptor: '06300',
  regimenFiscalReceptor: '612',
});
```

### Concepto con Impuestos

```typescript
import { Concepto, ImpuestosConcepto, Traslado } from '@tecnofact/sdk-nodejs';

const concepto = new Concepto({
  claveProdServ: '01010101',
  cantidad: 1,
  claveUnidad: 'E48',
  descripcion: 'Servicio de desarrollo de software',
  valorUnitario: 10000.00,
  importe: 10000.00,
  objetoImp: '02', // Sí objeto de impuesto
  impuestos: new ImpuestosConcepto({
    traslados: [
      new Traslado({
        base: 10000.00,
        impuesto: '002', // IVA
        tipoFactor: 'Tasa',
        tasaOCuota: 0.160000,
        importe: 1600.00,
      }),
    ],
  }),
});
```

### CFDI 4.0 Request Completo

```typescript
import {
  Cfdi4Request,
  Emisor,
  Receptor,
  Concepto,
  Impuestos,
  TrasladoGlobal,
} from '@tecnofact/sdk-nodejs';

const cfdiRequest = new Cfdi4Request({
  emisor,
  receptor,
  conceptos: [concepto],
  tipoComprobante: 'I',
  formaPago: '01',
  metodoPago: 'PUE',
  moneda: 'MXN',
  subtotal: 10000.00,
  total: 11600.00,
  lugarExpedicion: '06300',
  impuestos: new Impuestos({
    totalImpuestosTrasladados: 1600.00,
    traslados: [
      new TrasladoGlobal({
        impuesto: '002',
        tipoFactor: 'Tasa',
        tasaOCuota: 0.16,
        importe: 1600.00,
      }),
    ],
  }),
});

console.log(cfdiRequest.toObject());
```

## ⚠️ Manejo de Errores

El SDK proporciona excepciones específicas para diferentes tipos de errores:

```typescript
import {
  HttpClient,
  TecnoFactException,
  AuthenticationException,
  ValidationException,
  TimbradoException,
  NotFoundException,
  RateLimitException,
  ServerException,
} from '@tecnofact/sdk-nodejs';

const httpClient = new HttpClient(config);

try {
  const response = await httpClient.get('cfdi/consultar/UUID123');
  console.log('Respuesta:', response);
} catch (error) {
  if (error instanceof AuthenticationException) {
    console.error('Error de autenticación:', error.message);
    console.error('Detalles:', error.getDetails());
  } else if (error instanceof ValidationException) {
    console.error('Error de validación:', error.message);
  } else if (error instanceof TimbradoException) {
    console.error('Error en timbrado:', error.message);
  } else if (error instanceof NotFoundException) {
    console.error('Recurso no encontrado:', error.message);
  } else if (error instanceof RateLimitException) {
    console.error('Límite de peticiones excedido:', error.message);
  } else if (error instanceof ServerException) {
    console.error('Error del servidor:', error.message);
  } else if (error instanceof TecnoFactException) {
    console.error('Error general:', error.message);
    console.error('Código:', error.code);
  }
}
```

## 🐳 Desarrollo con Docker

El proyecto incluye configuración de Docker para facilitar el desarrollo:

```bash
# Modo desarrollo (watch mode)
docker-compose up sdk-dev

# Ejecutar tests
docker-compose up sdk-test

# Ejecutar linter
docker-compose up sdk-lint
```

Ver [README.docker.md](./README.docker.md) para más detalles.

## 🔄 CI/CD

El proyecto utiliza GitHub Actions para:

- **CI (Continuous Integration)**: Tests automáticos en cada push/PR
  - Ejecuta tests en Node.js 18.x, 20.x, 22.x
  - Verifica linting y cobertura de código

- **CD (Continuous Deployment)**: Publicación automática
  - Genera releases en GitHub al crear tags `v*.*.*`
  - Publica automáticamente a npm
  - Genera changelog automático

- **Security**: Análisis de seguridad con CodeQL

## 🧪 Testing

El SDK incluye una suite completa de tests unitarios.

### Ejecutar Tests

```bash
# Instalar dependencias
npm install

# Ejecutar todos los tests
npm test

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar en modo watch
npm run test:watch
```

### Análisis Estático

```bash
# Linting con ESLint
npm run lint

# Formateo con Prettier
npm run format

# Build del proyecto
npm run build
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar TypeScript con tipado estricto
- Seguir las reglas de ESLint configuradas
- Escribir tests para nuevas funcionalidades
- Mantener cobertura de tests > 80%
- Documentar funciones públicas con JSDoc

## 💬 Soporte

- **Email**: soporte@tecnofact.com
- **Documentación**: https://docs.tecnofact.com
- **Issues**: https://github.com/TecnoFact/SDK-tecnofact-nodejs/issues

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🏢 Sobre TecnoFact

TecnoFact es un proveedor autorizado de certificación (PAC) que ofrece servicios de timbrado de CFDI cumpliendo con todos los requisitos del SAT mexicano.

### Características del Servicio

- ✅ PAC Autorizado por el SAT
- ✅ Disponibilidad 99.9%
- ✅ Soporte técnico especializado
- ✅ Precios competitivos
- ✅ API REST moderna
- ✅ Documentación completa
- ✅ SDKs en múltiples lenguajes

---

Desarrollado con ❤️ por TecnoFact
