import {
  Config,
  Environment,
  HttpClient,
  AuthenticationException,
  ValidationException,
  TimbradoException,
  NotFoundException,
  RateLimitException,
  ServerException,
  TecnoFactException,
} from '../src';

async function ejemploManejoErrores(): Promise<void> {
  const config = new Config({
    apiKey: 'TU_API_KEY',
    apiSecret: 'TU_API_SECRET',
    environment: Environment.SANDBOX,
  });

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
      console.error('Detalles:', error.getDetails());
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
    } else {
      console.error('Error desconocido:', error);
    }
  }
}

ejemploManejoErrores().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
