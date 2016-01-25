// Breja.js
var mongoose = require('mongoose');
 
// Cria um novo Schema com os campos que iremos utilizar no model Breja
var brejaSchema = new mongoose.Schema({
  loja: String,
  produto: String,
  preco: {type: Number, default: 0},
});
 
// create the model for users and expose it to our app
module.exports = mongoose.model('Breja', brejaSchema);
