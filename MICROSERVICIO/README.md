# Microservicio GraphQL para la gestión de documentos - Proyecto integrador "MIGA"

## DESCRIPCION GENERAL

Este proyecto implementa un microservicio independiente utilizando GraphQL que consume una API REST desarrollada para el sistema del Proyecto Integrador MIGA. El microservicio se encarga de:
Autenticarse automáticamente mediante JWT con la API REST.
Consultar y administrar documentos, usuarios y búsquedas de los documentos en base a distintos requerimientos.
Exponer un endpoint GraphQL propio con múltiples consultas y mutaciones.
Permitir búsquedas, filtrados inteligentes, y generación de reportes.

## TECNOLOGIAS UTILIZADAS

- Node.js
- Apollo Server (GraphQL)
- Express.js
- Axios (cliente HTTP para la API REST externa)
- dotenv (para manejo de variables de entorno)
- jsonwebtoken (para verificar y decodificar JWT)

## INSTALACION

### 1. Clonar repositorio

git clone https://github.com/AdrianaRochaVedia/AdrianaRochaVedia_2daEvaluacionBackend.git  
cd  MICROSERVICIO  

### 2. Instalación de dependencias

npm install

### 3. Creación del archivo .env

Se debe modificar el archivo .env de acuerdo al siguiente contenido: 
    PORT=4000
    API_URL=http://localhost:3000
    JWT_SECRET=Esto-Es-UnA-PalbR@_SecretA180605

### 4. Levantar el servidor

    node .

## USO

Una vez el servidor se encuentre levantado, se puede acceder al GraphQL Playground en:
    http://localhost:4000/graphql

## EJEMPLO DE CONSULTA

### 1. Para el login (generar el token que permita realizar las demás consultas)

En el body :  
    {  

        "query": " login($correo: String!, $contrasenia: String!) { login(correo: $correo, contrasenia: $contrasenia) { token } }",  
        "variables": {  
            "correo": "ejemplo1@correo.com",  
            "contrasenia": "claveSegura123"  
        }  

    }  

#### Repuesta
    {  
        "data": {  
            "login": {  
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImNvcnJlbyI6ImVqZW1wbG8xQGNvcnJlby5jb20iLCJpYXQiOjE3NDYzNzc3OTMsImV4cCI6MTc0Njk4MjU5M30.gSWbH6bTVk0Mbv9i9r8bA1CQC7tFj1r3nwbqO6AXE9U"  
            }  
        }  
    }  

### 2. Para la búsqueda de documentos por nombre

En el body :    
    {   
           
        "query": "query { buscarDocumentosPorNombre(nombre: \"Guía de Seguridad Cibernética\") { id_documento nombre tipo } }" 
            
    }      

En el header: 
     
        key : x-token  
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImNvcnJlbyI6ImVqZW1wbG8xQGNvcnJlby5jb20iLCJpYXQiOjE3NDYzNzc3OTMsImV4cCI6MTc0Njk4MjU5M30.gSWbH6bTVk0Mbv9i9r8bA1CQC7tFj1r3nwbqO6AXE9U  
            

#### Repuesta  
    {   
        "data": {  
            "login": {    
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImNvcnJlbyI6ImVqZW1wbG8xQGNvcnJlby5jb20iLCJpYXQiOjE3NDYzNzc3OTMsImV4cCI6MTc0Njk4MjU5M30.gSWbH6bTVk0Mbv9i9r8bA1CQC7tFj1r3nwbqO6AXE9U"  
            }    
        }    
    }   

## ESTRUCTURA DEL PROYECTO
  
    /MICROSERVICIO
    ├── node_modules
    ├── src/
    │ ├── resolvers.js
    │ ├── schema.graphql
    │ ├── apiClient.js
    │ └── server.js
    ├── test/
    ├── resolvers.test.js
    ├── .env
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    └── README.md  

#### 1. shema.graphql
El esquema define tipos para:  
- Usuario: Representa usuarios del sistema  
- Documento: Representa documentos con sus atributos  
- VersionDocumento: Representa versiones de documentos  
- Queries: Para consultar información (documentos, búsquedas especializadas)  
- Mutations: Para operaciones que modifican datos (login, crear/actualizar documentos)  

#### 2. resolvers.js  
Los resolvers implementan la lógica para:  
- Consultar documentos y sus detalles  
- Buscar documentos por diferentes criterios (nombre, tipo, palabras clave, etc.)  
- Manejar autenticación de usuarios  
- Aplicar lógica de autorización basada en tokens JWT  

#### 3. apiClient.js  
Proporciona funciones para:  
- Gestionar la autenticación automática con la API  
- Realizar solicitudes HTTP a los endpoints  
- Manejar errores y reintentos  
- Almacenar y renovar tokens JWT  

#### 4. server.js 
Configura el servidor GraphQL con:  
- Integración con Express  
- Middleware para autenticación JWT  
- Formateo de errores  
- Contexto para pasar información de autenticación a los resolvers  

#### 5. resolvers.test.js 
Contiene las pruebas unitarias para los resolvers del microservicio. En este archivo, se implementan los casos de prueba para verificar el   comportamiento de la función buscarDocumentosPorNombre bajo diferentes condiciones (cuando la búsqueda tiene éxito, cuando no se encuentran   documentos, y cuando ocurre un error).  

#### 6. .env   
Este archivo almacena las variables de entorno de configuración, como la URL base del API del proyecto integrador y las credenciales de autenticación. Su uso permite desacoplar la configuración del código, facilitando la gestión en diferentes entornos.  

#### 7. .gitignore    
Este archivo especifica los archivos y directorios que deben ser ignorados por el sistema de control de versiones Git, como el directorio de dependencias (node_modules/) y archivos de configuración local.   

## CONSIDERACIONES

- Puede ser fácilmente extendido con nuevas queries o mutaciones si la API REST base evoluciona.  
- Utiliza JWT para manejar seguridad y autenticación de manera transparente en las peticiones.  

## AUTOR

Proyecto desarrollado como parte del Proyecto Integrador de MIGA, con el objetivo de aplicar conceptos de microservicios, autenticación segura y orquestación de APIs REST mediante GraphQL.  
ROCHA VEDIA ADRIANA NATHALIE