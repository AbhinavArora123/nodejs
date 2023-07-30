const express=require('express');
const app=express();
// const errorMiddelware=require('../backend/middleware/error');
const cookieParser=require('cookie-parser')
const bodyParser=require('body-parser');
const fileUpload=require('express-fileupload');
const errorMiddelware=require('./middleware/error');
const cors=require('cors');



app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true,parameterLimit:1000000,limit:"500mb"}));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors({
    origin:[process.env.FRONTEND_URI],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

//routes:
const note=require('./routes/noteRoute');
const user=require('./routes/userRoute');

app.use("/api/v1",note);
app.use("/api/v1",user);

app.use(errorMiddelware);


module.exports=app;