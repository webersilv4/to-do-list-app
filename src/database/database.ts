/*
* Imports 
*/
import mongoose from 'mongoose';


/*
* Criando e exportando Conexão 
*/
export default mongoose.connect(`${process.env.DATABASE}`);