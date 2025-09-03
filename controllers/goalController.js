import {getGoals,createGoal,deleteGoal,updateGoal} from '../models/goalModel.js';

export const userGoals = async (req,res)=>{
    try{
        const userId = req.user.id;
        const goals = await getGoals(userId);
        res.status(200).json({goals});
    } catch(err){
        console.error("Error fetching goals:", err);
        res.status(500).json({error:"Internal server error"});
    }
}

export const deleteUserGoal = async (req,res)=>{
    try{
        const goalId = req.params.id;
        const deletedGoal = await deleteGoal(goalId);
        if(deletedGoal){
            res.status(200).json({message:"Goal deleted successfully",goal:deletedGoal});
        } else{
            res.status(404).json({error:"Goal not found"});
        }
    } catch(err){
        res.status(500).json({error:"Internal server error"});
    }
}

export const createUserGoal = async (req,res)=>{
    try{
        const ownerId = req.user.id;
        const {name,totalAmount,freq,goalDeadline} = req.body;
        const newGoal = await createGoal(ownerId,name,totalAmount,freq,goalDeadline);
        res.status(201).json({message:"Goal created successfully",goal:newGoal});
    } catch(err){
        res.status(500).json({error:"Internal server error"});
    }
}

export const updateUserGoal = async (req,res)=>{
    try{
        const goalId = req.params.id;
        const {name,totalAmount,freq,goalDeadline} = req.body;
        const updatedGoal = await updateGoal(goalId,name,totalAmount,freq,goalDeadline);
        if(updatedGoal){
            res.status(200).json({message:"Goal updated successfully",goal:updatedGoal});
        } else{
            res.status(404).json({error:"Goal not found"});
        }
    } catch(err){
        res.status(500).json({error:"Internal server error"});
    }
}