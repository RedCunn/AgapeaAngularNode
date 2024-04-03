const { initializeApp } = require('firebase/app');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);

//------------------------ CONFIGURACION DE ACCESO : FIREBASE-DATABASE --------------------------------
const { getFirestore, getDocs, collection, where, query, addDoc, orderBy, setDoc } = require('firebase/firestore');
const db = getFirestore(app); // <--- servicio de acceso a todas las colecciones de la DB definidas en firebase-database
//--------------------------
const axios = require('axios');

async function RequestAccessTokenPaypal () {
    try {
        
        const _clientID = process.env.PAYPAL_CLIENT_ID;
        const _clientSecret = process.env.PAYPAL_CLIENT_SECRET;
        let _tobase64Auth = Buffer.from(`${_clientID}:${_clientSecret}`).toString('base64');
        /**
         * @type {Response}
         */
        let _resTokenPaypal = await axios.post(
                                                
                                                    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
                                                    'grant_type=client_credentials',
                                                    { 
                                                        headers: {
                                                            'Content-Type' : 'application/x-www-form-urlencoded',
                                                            'Authorization' : `Basic ${_tobase64Auth}`
                                                        }
                                                        
                                                    }
                                              )
        console.log("PAYPAL RESPONSE TO REQUEST ACCESS TOKEN : ", _resTokenPaypal.data);

        if(_resTokenPaypal.status === 200){
             const accessToken = _resTokenPaypal.data.access_token;
             return accessToken;
        }else{
            throw new Error('error al intentar obtener token de servicio de paypal' + _resTokenPaypal.data);
        }
    
    } catch (error) {
        console.log("ERROR AL SOLICITAR ACCESS TOKEN , ", error)
        return null;
    }


}


module.exports = {
    /**
     * @param {Object} order
     * @param {String} email
     * @param {Response} res
     */
    CreatePaypalPayment : async (order, _clientID)=>{
        try {
            /**
             * @type {JSON}
             */
            const _accessToken = await RequestAccessTokenPaypal();    
            console.log("RESP TOKEN PAYPAL : ", _accessToken)
            
            if(_accessToken !== null){

                let payorder = {
                    intent : 'CAPTURE',
                    purchase_units : [
                        {
                            items : order.elementosPedido.map(ele => {
                                return {
                                    name : ele.libroElemento.Titulo,
                                    quantity : ele.cantidadElemento.toString(),
                                    unit_amount : {currency_code : 'EUR', value : ele.libroElemento.Precio.toFixed(2).toString().replace(",", ".")}
                                }
                            }),
                            amount : {
                                currency_code : 'EUR',
                                value : order.totalPedido.toFixed(2).toString().replace(",","."),
                                breakdown : {
                                    shipping : {
                                        currency_code : 'EUR',
                                        value : order.gastosEnvio.toFixed(2).toString().replace(",","."),
                                    },
                                    item_total : {
                                        currency_code : 'EUR',
                                        value : order.subTotalPedido.toFixed(2).toString().replace(",","."),
                                    }
                                }
                            }
                        }
                    ],
                    application_context : {
                        return_url : `http://localhost:3000/api/Tienda/PaypalCallback?idcliente=${ _clientID}&idpedido=${order.idPedido}`,
                        cancel_url : `http://localhost:3000/api/Tienda/PaypalCallback?idcliente=${ _clientID}&idpedido=${order.idPedido}&Cancel=true`
                    }
                }
                
                /**
                 * @type {Response}
                 */
                const _resOrderPaypal = await axios.post( 
                                                        
                                                            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
                                                            JSON.stringify(payorder),
                                                            {
                                                                headers : {
                                                                    'Authorization' : `Bearer ${_accessToken}`,
                                                                    'Content-Type':'application/json'  
                                                                }
                                                            }                                                        
                                                    )

                console.log("RESPUESTA DE PAYPAL AL MANDAR OBJ ORDER : ", _resOrderPaypal);

                if(_resOrderPaypal.status === 201){
                    //en _respueta.data solo me interesa el ID-PAGO y prop. links q es un array de objetos { rel: ..., href: ... }
                    //el q tenga en .rel='approve'
                    
                    return {  
                        linkpaypal : _resOrderPaypal.data.links.filter(link => link.rel === 'approve')[0].href,
                        idpago : _resOrderPaypal.data.id
                    }

                    
                }else{
                    throw new Error('error al crear orden de pago en paypal...RESPONSE STATUS : ', _resOrderPaypal.status);    
                }
            }

        } catch (error) {
            console.log("ERROR AL INTENTAR CREAR ORDEN DE PAGO EN PAYPAL , ",error)
            return null;
        }
        
    },
    CompletePaypalPayment : async(orderID, url) => {
        try {
            let _accessToken = await RequestAccessTokenPaypal();
            if(_accessToken === null) throw new Error('error al obtener token de servicio paypal, no puedo finalizar pago');

            let _res = await axios.post (
                                            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
                                            {
                                                headers : {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${_accessToken}`   
                                                }
                                            }
                                        )
            console.log('RESPUESTA AL COMPLETAR EL PAGO :: ', _res);

            if(_res.data['status'] === 'APPROVED' || _res.data['status'] === 'COMPLETED'){
                return url;
            }else{
                throw new Error('error al caputrar pago por paypal y finiquitarlo...');
            }

        } catch (error) {
            console.log('error al capturar pago por paypal y finalizarlo...', error);
            return null;
        }
    }
}
