const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose');
require('dotenv').config();


const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

mongoose.connect(process.env.MONGO_URI)
   .then(()=>console.log( `Connected to database`))
   .catch((err)=>console.log(`Error connecting to database`,err));

   const userSchema= new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

const User = mongoose.model('User', userSchema);


app.post('/api/users',(req,res)=>{
  const{name,email,password} = req.body;

  if(!name|| !email || !age ||!password){
    return res.status(400).json({message: "Validation error: Missing required fields."});
  }


  const newUser = new User({
    name,
    email,
    password, 
  });
  
  newUser.save()
  .then(user=>{
    res.status(201).json({message: "User created successfully",user})
  })
  .catch(err=>{
    res.status(400).json({message:"Error saving user to database",err })
  });

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
