/* 
* Imports
*/
import dotenv from 'dotenv';
import express  from 'express';
import cors from 'cors';

dotenv.config();

import { createTask, listAllTasks } from './app/tasks';

/* 
*   Chamando Função de rotas
*/
const routes = express();


/* 
* Definindo Configurações de cor e Passagem de dados express
*/
routes.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true, optionsSuccessStatus: 200 }));
routes.use(express.json());
routes.use(express.urlencoded({ extended: false }));


/* 
*   Criando rotas
*/
routes.get('/api/v1/list-all-tasks/:userId', listAllTasks);
routes.post('/api/v1/create-task', createTask);


/* 
*   Exportando Para server.ts
*/
export default routes;