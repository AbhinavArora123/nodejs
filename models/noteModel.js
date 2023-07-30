const mongoose=require('mongoose');

const noteSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name of note"]
    },
    noteData:{
        type:String,
        required:[true,"Please enter the note"]
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model('Note',noteSchema);