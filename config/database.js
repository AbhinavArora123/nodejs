const mongoose=require('mongoose');

const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'})

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URL).then((data)=>{
        console.log(`mongodb connected with server : ${data.connection.host}`);
    })
}

module.exports=connectDatabase;

// "mongodb+srv://makenotes:mtrenchpass@cluster0.aiyr8cl.mongodb.net/notes?retryWrites=true&w=majority"