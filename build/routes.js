"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
* Imports
*/
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
var tasks_1 = require("./app/tasks");
/*
*   Chamando Função de rotas
*/
var routes = express_1.default();
/*
* Definindo Configurações de cor e Passagem de dados express
*/
routes.use(cors_1.default({ origin: process.env.CORS_ORIGIN, credentials: true, optionsSuccessStatus: 200 }));
routes.use(express_1.default.json());
routes.use(express_1.default.urlencoded({ extended: false }));
/*
*   Criando rotas
*/
routes.get('/api/v1/list-all-tasks/:userId', tasks_1.listAllTasks);
routes.post('/api/v1/create-task', tasks_1.createTask);
routes.delete('/api/v1/delete-one-task', tasks_1.deleteOneTask);
routes.put('/api/v1/complete-one-task', tasks_1.completeOneTask);
/*
*   Exportando Para server.ts
*/
exports.default = routes;
