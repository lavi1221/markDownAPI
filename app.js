const express =require("express");
const bodyParser=require("body-parser");
const showdown= require("showdown");
const jwt=require("jwt-simple");
const passport=require("passport");
const localStrategy=require("passport-local").Strategy;

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

converter =new showdown.Converter();
converter.setOption("simplifiedAutoLink","true");

const ADMIN = 'admin';
const ADMIN_PASSWORD = 'abc';
const SECRET = 'secret#4456';

passport.use(new localStrategy(function(username, password, done) {
  if (username === ADMIN && password === ADMIN_PASSWORD) {
    done(null, jwt.encode({ username }, SECRET));
    return;
  }
  done(null, false);
}));

app.get("/",function(req,res){
  res.send("Hello World!");
});

app.get("/login",passport.authenticate('local',{ session: false }),
function(req,res){
  res.send("Authenticated");
});

app.post("/convert",passport.authenticate('local',{ session: false, failWithError: true }),
function(req,res,next){
   console.log(req.body);
   if(typeof req.body.content== "undefined" ||  req.body.content== null ){
     res.json(["error","No data found"]);
   }else{
     text=req.body.content;
     html=converter.makeHtml(text);
     console.log(html);
     res.send(html);
   }},
    function(err, req, res, next) {
     return res.status(401).send({ success: false, message: err })
});


app.listen(3000,function(){
  console.log("Server has started");
});
