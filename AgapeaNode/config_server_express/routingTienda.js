const express = require("express");
const router = express.Router(); //<----- objeto router a exportar...
const Tiendacontroller = require('../controllers/tiendaController');

router.get('/RetrieveCategories', Tiendacontroller.RetrieveCategories);
router.get('/RetrieveBooksByCategory', Tiendacontroller.RetrieveBooksByCategory);
router.get('/RetrieveSingleBookByISBN', Tiendacontroller.RetrieveSingleBookByISBN);
router.get('/RetrieveProvincias',Tiendacontroller.RetrieveProvincias);
router.get('/RetrieveMunicipios',Tiendacontroller.RetrieveMunicipios);
router.post('/CompleteOrder', Tiendacontroller.CompleteOrder);
router.get('/PaypalCallback', Tiendacontroller.paypalCallback);
module.exports = router;