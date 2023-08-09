import mongoose from "mongoose";
const { Schema } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/gantt-db');

const usersSchema = new Schema({
    email : String,
    username : String,
    password : String,
    country : String,
});

const messageSchema = new Schema({
    message : String,
    email : String,
    name : String,
    subject : String
});

const ganttSchema = new Schema({
    user : usersSchema,
    version : Date,
    data : [{
        operation : String,
        dateDebut : String,
        dateFinReelle : String,
        dateFinSouhaitee : String,
        weekFinSouhaitee : Number,
        weekFinReelle : Number,
        weekDebut : Number,
    }]
});

let Users = mongoose.model('users', usersSchema);
let Gantt = mongoose.model('gantt', ganttSchema);
let Messages = mongoose.model('messages', messageSchema);

export { Gantt, Users, Messages } ;