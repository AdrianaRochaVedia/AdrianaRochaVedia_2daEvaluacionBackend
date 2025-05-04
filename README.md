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
        "query": "mutation login($correo: String!, $contrasenia: String!) { login(correo: $correo, contrasenia: $contrasenia) { token } }",
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

