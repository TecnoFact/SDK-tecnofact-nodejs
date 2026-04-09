# Contribuyendo a TecnoFact SDK Node.js

¡Gracias por tu interés en contribuir al SDK de TecnoFact para Node.js! Este documento proporciona pautas para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables a soporte@tecnofact.com.

## 🤝 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

- Descripción clara del problema
- Pasos para reproducir el bug
- Comportamiento esperado vs. comportamiento actual
- Versión del SDK y Node.js
- Código de ejemplo que demuestre el problema

### Sugerir Mejoras

Para sugerir nuevas características:

1. Verifica que no exista un issue similar
2. Crea un nuevo issue describiendo la mejora
3. Explica por qué sería útil para otros usuarios
4. Proporciona ejemplos de uso si es posible

## 🛠️ Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js >= 14.0.0
- npm o yarn
- Git

### Configuración

```bash
# Clonar el repositorio
git clone https://github.com/TecnoFact/SDK-tecnofact-nodejs.git
cd SDK-tecnofact-nodejs

# Instalar dependencias
npm install

# Compilar el proyecto
npm run build

# Ejecutar tests
npm test
```

## 📝 Estándares de Código

### TypeScript

- Usar TypeScript con tipado estricto
- Todas las funciones públicas deben tener tipos explícitos
- Evitar el uso de `any` cuando sea posible
- Usar interfaces para definir contratos

### Estilo de Código

- Seguir las reglas de ESLint configuradas
- Usar Prettier para formateo automático
- Nombres descriptivos en camelCase
- Constantes en UPPER_SNAKE_CASE
- Clases en PascalCase

### Ejemplo de Código

```typescript
export interface UserData {
  id: string;
  name: string;
  email: string;
}

export class User {
  private readonly id: string;
  private readonly name: string;
  private readonly email: string;

  constructor(data: UserData) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
  }

  getId(): string {
    return this.id;
  }

  toObject(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}
```

### Testing

- Escribir tests para todas las nuevas funcionalidades
- Mantener cobertura de código > 80%
- Usar nombres descriptivos para los tests
- Seguir el patrón AAA (Arrange, Act, Assert)

```typescript
describe('User', () => {
  it('should create a user with valid data', () => {
    // Arrange
    const userData = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    };

    // Act
    const user = new User(userData);

    // Assert
    expect(user.getId()).toBe('123');
  });
});
```

## 🔄 Proceso de Pull Request

1. **Fork el Proyecto**
   ```bash
   git clone https://github.com/TU_USUARIO/SDK-tecnofact-nodejs.git
   ```

2. **Crear una Rama**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

3. **Hacer Cambios**
   - Escribe código limpio y bien documentado
   - Añade tests para nuevas funcionalidades
   - Actualiza la documentación si es necesario

4. **Ejecutar Tests**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

5. **Commit**
   ```bash
   git commit -m "feat: añadir nueva funcionalidad"
   ```

   Formato de commits:
   - `feat:` nueva funcionalidad
   - `fix:` corrección de bug
   - `docs:` cambios en documentación
   - `style:` formateo, punto y coma faltantes, etc.
   - `refactor:` refactorización de código
   - `test:` añadir tests
   - `chore:` actualizar tareas de build, etc.

6. **Push**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

7. **Crear Pull Request**
   - Describe los cambios realizados
   - Referencia issues relacionados
   - Asegúrate de que todos los checks pasen

## 📋 Checklist para Pull Requests

- [ ] El código compila sin errores
- [ ] Todos los tests pasan
- [ ] Se añadieron tests para nuevas funcionalidades
- [ ] La documentación está actualizada
- [ ] El código sigue los estándares del proyecto
- [ ] Los commits tienen mensajes descriptivos
- [ ] No hay conflictos con la rama main

## 🐛 Reportar Bugs

Usa el template de issue para reportar bugs:

```markdown
**Descripción del Bug**
Descripción clara y concisa del bug.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer click en '....'
3. Scroll hasta '....'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperabas que sucediera.

**Screenshots**
Si aplica, añade screenshots.

**Entorno:**
 - OS: [e.g. Windows, macOS, Linux]
 - Node.js Version: [e.g. 18.0.0]
 - SDK Version: [e.g. 1.0.0]

**Contexto Adicional**
Cualquier otra información relevante.
```

## 💡 Sugerir Mejoras

Usa el template de feature request:

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema.

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda.

**Describe alternativas que hayas considerado**
Descripción de soluciones o características alternativas.

**Contexto Adicional**
Cualquier otra información o screenshots.
```

## 📞 Contacto

Si tienes preguntas, puedes contactarnos en:

- Email: soporte@tecnofact.com
- Issues: https://github.com/TecnoFact/SDK-tecnofact-nodejs/issues

¡Gracias por contribuir! 🎉
