require('dotenv').config();
const express = require('express');
var serverExpress = express();

const configServer = require('./config_server_express/config_pipeline');

serverExpress.listen(3000,()=> console.log('escuchando en el puerto 3000 🧞‍♂️'));
configServer(serverExpress);