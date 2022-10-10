"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
* Imports
*/
var mongoose_1 = __importDefault(require("mongoose"));
require("../database");
var taskSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    allTasks: [{
            date: {
                type: String,
                required: true,
            },
            tasks: [{
                    title: { type: String, required: true, minlength: 3 },
                    description: { type: String },
                    hour: { type: String },
                    taskComplete: { type: Boolean, default: false }
                }]
        }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('task', taskSchema);
