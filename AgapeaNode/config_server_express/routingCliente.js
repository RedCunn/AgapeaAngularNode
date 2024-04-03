//modulo de node para definir endpoints zona cliente con sus respectivas funciones middleware para su procesamiento
//se meten en objeto router y se exporta este objeto router:
const express = require('express');
const router = express.Router(); //<----- objeto router a exportar...
const ClienteController = require('../controllers/clienteController');

//añado endpoints y funciones middleware a ese objeto router importardas desde un objeto javascript q funciona como si fuese un "controlador":
router.post('/Login', ClienteController.login);
router.post('/Signup', ClienteController.signup);
router.get('/CheckEmail',ClienteController.checkExistingEmail);
router.get('/ActivateAccount', ClienteController.verifyEmail);
router.post('/AddAddress', ClienteController.addAddress);
router.post('/ModifyAddress', ClienteController.modifyAddress);
router.post('/UploadImage', ClienteController.uploadAccountImage);
module.exports = router;