require('dotenv').config();
const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database")
const cloudinary=require('cloudinary');


//config
dotenv.config({path:"./config/config.env"});

//Handling uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncought Exception`);

    process.exit(1);
})

connectDatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is working on PORT no:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})


//Unhandled Promise rejection:
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Unhandles Promise rejection`);

    server.close(()=>{
        process.exit(1);
    })
})