//para inicializar firebase : https://firebase.google.com/docs/web/setup?authuser=0&hl=es#add-sdks-initialize
const { initializeApp } = require('firebase/app');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);


//------------------------ CONFIGURACION DE ACCESO : FIREBASE-AUTHENTICATION --------------------------------
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailLink, checkActionCode, applyActionCode } = require('firebase/auth');
const auth = getAuth(app); // <--- servicio de acceso a firebase-authentication

//------------------------ CONFIGURACION DE ACCESO : FIREBASE-DATABASE --------------------------------
const { getFirestore, getDocs, collection, where, query, addDoc, doc, updateDoc } = require('firebase/firestore');
const db = getFirestore(app); // <--- servicio de acceso a todas las colecciones de la DB definidas en firebase-database
const { getStorage, ref, uploadString } = require('firebase/storage');
const storage = getStorage(app);

function generaRespuesta(codigo,mensaje,errores,token,datoscliente,otrosdatos,res){
    //if(req.body.refreshtoken) token=req.body.refreshtoken;
    res.status(200).send( { codigo,mensaje, errores,token,datoscliente,otrosdatos });

}

module.exports = {
    login: async (req, res, next) => {

        //1º INICIO DE SESION EN FIREBASE CON EMAIL Y PASSWORD :
        // https://firebase.google.com/docs/auth/web/password-auth?authuser=0&hl=es#sign_in_a_user_with_an_email_address_and_password

        //...te va a generar unas credenciales (un refresh-token y un jwt y un UID)
        try {
            auth.signOut();
            let _userCredentials = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);

            //2º RECUPERAR DE LA DB DE FIREBASE-FIRESTORE DE LA COLECCION DE CLIENTES LOS DATOS DEL CLIENTE ASOCIADOS AL EMAIL DE LA CUENTA
            // Y ALMACENA EL JWT Q FIRE HA ORIGINADO POR NOSOTROS
            // https://firebase.google.com/docs/firestore/query-data/get-data?hl=es&authuser=0#get_multiple_documents_from_a_collection

            let _snapshotClient = await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', req.body.email)));

            let _clientdata = _snapshotClient.docs.shift();//removes the first array element and returns it

            if (_clientdata.exists()) {
                let clientRef = doc(db, 'clientes', _clientdata.id);
                let clientData = _clientdata.data();

                // Verificar si cuentaActiva está en false
                if (!clientData.cuenta.cuentaActiva) {
                    // Modificar cuentaActiva a true
                    await updateDoc(clientRef, {
                        cuenta: {
                            ...clientData.cuenta,
                            cuentaActiva: true
                        }
                    });
                }
            }

            res.status(200).send({
                code: 0,
                message: "Logged-in",
                error: null,
                token: await _userCredentials.user.getIdToken(),
                clientdata: _clientdata.data(),
                others: null
            });

        } catch (error) {
            console.log("ERROR EN EL LOGIN....", error);
            res.status(200).send({
                code: 1,
                message: "Login fallido",
                error: error.message,
                token: null,
                clientdata: null,
                others: null
            });
        }
    },
    relog : async (req, res, next) => {
        const usersession = auth.currentUser;

        const clientdata = await getDocs(query(collection(db, 'clientes'), 
                                                where("cuenta.email", "==", usersession.email))).docs[0].data();

        res.status(200).send({
            code : 1,
            message : 'RELOGGED OK',
            clientdata ,
            token : (await usersession.getIdToken()).toString()
        })                                        
    },
    signup: async (req, res, next) => {

        console.log("DATOS MANDADOS DESDE COMPONENTE REGISTRO : : ", req.body);

        try {
            let { cuenta, ...regdata } = req.body;

            //1º creacion de una cuenta FIREBASE dentro de Authentication basada en email y contraseña:
            // https://firebase.google.com/docs/auth/web/password-auth?authuser=0&hl=es#create_a_password-based_account

            let _userCredentials = await createUserWithEmailAndPassword(auth, cuenta.email, cuenta.password);
            console.log("RESULTADO CREACION CREDS. USER REGISTRADE : ", _userCredentials);
            //--> AQUI TODAVIA NO LA HA VALIDADO , GO TO -> AUTHENTICATION - TEMPLATES                 

            //2º MANDAMOS EMAIL DE ACTIVACION DE CUENTA : 
            await sendEmailVerification(_userCredentials.user);

            //3º ALMACENAMOS DATOS DEL CLIENTE EN COLECCION CLIENTES EN FB-DB :
            // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es&authuser=0#add_a_document
            const _docRef = await addDoc(collection(db, "clientes"), {
                nombre: regdata.nombre,
                apellidos: regdata.apellidos,
                cuenta: {
                    email: cuenta.email,
                    login: cuenta.login,
                    cuentaActiva: false,
                    imagenAvatarBASE64: null
                },
                telefono: regdata.telefono,
                direcciones: [],
                pedidos: [],
                genero: null,
                fechaNacimiento: null,
                descripcion: null
            });

            res.status(200).send({
                code: 0,
                message: "Signed-up",
                error: null,
                token: await _userCredentials.user.getIdToken(),
                clientdata: _userCredentials.user,
                others: null
            });

        } catch (error) {

            console.log("ERROR EN EL REGISTRO....");
            res.status(200).send({
                code: 1,
                message: "Registro fallido",
                error: error.message,
                token: null,
                clientdata: null,
                others: null
            });
        }
    },
    checkExistingEmail: async (req, res, next) => {

        try {

            let _email = req.query.email;
            let _resultSnap = await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', _email)));

            let _emailExists = _resultSnap.docs.shift().data;

            if (_emailExists) {
                return res.status(200).send({
                    code: 0,
                    message: "El email esta registrado en la DB",
                    error: null,
                    token: null,
                    clientdata: _emailExists,
                    others: null
                });
            } else {
                throw new Error('No existe cliente con ese email, email no registrado.');
            }

        } catch (error) {
            console.error('Error al buscar correo electrónico:', error);
            return res.status(200).send({
                code: 1,
                message: "Error al checkear email...",
                error: error.message,
                token: null,
                clientdata: null,
                others: null
            });
        }
    },
    verifyEmail: async (req, res, next) => {

        try {
            let { mod, cod, key } = req.query;

            //1º comprobar si el token de activacion de la cuenta es para verificar-email o no 
            // lo ideal seria comprobar q el token enviado pertenece al user q quiere activar la cuenta:
            let _actionCodeInfo = await checkActionCode(auth, cod); // <- obj class ActionCodeInfo => data & operation
            console.log('ActionCodeInfo en activar email user firebase : ', _actionCodeInfo);

            // 2º compruebo qué tipo de operacion es en mode : 
            if (_actionCodeInfo.operation == "VERIFY_EMAIL") {

                //en _actionCodeInfo.data <--- email, comprobar si exite en clientes...
                await applyActionCode(auth, cod);
                return res.status(200).send({
                    code: 0,
                    message: "EMAIL VERIFICADO , CUENTA ACTIVADA",
                    error: null,
                    token: null,
                    clientdata: null,
                    others: null
                });
            } else {
                throw new Error('token no valido para verificar email');
            }

        } catch (error) {
            console.error('Error al verificar el correo electrónico:', error);
            return res.status(200).send({
                code: 1,
                message: "Error al verificar email, ACTIVACION DE CUENTA FALLIDA...",
                error: error.message,
                token: null,
                clientdata: null,
                others: null
            });
        }
    },
    addAddress: async (req, res, next) => {
        try {
            console.log("NEW ADDRESS TO ADD::: ", req.body);
            let { _addr, _email } = req.body;
            let _querySnap = await clientesRef.where('email', '==', _email).get();

            if (_querySnap.empty) {
                console.log('No se encontró ningún cliente con el email proporcionado.');
                return res.status(500).send({
                    code: 1,
                    message: "ERROR ADDING NEW ADDRESS, cliente no encontrado",
                    error: error.message,
                    token: null,
                    clientdata: null,
                    others: null
                });
            }

            const _cliente = querySnapshot.docs[0];

            let _direcciones = _cliente.get('direcciones') || [];

            _direcciones.push(_addr);

            await _cliente.ref.update({
                direcciones: _direcciones
            });


            return res.status(200).send({
                code: 0,
                message: "NEW ADDRESS ADDED SUCCESSFULLY",
                error: null,
                token: null,
                clientdata: _cliente.data(),
                others: null
            });

        } catch (error) {
            return res.status(500).send({
                code: 1,
                message: "ERROR ADDING NEW ADDRESS",
                error: error.message,
                token: null,
                clientdata: null,
                others: null
            });
        }
    },
    modifyAddress: async (req, res, next) => {
        try {

        } catch (error) {

        }
    },
    uploadAccountImage: async (req, res, next) => {

        try {
            //tengo q coger la extension del fichero, en req.body.imagen:  data:image/jpeg
            let _nombrefichero = 'imagen____' + req.body.emailcliente;//  + '.' + req.body.imagen.split(';')[0].split('/')[1]   ;
            console.log('nombre del fichero a guardar en STORGE...', _nombrefichero);
            let _result = await uploadString(ref(storage, `profileimages/${_nombrefichero}`), req.body.imagen, 'data_url'); //objeto respuesta subida UploadResult         

            //podrias meter en coleccion clientes de firebase-database en prop. credenciales en prop. imagenAvatar
            //el nombre del fichero y en imagenAvatarBASE&$ el contenido de la imagen...
            let _refcliente = await getDocs(query(collection(db, 'clientes'), where('cuenta.email','==',req.body.emailcliente)));
            _refcliente.forEach(async (result) => {
                await updateDoc(result.ref, { 'cuenta.imagenAvatarBASE64': req.body.imagen });
            });

            generaRespuesta(0, 'Imagen avatar subida OK!!! al storage de firebase', '', null, null, null, res);
        } catch (error) {
            console.log('error subida imagen...', error);
            generaRespuesta(5, 'fallo a la hora de subir imagen al storage', error, null, null, null, res);

        }
    }



} 