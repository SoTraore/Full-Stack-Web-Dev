import mongoose from "mongoose";
const { Schema } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/gantt-db');

const ganttSchema = new Schema({
    operation : String,
    dateDebut : String,
    dateFinReelle : Date,
    dateFinSouhaitee : Date,
    weekFinSouhaitee : Number,
    weekFinReelle : Number,
    weekDebut : Number,
});

let Gantt = mongoose.model('gantt', ganttSchema);

export { Gantt } ;