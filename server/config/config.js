
//====================================
// Puerto
//====================================

process.env.PORT = process.env.PORT || 3000;

//====================================
// Entorno
//====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//====================================
// Base de datos
//====================================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://127.0.0.1:27017/cafe'
}else{
    urlDB = 'mongodb+srv://nandoam:70C7QImEmrV9r6Dm@cluster0-7dhxi.mongodb.net/cafe?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true'
}

process.env.URLDB = urlDB;