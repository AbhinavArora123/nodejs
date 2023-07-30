const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTTOKEN();

    res.status(statusCode).cookie('token',token,{ 
        maxAge:process.env.COOKIE_EXPIRE*24  * 60 * 60 * 1000,
        httpOnly: true, 
        sameSite:process.env.NODE_ENV==="Development"?"lax":"none",
        secure:process.env.NODE_ENV==="Development"?false:true
        }).json({
        success:true,
        user,
        token
    });
}

module.exports=sendToken;