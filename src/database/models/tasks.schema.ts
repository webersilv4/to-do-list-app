/* 
* Imports
*/
import mongoose from 'mongoose';
import '../database';

const taskSchema = new mongoose.Schema({
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


export default mongoose.model('task', taskSchema);