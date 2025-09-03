// Handle signup and login logic 

import {createUser,getUserByEmail,saveRefreshToken} from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function generateRefreshToken(user){
    try {
        return jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    } catch (err) {
        console.error('Error generating refresh token:', err);
        return null;
    }
}

function saveCookie(res,refreshToken){
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }); 
}

export async function signup(req,res){
    const {name,email,password}= req.body;
    if(!email || !password || !name){
        return res.status(400).json({message:"Name, Email and password are required"});
    }
    try{
        const user = await getUserByEmail(email);
        if(user){
            return res.status(409).json({message:"User with this email already exists"});
        }
        const hash = await bcrypt.hash(password,10);
        const newUser = await createUser(name,email,hash);

        const refreshToken = generateRefreshToken(newUser);
        if(!refreshToken){
            return res.status(500).json({message:"Error creating refresh Token"});
        }
        await saveRefreshToken(newUser.user_id,refreshToken,new Date(Date.now()+7*24*60*60*1000));

        saveCookie(res,refreshToken);

        const {id,userName,userEmail} = newUser;

        res.status(201).json({message:"User created successfully", user:{id,userName,userEmail}});
    } catch(error){
        console.error("Error during signup:",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function login(req,res){
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"});
    }
    try{
        const user = await getUserByEmail(email);
        if(!user){
            return res.status(401).json({message:"Invalid email or password"}); // Avoid revealing which part is incorrect
        }
        const isPasswordValid = await bcrypt.compare(password,user.password_hash);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid email or password"}); 
        }
        const refreshToken = generateRefreshToken(user);
        await saveRefreshToken(user.user_id,refreshToken,new Date(Date.now()+7*24*60*60*1000));
        saveCookie(res,refreshToken);
        
        const {user_id,full_name}=user;
        res.status(200).json({message:"Login successful",id:user_id,fullName:full_name});
    } catch(error){
        console.error("Error during login:",error);
        res.status(500).json({message:"Internal server error"});
    }
}