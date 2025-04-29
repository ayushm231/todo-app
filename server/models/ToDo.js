import mongoose from 'mongoose';
const todoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    tags: [String],
    priority: {
        type: String, 
        enum: ['High', 'Medium', 'Low'],
        default: 'Low'
    },
    notes: [{
        content: String,
        createdAt: {
            type: Date, 
            default: Date.now
        }
    }],
    mentionedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }

}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema)
export default Todo;