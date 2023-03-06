require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = mongoose.Schema({
    email: String,
    password: String
});



const User = mongoose.model('User', userSchema);

app.get('/', function(req, res){
    res.render('home');
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
        newUser.save().then((err)=>{
            res.render('secrets');
        });
    });
    
})

app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((found)=>{
        if(found){
            bcrypt.compare(password, found.password, function(err, result) {
                if(result){
                res.render('secrets');
                }
            });
        } else{
            console.log("Not found");
        }
    })
})

app.listen(3000, function(){
    console.log("Server started at port 3000");
})