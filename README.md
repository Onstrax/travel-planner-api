# TRAVEL PLANNER API (NESTJS)

API REST construida en NestJS para gestionar países (con caché) y planes de viaje.

Usa MongoDB como base de datos y la API pública RestCountries como fuente externa de información.

## CÓMO EJECUTAR EL PROYECTO

### 1.1. Instalar dependencias

En la raíz del proyecto, ejecutar:
```bash
npm install
```

### 1.2. Configurar variables de entorno

Crear un archivo llamado `.env` en la raíz del proyecto con el siguiente contenido:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/travel_planner
REST_COUNTRIES_BASE_URL=https://restcountries.com/v3.1
```

### 1.3. Asegurar que MongoDB esté corriendo

**Opción A:** Servicio local (instalado mediante el MSI oficial de MongoDB Community Server)

1. Instala MongoDB Community Server desde la página oficial: https://www.mongodb.com/try/download/community
2. Durante la instalación, deja seleccionada la opción "Install MongoDB as a Service".
3. Una vez instalado, el servicio se inicia automáticamente.
4. Si deseas iniciarlo manualmente, abre PowerShell como Administrador y ejecuta:
```cmd
   net start MongoDB
```
5. Para detenerlo:
```cmd
   net stop MongoDB
```

El servicio queda escuchando en:
```
mongodb://localhost:27017
```

**Opción B:** Usando Docker Desktop (recomendado):

Si tienes Docker Desktop instalado en Windows, ejecuta:
```cmd
docker run -d --name mongo-travel -p 27017:27017 mongo:7
```

### 1.4. Ejecutar la API

En la raíz del proyecto:
```bash
npm run start:dev
```

La API quedará disponible en:

- http://localhost:3000/ (página estática servida desde la carpeta "public")
- http://localhost:3000/countries
- http://localhost:3000/travel-plans

## DESCRIPCIÓN MÍNIMA DE LA API

La API se organiza en dos módulos principales:

**CountriesModule**

- Gestiona países con caché en MongoDB.
- Cuando se consulta un país por código y no está en la base de datos, lo obtiene desde RestCountries, lo almacena y lo devuelve.
- Solo expone los campos definidos en el modelo interno Country.

**TravelPlansModule**

- Gestiona planes de viaje asociados a un país (por código alpha-3).
- Valida los datos de entrada y las fechas.
- Permite crear planes, listarlos y obtener el detalle de un plan por su id.

## DOCUMENTACIÓN DE ENDPOINTS

### MÓDULO COUNTRIES

#### GET /countries

**Descripción:** Lista todos los países almacenados en la base de datos.

**Ejemplo de uso:**
```bash
curl http://localhost:3000/countries
```

#### GET /countries/:code

**Descripción:** Obtiene un país por su código alpha-3 (por ejemplo, COL, ARG, etc.).

**Flujo:**

- Primero busca en MongoDB (caché).
- Si el país no existe en caché, consulta RestCountries, guarda el resultado y lo devuelve.
- El objeto de respuesta incluye un campo "source" que indica "api" o "cache".

**Ejemplo de uso:**
```bash
curl http://localhost:3000/countries/COL
```

### MÓDULO TRAVEL PLANS

#### POST /travel-plans

**Descripción:** Crea un nuevo plan de viaje.

**Body JSON de ejemplo:**
```json
{
  "countryCode": "COL",
  "title": "Vacaciones en Colombia",
  "startDate": "2025-12-01",
  "endDate": "2025-12-15",
  "notes": "Visitar Bogotá y Medellín"
}
```

**Ejemplo de uso:**
```bash
curl -X POST http://localhost:3000/travel-plans \
  -H "Content-Type: application/json" \
  -d '{ "countryCode": "COL", "title": "Vacaciones en Colombia", "startDate": "2025-12-01", "endDate": "2025-12-15", "notes": "Visitar Bogotá y Medellín" }'
```

#### GET /travel-plans

**Descripción:** Lista todos los planes de viaje almacenados.

**Ejemplo:**
```bash
curl http://localhost:3000/travel-plans
```

#### GET /travel-plans/:id

**Descripción:** Obtiene el detalle de un plan de viaje por su id.

**Ejemplo:**
```bash
curl http://localhost:3000/travel-plans/ID_AQUI
```

## EXPLICACIÓN DEL PROVIDER EXTERNO (RESTCOUNTRIES)

La API utiliza un provider llamado `RestCountriesProvider` que encapsula el acceso a la API pública de RestCountries.

**URL base utilizada (configurable por .env):**
```env
REST_COUNTRIES_BASE_URL=https://restcountries.com/v3.1
```

**Flujo de funcionamiento:**

1. El módulo de países recibe un código alpha-3 (por ejemplo, "COL").
2. Busca primero en la colección de countries en MongoDB.
3. Si el país existe en la base de datos, se devuelve directamente con "source" = "cache".
4. Si el país no existe en caché, `RestCountriesProvider` realiza una petición HTTP a la API de RestCountries, a un endpoint del estilo:
```
   /alpha/{code}?fields=name,capital,region,subregion,population,flags,cca3
```
5. De la respuesta de RestCountries solo se toman y transforman los campos necesarios para el modelo interno: código alpha-3, nombre, región, subregión, capital, población y URL de la bandera.
6. Ese país se guarda en MongoDB y se devuelve la respuesta con "source" = "api".
7. En consultas posteriores al mismo código, ya se leerá directamente de la base de datos.

## MODELO DE DATOS

### MODELO COUNTRY

Entidad que representa un país almacenado en la caché local (MongoDB).

**Campos principales:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| **alpha3Code** | `string` | Código alpha-3 del país, por ejemplo "COL", "ARG". |
| **name** | `string` | Nombre del país, por ejemplo "Colombia". |
| **region** | `string` | Región a la que pertenece, por ejemplo "Americas". |
| **subregion** | `string` | Subregión, por ejemplo "South America". |
| **capital** | `string` | Ciudad capital, por ejemplo "Bogotá". |
| **population** | `number` | Población del país. |
| **flagUrl** | `string` | URL de la bandera nacional. |
| **createdAt** | `Date` | Fecha en que el país fue almacenado en la base de datos (generada por Mongoose con timestamps). |

### MODELO TRAVELPLAN

Entidad que representa un plan de viaje para un país.

**Campos principales:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| **id** | `string` | Identificador único generado por MongoDB (ObjectId convertido a string). |
| **countryCode** | `string` | Código alpha-3 del país destino del viaje, por ejemplo "COL". |
| **title** | `string` | Título o nombre del viaje, por ejemplo "Vacaciones en Colombia". |
| **startDate** | `Date` | Fecha de inicio del viaje. |
| **endDate** | `Date` | Fecha de fin del viaje. |
| **notes** | `string` (opcional) | Notas adicionales relacionadas con el viaje (comentarios, ideas, etc.). |
| **createdAt** | `Date` | Fecha de creación del plan de viaje, generada por Mongoose (timestamps). |

## Extensión de la API

Se extendió la API para incorporar operaciones más avanzadas de administración y observabilidad. Por un lado, se añadió un endpoint protegido que permite eliminar países de la caché de MongoDB (`DELETE /countries/:code`), con lógica que impide borrar países que estén siendo usados por planes de viaje. Por otro lado, se agregó un middleware de logging que registra la actividad de la API para las rutas `/countries` y `/travel-plans`, incluyendo método HTTP, ruta, código de estado y tiempo de respuesta, lo que facilita el monitoreo y depuración.

### Endpoint protegido y guard de autorización

El nuevo endpoint `DELETE /countries/:alpha3Code` permite eliminar un país de la caché (colección `countries`). Antes de borrar, el servicio verifica si existen planes de viaje asociados en la colección de `travelplans` (filtra por `countryCode`). Si hay planes asociados, se responde con un error 400 (Bad Request) y no se realiza el borrado. Si el país no existe en la caché, se responde con 404 (Not Found).

Este endpoint está protegido por un **Guard de autorización** que revisa el header `delete-token` en la petición y lo compara con un token configurado en el archivo `.env` mediante la variable `COUNTRIES_DELETE_TOKEN`. Si el header no está presente o el valor no coincide con el token esperado, el guard lanza una excepción 403 (Forbidden) y la petición nunca llega al controlador.

**Para validar el funcionamiento:**

1. Enviar un `DELETE` sin header `delete-token` y comprobar que responde **403**.
2. Enviar un `DELETE` con un token incorrecto y verificar que también responde **403**.
3. Enviar un `DELETE` con el token correcto pero con planes de viaje asociados a ese país y comprobar que responde **400**.
4. Finalmente, eliminar un país que exista en caché y no tenga planes asociados, con el token correcto, y verificar que responde con un mensaje de éxito y código **200**.

### Middleware de logging

Se implementó un **middleware de logging** que se aplica a todas las rutas (`/*`) a nivel de `AppModule`. Este middleware intercepta cada petición, registra la hora de inicio, deja pasar la request y, cuando la respuesta termina (evento `finish`), calcula el tiempo total de procesamiento y escribe por consola una línea con el formato: método HTTP, ruta solicitada, código de estado y duración en milisegundos.

De esta forma, cualquier operación sobre países o planes de viaje (GET, POST, DELETE, etc.) queda registrada en la salida estándar del servidor.

**Para validar su funcionamiento:** basta con realizar cualquier petición y observar en la consola donde se está ejecutando NestJS que se imprimen los logs correspondientes a cada request.