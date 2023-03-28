var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('Public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://bharath:Signals@cluster0.ks1xbj0.mongodb.net/mydb',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

var db = mongoose.connection;
db.on('error',()=>console.log('Error in Connecting to Database'));
db.once('open',()=>console.log("connected to db"));
app.post("/sign_up",(req,res)=>{
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    console.log(username);
    var data = {
        "username" : username,
        "email": email,
        "password" : password
     }
     db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
     });
     return res.redirect('home.html')
})

app.get("/billing", (req, res)=>{
    res.redirect('payment.html')
})
app.post("/billing", (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var address = req.body.address;
    var city = req.body.city;
    var zipcode = req.body.zipcode;   
    var data1 = {
        "name" : name,
        "email": email,
        "address" : address,
        "city" : city,
        "zipcode" : zipcode }
    
        db.collection('payment').insertOne(data1,(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("Billing");
         });
     return res.redirect('carddetails.html')
})

app.get("/card", (req, res)=>{
    res.redirect('carddetails.html')
})
app.post("/card", (req, res)=>{
    var cardnumber = req.body.cardnumber;
    var expiremonth = req.body.expiremonth;
    var expireyear = req.body.expireyear;
    var ccv = req.body.ccv;   
    var data2 = {
        "cardnumber" : cardnumber,
        "expiremonth": expiremonth,
        "expireyear" : expireyear,
        "ccv" : ccv,}
db.collection('card').insertOne(data2,(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("card");
         });
         alert("PAYMENT SUCCESSFUL");
     return res.redirect('home.html')
})



app.get('/',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
        });
    return res.redirect('index.html');
    }).listen(3000)

console.log("Listening on PORT 3000");

var db = mongoose.connection;
db.on('error',()=>console.log('Error in Connecting to Database'));
db.once('open',()=>console.log("connected to db"));
app.post("/login",(req,res)=>{
    var email = req.body.email; 
    var password = req.body.password;
    console.log(email);
    db.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    var count = 0;
        for (let i =0; i<result.length; i++){
            console.log(result[i])
            
            if (email == result[i].email && password == result[i].password){
                console.log('Login Successful')
                return res.redirect('home.html')
            }
            else{
                
                console.log("Invalid");
                count+=1;
            }
            if(count==result.length){
             res.redirect('/');   
            }
        }
});
})