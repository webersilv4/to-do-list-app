"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOneTask = exports.deleteOneTask = exports.listAllTasks = exports.createTask = void 0;
var tasks_schema_1 = __importDefault(require("../../database/models/tasks.schema"));
/*
* Crinado Uma Nova Tarefa
*/
var createTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, title, description, hour, date;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.body.userId;
                _a = req.body.allTasks[0].tasks[0], title = _a.title, description = _a.description, hour = _a.hour;
                date = req.body.allTasks[0].date;
                return [4 /*yield*/, tasks_schema_1.default.findOne({ userId: userId })
                        .then(function (response) {
                        // Verifica Se Existe ao menos uma tarefa
                        if (response === null)
                            tasks_schema_1.default.create(req.body)
                                .then(function () { return res.json({ success: 'Tarefa criada com sucesso' }); })
                                .catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente' }); });
                        else
                            //Verificando se existe uma tarefa com essa data, Caso n??o exista ele cria uma nova tarefa
                            tasks_schema_1.default.findOne({ userId: userId, 'allTasks.date': date })
                                .then(function (response) {
                                if (response !== null)
                                    response === null || response === void 0 ? void 0 : response.allTasks.forEach(function (element) {
                                        var id = element.id; // Pegando Id da data expecifica
                                        if (element.date === date)
                                            tasks_schema_1.default.updateOne({ userId: userId, 'allTasks._id': id }, {
                                                $push: { 'allTasks.$.tasks': {
                                                        title: title,
                                                        description: description,
                                                        hour: hour
                                                    } }
                                            })
                                                .then(function () { return res.json({ success: 'Tarefa criada com sucesso' }); })
                                                .catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente' }); });
                                    });
                                else
                                    tasks_schema_1.default.updateOne({ userId: userId }, { $push: { allTasks: req.body.allTasks } })
                                        .then(function () { return res.json({ success: 'Tarefa criada com sucesso 2' }); })
                                        .catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente' }); });
                            }).catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente' }); });
                    }).catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente' }); })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createTask = createTask;
/*
* Listando Todas Tarefas
*/
var listAllTasks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                return [4 /*yield*/, tasks_schema_1.default.aggregate([
                        { $match: { userId: userId } }, { $unwind: '$allTasks' },
                        { $sort: { 'allTasks.date': 1 } },
                        { $group: { _id: '$_id',
                                allTasks: { $push: '$allTasks' } } }
                    ])
                        .then(function (response) { return res.json(response); })
                        .catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente 3' }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.listAllTasks = listAllTasks;
/*
* Deletando Tarefa Expecifica
*/
var deleteOneTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, dateId, taskId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, dateId = _a.dateId, taskId = _a.taskId;
                return [4 /*yield*/, tasks_schema_1.default.updateOne({ userId: userId, 'allTasks._id': dateId }, {
                        $pull: { 'allTasks.$.tasks': { _id: taskId } }
                    })
                        .then(function () { return res.json({ success: 'Item deletado com sucesso' }); })
                        .catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente' }); })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteOneTask = deleteOneTask;
/*
* Deletando Tarefa Expecifica
*/
var completeOneTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, taskId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body.data, userId = _a.userId, taskId = _a.taskId;
                return [4 /*yield*/, tasks_schema_1.default.updateOne({ userId: userId, 'allTasks.tasks._id': taskId }, {
                        $set: { 'allTasks.$.tasks.$[id].taskComplete': true },
                    }, { arrayFilters: [{ 'id._id': taskId }] })
                        .then(function () { return res.json({ success: 'Item alterado com sucesso' }); })
                        .catch(function () { return res.status(400).json({ error: 'Algo deu errado tente novamente' }); })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.completeOneTask = completeOneTask;
