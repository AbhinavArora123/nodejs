//Callback Function:
const Note=require('../models/noteModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');


exports.createNote=catchAsyncErrors(async (req,res,next)=>{
    const {name,noteData}=req.body;

    const note=await Note.create({name,noteData,user:req.user});

    res.status(201).json({
        success:true,
        messgae:"Note Created"
    })
});

exports.getAllNotes=catchAsyncErrors(async (req,res,next)=>{
    const userid= await req.user._id;

    const apiFeature=new ApiFeatures(Note.find(),req.query).search().filter();
    // const notes=await apiFeature.query;
    const notes=await Note.find({user:userid});
    res.status(200).json({
        success:true,
        notes
    })   
})

exports.updateNote=catchAsyncErrors(async (req,res,next)=>{
    let note=await Note.findById(req.params.id);

    
    if(!note){
        return next(new ErrorHandler("Note not found",404));
    }
    note.isCompleted=!note.isCompleted;
    await note.save();
    note=await Note.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        note
    })
})

exports.deleteNote=catchAsyncErrors(async (req,res,next)=>{
    const note=await Note.findById(req.params.id);
    if(!note){
        return next(new ErrorHandler("Note not found",404));
    }
    await note.deleteOne();
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
});

exports.noteDetails=catchAsyncErrors(async (req,res,next)=>{
    const note=await Note.findById(req.params.id);
    if(!note){
        return next(new ErrorHandler("Note not found",404));
    }
    res.status(200).json({
        success:true,
        note
    })
})