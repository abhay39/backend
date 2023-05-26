import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './model/userModel.js';
import Income from './model/incomeModel.js';
import Expense from './model/expenseModel.js';
import cookieParser  from 'cookie-parser';


const app=express()
dotenv.config()
const PORT =process.env.PORT || 8000;
app.use(express.json({limit:'50mb'}))
app.use(cors())
app.use(cookieParser())



const connect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('connected to mongo')
    }catch(err){
        console.log(err.message)
    }
}

app.get("/",(req,res)=>{
  res.send("Welcome to Expense Tracker")
})
app.post("/create",async(req,res)=>{
    const {name,image,mobile,occupation,password,email}=req.body
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({name,email,password:hashedPassword,image,mobile,occupation})

    try{
        const savedUser = await newUser.save()
        res.status(200).send("Account Created Successfully")  
    }catch(err){
        res.json(err.message)
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json("User not found");
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json("Invalid credentials");
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
        expiresIn: "720h",
      });  
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json(err.message);
    }
  });
  


app.post("/cccc",async(req,res,next)=>{
  const data=req.body;
  const token = data.token;
  if(!token){
    return res.json("No Token Found");
  }
  const decode=jwt.verify(token,process.env.JWT_SEC);
  if(!decode){
    return res.json("Invalid Token");
  }
  const user = await User.findOne({_id:decode._id});
  if(!user){
    return res.json("User not found");
  }
  res.json(user);
})

app.post("/addIncome",async(req,res)=>{
  const data=req.body;
  const user=await User.findOne({email:data.email});

  if(!user){
    return res.json("User not found");
  }
  const newIncome=new Income(data)
  try{
    await newIncome.save();
    res.status(200).json(newIncome);
  }catch(err){
    res.json(err.message);
  }
})

app.post("/addExpense",async(req,res)=>{
  const data=req.body;
  const user=await User.findOne({email:data.email});

  if(!user){
    return res.json("User not found");
  }
  const newExpense=new Expense(data)
  try{
    await newExpense.save();
    res.status(200).json(newExpense);
  }catch(err){
    res.json(err.message);
  }
})

app.post("/getIncome",async(req,res)=>{
  const {emailofUser}=req.body;
  const user=await Income.find({email:emailofUser});
  if(!user){
    return res.json("User not found");
  }
  res.json(user);
  // console.log(user);
})

app.post("/getExpense",async(req,res)=>{
  const {emailofUser}=req.body;
  const user=await Expense.find({email:emailofUser});
  if(!user){
    return res.json("User not found");
  }
  res.json(user);
  // console.log(user);
})

app.post("/deleteExpense",async(req,res)=>{
  const {id}=req.body;
  const user=await Expense.findById(id);
  if(!user){
    return res.json("User not found");
  }
  await user.deleteOne();
  res.json("Successfully Deleted the expense.");
})

app.post("/deleteIncome",async(req,res)=>{
  const {id}=req.body;
  const user=await Income.findById(id);
  if(!user){
    return res.json("User not found");
  }
  await user.deleteOne();
  res.json("Successfully Deleted the income.");
})

app.post("/updateIncome",async(req,res)=>{
  const {id,name,amount,email}=req.body;
  const update=await Income.findByIdAndUpdate(id,{
      $set:{
          name:name,
          amount:amount,
          email:email,
      }
  })
  if(!update){
    return res.json("Income not found");
  }
  res.status(200).json("Successfully Updated the income.");
})

app.post("/updateExpense",async(req,res)=>{
  const {id,name,amount,email}=req.body;
  const update=await Expense.findByIdAndUpdate(id,{
      $set:{
          name:name,
          amount:amount,
          email:email,
      }
  })
  if(!update){
    return res.json("Expense not found");
  }
  res.status(200).json("Successfully Updated the Expense.");
})

app.listen(PORT,()=>{
    connect()
    console.log(`Server is running on port ${PORT}`)
})