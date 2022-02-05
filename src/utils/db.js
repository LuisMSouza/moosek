/////////////////////// IMPORTS //////////////////////////
import { connect, connection } from 'mongoose';

/////////////////////// SOURCE CODE ///////////////////////////
export function init() {
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    connect(process.env.DB_KEY, dbOptions);
    connection.on('connected', () => {
        console.log('[DATABASE] CONNECTED');
    });
    connection.on('err', err => {
        console.log(`ERRO AO TENTAR SE CONECTAR COM A DATABASE ${err.stack}`);
    });
    connection.on('disconnected', () => {
        console.log('CONEXÃO COM A DATABBASE PERDIDA');
    });
}