require('dotenv').config();
const http=require('http');
const express =require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');

const app=express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true});
const userschema=new mongoose.Schema({
    email:String,
    password:String
})

const secret=process.env.SECRET;
userschema.plugin(encrypt,{secret:secret,encryptedFields:['password']});



const Schema=new mongoose.model('user',userschema);


app.get("/",(req,res)=>{
    res.render('home');
})

app.get("/login",(req,res)=>{
    res.render('login');
})

app.get("/register",(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{
    const newUser=new Schema({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save((err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('secrets');
        }
    })
})

app.post('/login',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    Schema.findOne({email:username},(err,founduser)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(founduser);
            if(founduser){
                if(founduser.password===password){
                    res.render('secrets');
                }
            }
        }
    })

})

const server=http.createServer(app);
server.listen(3000,()=>{
    console.log("Server Connected");
})