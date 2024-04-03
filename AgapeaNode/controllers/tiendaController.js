//para inicializar firebase : https://firebase.google.com/docs/web/setup?authuser=0&hl=es#add-sdks-initialize
const { initializeApp } = require('firebase/app');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);

//------------------------ CONFIGURACION DE ACCESO : FIREBASE-AUTHENTICATION --------------------------------
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailLink, checkActionCode, applyActionCode } = require('firebase/auth');
const auth = getAuth(app); // <--- servicio de acceso a firebase-authentication

//------------------------ CONFIGURACION DE ACCESO : FIREBASE-DATABASE --------------------------------
const { getFirestore, getDocs, collection, where, query, addDoc, orderBy, arrayUnion, or, setDoc, doc } = require('firebase/firestore');
const db = getFirestore(app); // <--- servicio de acceso a todas las colecciones de la DB definidas en firebase-database
//--------------------------
const axios = require('axios');
const paypalservice = require('../services/paypalservice');
const { v4: uuidv4 } = require('uuid');

// Genera un UUID v4 aleatorio
const uuid = uuidv4();

module.exports = {

    RetrieveCategories : async (req, res , next) =>{
        try {
            
            let _catid = req.query.catid;
            console.log("CATID RECIBIDO : ",_catid)
            let _categories = []
            var _pattern =
            _catid === "root"
              ? new RegExp("^[0-9]{1,}$")
              : new RegExp("^" + _catid + "-[0,9]{1,}$");

              let _catSnaps = await getDocs(collection(db,'categorias'));
                
              _catSnaps.forEach((doc)=>{
                    _categories.push(doc.data());
              });
              return res.status(200).send(_categories.filter(cat => _pattern.test(cat.IdCategoria)).sort((a,b)=>parseInt(a.IdCategoria) < parseInt(b.IdCategoria) ? -1 : 1 ));

        } catch (error) {
            console.log('ERROR AL RECUPERAR CATEGORIAS ',error)
            return res.status(500).send([]);
        }
    },
    RetrieveBooksByCategory : async (req,res,next) =>{
        try {
            let _catid = req.query.catid;
            console.log("CATID RECIBIDO : ",_catid)
            let _books = [{}];
            
            const _q = query(
                collection(db, "libros")
            );
            const _querySnapshot = await getDocs(_q);
            _querySnapshot.forEach((doc) => {
            _books.push(doc.data());
            });
            const _pattern=
            _catid==='padres' 
            ?  new RegExp("^\\d{1,}$") 
            :  new RegExp("^" + _catid + "-\\d{1,}$");

            let _filteredBooks = _books.filter((book) => {
            return _pattern.test(book.IdCategoria);
            });
        
            return res.status(200).send(_filteredBooks);

        } catch (error) {
            console.log('ERROR AL RECUPERAR LIBROS POR CATEGORIA ',error)
            return res.status(500).send([]);
        }
    },
    RetrieveSingleBookByISBN : async (req,res,next) =>{
        try {
            let _isbn = req.query.isbn;
            let _resultSnap = db.collection('libros').where('ISBN13','==',_isbn);
            let book = _resultSnap.docs.shift().data;
            
            return res.status(200).send(book);
        } catch (error) {
            console.log('ERROR AL RECUPERAR LIBRO POR ISBN13 ',error)
            return res.status(500).send([]);
        }
    },
    RetrieveProvincias : async(req, res, next) =>{
        try {
            let _resp = await axios.get(`https://apiv1.geoapi.es/provincias?type=JSON&key=${process.env.GEOAPI_KEY}&sandbox=0`);
            let provs=_resp.data.data;
            // let _snapProvs = await getDocs(collection(db,'provincias'),orderBy('PRO'));            
            // let provs = [];

            // _snapProvs.forEach(snapprov => provs.push(snapprov.data()));
            res.status(200).send(provs);

        } catch (error) {
            console.log('error al recuperar provincias...',error);
            res.status(500).send([]);       
        }
    },
    RetrieveMunicipios : async(req, res, next) =>{
        try {
            let _codpro=req.query.codpro;
            let _resp=await axios.get(`https://apiv1.geoapi.es/municipios?CPRO=${_codpro}&type=JSON&key=${process.env.GEOAPI_KEY}&sandbox=0`);
            let munis=_resp.data.data;
            // let _snapMunis=await getDocs(collection(db,'municipios'),orderBy('DMUN50'),where('CPRO','==',_codpro));

            // let munis = [];
            // _snapMunis.forEach(snapmunis => munis.push(snapmunis.data()));
            res.status(200).send(munis);

        } catch (error) {
            console.log('error al recuperar municipios...',error);
            res.status(500).send([]);   
        }
    },
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    CompleteOrder : async (req, res, next)=>{
        try {
            let {order, email, sessiontoken} = req.body;
            
            let _snapshotClient = await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', email)));
            let _clientdata = _snapshotClient.docs.shift();//removes the first array element and returns it
            
            if(order.datosPedido.metodoPago == 'paypal'){
                let {linkpaypal, idpago}  = await  paypalservice.CreatePaypalPayment(order, _clientdata.id);
                console.log('RESPUESTA DE PAYPALSERVICE al crear orden de pago : ', linkpaypal);

                if(linkpaypal){

                    console.log("ORDER OBJ: ", order.datosPedido.direccionEnvio.calle)
                    let idpedido = order.idPedido;

                    await setDoc(doc(db, "pagospaypal", idpedido), {
                        idcliente : _clientdata.id,
                        idpago : idpago,
                        idpedido 
                    })


                    
                    let _newOrder = {
                        idPedido : order.idPedido,
                        idCliente : _clientdata.id,
                        fechaRealizacion : new Date(),
                        estado : "PENDIENTE DE PAGO",
                        elementosPedido : order.elementosPedido.map(ele => {
                                                    return {
                                                        libroElemento : {
                                                            Autores: ele.Autores,
                                                                        Dimensiones : ele.Dimensiones,
                                                                        Edicion : ele.Edicion,
                                                                        Editorial : ele.Editorial,
                                                                        ISBN13: ele.ISBN13,
                                                                        ISBN10: ele.ISBN10,
                                                                        Precio : ele.Precio,
                                                                        Titulo : ele.Titulo
                                                            },
                                                        cantidadElemento : ele.cantidadElemento
                                                    }
                                        }),
                        subTotal : order.subTotalPedido,
                        gastosEnvio : order.gastosEnvio,
                        total : order.totalPedido,
                        datosPedido : {
                            
                                        direccionEnvio : {
                                            idDireccion : order.datosPedido.idDireccion,
                                            calle : order.datosPedido.direccionEnvio.calle,
                                            cp : order.datosPedido.direccionEnvio.cp,
                                            pais : order.datosPedido.direccionEnvio.pais ,
                                            provincia : {
                                                CCOM: order.datosPedido.direccionEnvio.provincia.CCOM,
                                                CPRO: order.datosPedido.direccionEnvio.provincia.CPRO,
                                                PRO: order.datosPedido.direccionEnvio.provincia.PRO
                                            },
                                            municipio : {
                                                CMUM: order.datosPedido.direccionEnvio.municipio.CMUM,
                                                CPRO: order.datosPedido.direccionEnvio.municipio.CPRO,
                                                CUN: order.datosPedido.direccionEnvio.municipio.CUN,
                                                DMUN50: order.datosPedido.direccionEnvio.municipio.DMUN50
                                            }
                                        },
                                        nombreEnvio: order.datosPedido.nombreEnvio,
                                        apellidosEnvio: order.datosPedido.apellidosEnvio,
                                        emailEnvio: order.datosPedido.emailEnvio,
                                        telefonoEnvio: order.datosPedido.telefonoEnvio,
                                        otrosDatos: order.datosPedido.otrosDatos,
                                        tipoFactura : order.datosPedido.tipoFactura,
                                        titular : order.datosPedido.titular,
                                        docIdentificacion: order.datosPedido.docIdentificacion,
                                        direccionFactura : {
                                            idDireccion : uuid,
                                            calle : order.datosPedido.direccionFactura.calle || '',
                                            cp : order.datosPedido.direccionFactura.cp || 0,
                                            pais : order.datosPedido.direccionFactura.pais || '',
                                            provincia : {
                                                CCOM: order.datosPedido.direccionFactura.provincia.CCOM || '',
                                                CPRO: order.datosPedido.direccionFactura.provincia.CPRO || '',
                                                PRO: order.datosPedido.direccionFactura.provincia.PRO || ''
                                            },
                                            municipio : {
                                                CMUM: order.datosPedido.direccionFactura.municipio.CMUM || '',
                                                CPRO: order.datosPedido.direccionFactura.municipio.CPRO || '',
                                                CUN: order.datosPedido.direccionFactura.municipio.CUN || '',
                                                DMUN50: order.datosPedido.direccionFactura.municipio.DMUN50 || ''
                                            }
                                        },
                                        metodoPago : order.datosPedido.metodoPago
                        }
                    }

                    await setDoc(doc(db, 'pedidos', idPedido), _newOrder);
                    await updateDoc(doc(db,'clientes', _clientdata.id), {pedidos : arrayUnion(order.idPedido)});

                    res.status(200).send({
                        code : 0,
                        error : null,
                        message : 'PEDIDO CREADO',
                        token : sessiontoken,
                        clientdata : _clientdata.data(),
                        other: linkpaypal
                     });
                }else{
                    throw new Error('error al generar el pago por PAYPAL');
                } 


            }else{

                
            }

        } catch (error) {
            
            console.log('error al finalizar pedido...', error);
            
            res.status(403).send(
                {
                    code: 1,
                    message: "ERROR AL FINALIZAR PEDIDO CON PAYPAL",
                    error: error.message,
                    token: null,
                    clientdata: null,
                    others: null
                }
            )
        }
    },

    paypalCallback : async (req, res, next) =>{
        console.log('parametros recibidos en la url por parte de paypal cuando cliente acepta el pago del pedido...', req.query);
        let { idcliente, idpedido, Cancel }=req.query;
        
        let _pagopaypal = await getDocs(query(collection(db,'pagospaypal'),
                                            where("idpedido","==", idpedido))).docs[0].data();

        if(_pagopaypal.exists()){
            let _idpago = _pagopaypal.idpago;
            const url = `http://localhost:4200/Pedido/PedidoFinalizado`
            res.redirect(await paypalservice.CompletePaypalPayment(_idpago, url))

        }
        

    }
    
}

