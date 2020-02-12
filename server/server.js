require('./config/config');

const express = require('express');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');


const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json());

app.use( require ('./routes/usuario'));


mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useCreateIndex:  true,
  useUnifiedTopology: true
})
.catch(error => console.log(error));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto:' , process.env.PORT)
})