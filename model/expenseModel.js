import mongoose from 'mongoose'

const expenseModel=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true, 
    }
},{timestamps:true})

export default mongoose.model('Expense',expenseModel)