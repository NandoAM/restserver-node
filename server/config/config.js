
//====================================
// Puerto
//====================================

process.env.PORT = process.env.PORT || 3000;

//====================================
// Entorno
//====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//====================================
// Vencimiento token (30 DÍAS =>  60 segundos * 60 minutos * 24 horas * 30 días)
//====================================

process.env.CADUCIDA_TOKEN = 60 * 60 * 24 * 30; 

//====================================
// SEED de autenticación (process.env.SEED => Si se sube a heroku hay que crear una variable de entorno con la de producción)
//====================================
process.env.SEED = process.env.SEED ||  'este-es-el-seed-desarrollo';

//====================================
// Base de datos
//====================================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://127.0.0.1:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//====================================
// Google Client ID
//====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '237948012214-tullhd57rimtiga6vdftit478r5a6d5g.apps.googleusercontent.com';
