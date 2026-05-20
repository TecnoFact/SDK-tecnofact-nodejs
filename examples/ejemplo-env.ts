import * as dotenv from 'dotenv';
import { Config, Environment } from '../src';

dotenv.config();

function ejemploConEnv(): void {
  const config = new Config({
    apiKey: process.env.TECNOFACT_API_KEY || '',
    apiSecret: process.env.TECNOFACT_API_SECRET || '',
    environment:
      (process.env.TECNOFACT_ENVIRONMENT?.toUpperCase() as Environment) || Environment.SANDBOX,
    timeout: parseInt(process.env.TECNOFACT_TIMEOUT || '30000', 10),
  });

  const configObject = config.toObject();
  const safeConfigObject = {
    ...configObject,
    apiKey: '[REDACTED]',
    apiSecret: '[REDACTED]',
  };

  console.log('Configuración desde variables de entorno:');
  console.log(JSON.stringify(safeConfigObject, null, 2));
}

ejemploConEnv();
