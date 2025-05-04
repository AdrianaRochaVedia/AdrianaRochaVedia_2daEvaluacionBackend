const { apiRequest } = require("./apiClient");

const resolvers = {
  Query: {
    // Obtener todos los documentos
    documentos: async (_, __, context) => {
      try {
        const response = await apiRequest("get", "/api/documentos", null, context.token);
        return response.documentos || [];
      } catch (error) {
        console.error("Error al obtener documentos:", error);
        throw new Error("Error al obtener documentos");
      }
    },
    
    // Obtener un documento por ID
    documento: async (_, { id }, context) => {
      try {
        const response = await apiRequest("get", `/api/documentos/${id}`, null, context.token);
        return response.documento || null;
      } catch (error) {
        console.error(`Error al obtener documento ${id}:`, error);
        throw new Error("Error al obtener el documento");
      }
    },
    
    // Obtener documentos por usuario
    documentosPorUsuario: async (_, { usuarioId }, context) => {
      if (!context.user || context.user.id_usuario !== usuarioId) {
        throw new Error("No autorizado");
      }
      try {
        const response = await apiRequest("get", `/api/documentos/usuario/${usuarioId}`, null, context.token);
        return response.documentos || [];
      } catch (error) {
        console.error(`Error al obtener documentos del usuario ${usuarioId}:`, error);
        throw new Error("Error al obtener documentos del usuario");
      }
    },
    
    // Buscar por nombre
    buscarDocumentosPorNombre: async (_, { nombre }, context) => {
      try {
        console.log("Buscando documento con nombre:", nombre);
        const url = `/api/documentos/buscar/nombre?nombre=${encodeURIComponent(nombre)}`;
        console.log("URL de la solicitud:", url);
        const response = await apiRequest("get", url, null, context.token);
        console.log("Respuesta:", response);
        return response.documentos || [];
      } catch (error) {
        console.error(`Error en busqueda por nombre '${nombre}':`, error);
        throw new Error("Error en la búsqueda por nombre");
      }
    },
    
    // Buscar por palabras clave
    buscarDocumentosPorPalabrasClave: async (_, { palabras_clave }, context) => {
      try {
        const response = await apiRequest(
          "get", 
          `/api/documentos/buscar/palabras-clave?palabras_clave=${encodeURIComponent(palabras_clave)}`,
          null,
          context.token
        );
        return response.documentos || [];
      } catch (error) {
        console.error(`Error en busqueda por palabras clave '${palabras_clave}':`, error);
        throw new Error("Error en la busqueda por palabras clave");
      }
    },
    
    // Buscar por tipo
    buscarDocumentosPorTipo: async (_, { tipo }, context) => {
      try {
        const response = await apiRequest(
          "get", 
          `/api/documentos/buscar/tipo?tipo=${encodeURIComponent(tipo)}`,
          null,
          context.token
        );
        return response.documentos || [];
      } catch (error) {
        console.error(`Error en busqueda por tipo '${tipo}':`, error);
        throw new Error("Error en la busqueda por tipo");
      }
    },
    
    // Buscar por año
    buscarDocumentosPorAnio: async (_, { anio }, context) => {
      try {
        const response = await apiRequest(
          "get", 
          `/api/documentos/buscar/anio?anio=${anio}`,
          null,
          context.token
        );
        return response.documentos || [];
      } catch (error) {
        console.error(`Error en busqueda por año '${anio}':`, error);
        throw new Error("Error en la busqueda por año");
      }
    },
    
    // Buscar por fuente
    buscarDocumentosPorFuente: async (_, { fuente }, context) => {
      try {
        const response = await apiRequest(
          "get", 
          `/api/documentos/buscar/fuente?fuente=${encodeURIComponent(fuente)}`,
          null,
          context.token
        );
        return response.documentos || [];
      } catch (error) {
        console.error(`Error en busqueda por fuente '${fuente}':`, error);
        throw new Error("Error en la busqueda por fuente");
      }
    },
    
    // Buscar  por filtro inteligente
    filtradoInteligente: async (_, __, context) => {
      try {
        const response = await apiRequest("get", "/api/documentos/filtrado-inteligente", null, context.token);
        return response.documentos || [];
      } catch (error) {
        console.error("Error en filtrado inteligente:", error);
        throw new Error("Error en el filtrado inteligente");
      }
    }
  },

  Documento: {
    usuario: async (parent, _, context) => {
      if (!parent.USUARIO_id_usuario) return null;
      try {
        const response = await apiRequest("get", `/api/usuarios/${parent.USUARIO_id_usuario}`, null, context.token);
        return response.usuario || null;
      } catch (error) {
        console.error(`Error al obtener usuario ${parent.USUARIO_id_usuario}:`, error);
        return null;
      }
    },
    versiones: async (parent, _, context) => {
      try {
        const response = await apiRequest("get", `/api/versiones/${parent.id_documento}`, null, context.token);
        return response.versiones || [];
      } catch (error) {
        console.error(`Error al obtener versiones del documento ${parent.id_documento}:`, error);
        return [];
      }
    },
    fecha_creacion: (parent) => parent.createdAt,
    fecha_actualizacion: (parent) => parent.updatedAt
  },

  VersionDocumento: {
    id: (parent) => parent.id_version,
    documento: async (parent, _, context) => {
      if (!parent.DOCUMENTO_id_documento) return null;
      try {
        const response = await apiRequest(
          "get", 
          `/api/documentos/${parent.DOCUMENTO_id_documento}`, 
          null, 
          context.token
        );
        return response.documento || null;
      } catch (error) {
        console.error(`Error al obtener documento ${parent.DOCUMENTO_id_documento}:`, error);
        return null;
      }
    },
    usuario: async (parent, _, context) => {
      if (!parent.USUARIO_id_usuario) return null;
      try {
        const response = await apiRequest("get", `/api/usuarios/${parent.USUARIO_id_usuario}`, null, context.token);
        return response.usuario || null;
      } catch (error) {
        console.error(`Error al obtener usuario ${parent.USUARIO_id_usuario}:`, error);
        return null;
      }
    }
  },

  Mutation: {
    login: async (_, { correo, contrasenia }) => {
      try {
        const response = await apiRequest("post", "/api/auth/login", { correo, contrasenia });
        const { token, uid } = response;
        
        const usuario = {
          id_usuario: uid,
          correo: correo,
          tipo: "Administrador" //Esto se debe cambiar para el proyecto, solo es una prueba de los datos de la bd
        };
        
        return { token, usuario };
      } catch (error) {
        console.error("Error en login:", error);
        throw new Error("Error en la autenticación");
      }
    },
    
    crearDocumento: async (_, { documentoInput }, context) => {
      if (!context.user || !context.token) {
        throw new Error("No autorizado");
      }
      try {
        const response = await apiRequest("post", "/api/documentos", documentoInput, context.token);
        return response.documento || null;
      } catch (error) {
        console.error("Error al crear documento:", error);
        throw new Error("Error al crear el documento");
      }
    },
    
    actualizarDocumento: async (_, { id, documentoInput }, context) => {
      if (!context.user || !context.token) {
        throw new Error("No autorizado");
      }
      try {
        const response = await apiRequest("put", `/api/documentos/${id}`, documentoInput, context.token);
        return response.documento || null;
      } catch (error) {
        console.error(`Error al actualizar documento ${id}:`, error);
        throw new Error("Error al actualizar el documento");
      }
    },
    
    eliminarDocumento: async (_, { id }, context) => {
      if (!context.user || !context.token) {
        throw new Error("No autorizado");
      }
      try {
        await apiRequest("delete", `/api/documentos/${id}`, null, context.token);
        return true;
      } catch (error) {
        console.error(`Error al eliminar documento ${id}:`, error);
        throw new Error("Error al eliminar el documento");
      }
    }
  }
};

module.exports = resolvers;