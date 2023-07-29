import mongoose from "mongoose";
const { Schema } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/gantt-db');

const ganttSchema = new Schema({
    username : String,
    gantt_id : String,
    data : [{
        operation : String,
        dateDebut : String,
        dateFinReelle : Date,
        dateFinSouhaitee : Date,
        weekFinSouhaitee : Number,
        weekFinReelle : Number,
        weekDebut : Number,
    }]
});

const usersSchema = new Schema({
    email : String,
    username : String,
    password : String,
    country : String,
});

let Gantt = mongoose.model('gantt', ganttSchema);
let Users = mongoose.model('users', usersSchema);

export { Gantt, Users } ;