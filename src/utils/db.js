/////////////////////// IMPORTS //////////////////////////
const mongoose = require('mongoose');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
        };

        mongoose.connect(process.env.DB_KEY, dbOptions);
        mongoose.connection.on('connected', () => {
            console.log('[DATABASE] CONECTADA')
        });
        mongoose.connection.on('err', err => {
            console.log(`ERRO AO TENTAR SE CONECTAR COM A DATABASE ${err.stack}`)
        });
        mongoose.connection.on('disconnected', () => {
            console.log('CONEXÃO COM A DATABBASE PERDIDA')
        });
    }
}