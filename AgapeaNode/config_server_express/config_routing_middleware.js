const routingCliente=require('./routingCliente');
const routingTienda=require('./routingTienda');
// const routingPedido=require('./routingPedido');
// const routingGeoApi=require('./routingGeoApi');

module.exports=function(servExpress){
    servExpress.use('/api/Cliente', routingCliente); //<---- en modulo routingCliente estan endpoints zona cliente
                                                    // en este fichero se exporta objeto de express tipo router

    servExpress.use('/api/Tienda', routingTienda); // <----- en modulo routingTienda estan endpoints zona tienda
    //                                                 // en este fichero se exporta objeto de express de tipo router
    // servExpress.use('/api/Pedido', routingPedido);
    // servExpress.use('/api/GeoApi', routingGeoApi);
}                                                  
