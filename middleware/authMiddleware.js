import jwt from 'jsonwebtoken';
function authMiddleware(req,res,next){
    //console.log(req.headers);
    const authHeaders = req.headers['authorization'];
    if(!authHeaders || !authHeaders.startsWith('Bearer ')) return res.status(401).json({message:"User is not authorized. No Authorization header found"});
    const token = authHeaders.split(' ')[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err) throw err;
            req.user=decoded;
            next();
        });
        /*
            An alternative to this is not using the callback function in jwt.verify and instead using the decoded value directly like below:
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded;
            next();
        */
    } catch(err){
        return res.status(401).json({message:"Invalid or expired Token"});
    }
}

export {authMiddleware};