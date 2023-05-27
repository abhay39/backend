import mongoose from 'mongoose'

const userModel=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true      
    },
    occupation:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
},{timestamps:true})

export default mongoose.model('User',userModel)
