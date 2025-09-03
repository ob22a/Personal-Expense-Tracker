import jwt from "jsonwebtoken";
import {generateAccessToken} from '../utils/accessToken.js';
import { getRefreshToken } from "../models/userModel.js";

const generateToken = (req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({message:"Refresh token not provided"});
    }
    jwt.verify(refreshToken,process.env.JWT_SECRET,async (err,user)=>{
        if(err){
            return res.status(403).json({message:"Invalid refresh token"});
        }
        const storedToken = await getRefreshToken(user.id);
        if(!storedToken || storedToken !== refreshToken){
            console.error("Refresh Token cookie",refreshToken,"\nRefresh Token DB",storedToken);
            return res.status(403).json({message:"Refresh token is invalid. Please login again."});
        }
        const accessToken = generateAccessToken({id:user.id,email:user.email});
        res.status(200).json({accessToken});
    });
}

export default generateToken;