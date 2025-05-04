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

npm installl