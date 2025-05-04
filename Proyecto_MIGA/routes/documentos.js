/*
    Rutas de documentos / Documentos
    host + /api/documentos
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt'); // Asumiendo que tienes este middleware
const { generarJWT } = require('../helpers/jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const { 
    getDocumentos,
    getDocumento,
    crearDocumento,
    actualizarDocumento,
    eliminarDocumento,
    // Nuevos métodos de búsqueda
    buscarPorNombre,
    buscarPorPalabrasClave,
    buscarPorTipo,
    buscarPorAnio,
    buscarPorFuente,
    filtradoInteligente
} = require('../controllers/documentos');

const router = Router();


// Todos los documnentos
router.get('/', getDocumentos);

// un documento por ID
router.get('/:id', [
    check('id', 'El ID debe ser un número válido').isInt(),
    validarCampos
], getDocumento);

// Crear nuevo documento
router.post('/', validarJWT,[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('tipo', 'El tipo es obligatorio').not().isEmpty(),
    check('fuente_origen', 'La fuente de origen es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('importancia', 'La importancia es obligatoria').not().isEmpty(),
    check('enlace', 'El enlace debe ser una URL válida').optional().isURL(),
    check('anio_publicacion', 'El año de publicación debe ser una fecha válida').optional().isDate(),
    check('alcance', 'El alcance es obligatorio').not().isEmpty(),
    check('concepto_basico', 'El concepto básico es obligatorio').not().isEmpty(),
    check('aplicacion', 'La aplicación es obligatoria').not().isEmpty(),
    check('cpe', 'El CPE es obligatorio').not().isEmpty(),
    check('jerarquia', 'La jerarquía es obligatoria').not().isEmpty(),
    validarCampos
], crearDocumento);

// Actualizar documento
router.put('/:id', validarJWT, [
    check('id', 'El ID debe ser un número válido').isInt(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('tipo', 'El tipo es obligatorio').not().isEmpty(),
    check('fuente_origen', 'La fuente de origen es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('importancia', 'La importancia es obligatoria').not().isEmpty(),
    check('enlace', 'El enlace debe ser una URL válida').optional().isURL(),
    check('anio_publicacion', 'El año de publicación debe ser una fecha válida').optional().isDate(),
    check('alcance', 'El alcance es obligatorio').not().isEmpty(),
    check('concepto_basico', 'El concepto básico es obligatorio').not().isEmpty(),
    check('aplicacion', 'La aplicación es obligatoria').not().isEmpty(),
    check('cpe', 'El CPE es obligatorio').not().isEmpty(),
    check('jerarquia', 'La jerarquía es obligatoria').not().isEmpty(),
    validarCampos
], actualizarDocumento);

// Eliminar documento
router.delete('/:id', validarJWT, [
    check('id', 'El ID debe ser un número válido').isInt(),
    validarCampos
], eliminarDocumento);

// rutas de búsqueda

router.get('/buscar/nombre', validarJWT, buscarPorNombre);
router.get('/buscar/palabras-clave', validarJWT, buscarPorPalabrasClave);
router.get('/buscar/tipo', validarJWT, buscarPorTipo);
router.get('/buscar/anio', validarJWT, buscarPorAnio);
router.get('/buscar/fuente', validarJWT, buscarPorFuente);
router.get('/buscar/inteligente', validarJWT, filtradoInteligente);

module.exports = router;