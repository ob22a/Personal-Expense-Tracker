import jwt from 'jsonwebtoken';
export function pageMiddleware(req,res,next){
    const token = req.cookies.refreshToken;
    if(!token){
        console.error("Refresh Token is not found");
        return res.redirect('/login');
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch(err){
        console.error("Error in page middleware: ",err);
        return res.status(500).json({message:"Server Error"});
    }
}