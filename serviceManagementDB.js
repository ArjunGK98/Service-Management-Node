const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var mongo = require("mongoose");
var mongoURL = "mongodb://localhost:27017/serviceManagement";

mongo.connect(mongoURL,function(err){
     if(err){
          console.log("err "+err);
     }
});

var Schema = mongo.Schema;
var userSchema = new Schema({
     userId :{
          type : Number
     },
     userName :{
          type : String
     },
     userPassword :{
          type : String
     },
     userEmail :{
          type : String
     },
     issue :{
          type : String
     },
     description :{
          type : String
     },
     createdDate :{
          type : Date
     }
});
var vendorSchema = new Schema({
     vendorId :{
          type : Number
     },
     vendorName :{
          type : String
     },
     vendorPassword :{
          type : String
     },
     vendorEmail :{
          type : String
     }
});
var ownerSchema = new Schema({
     ownerId : {
          type : Number
     },
     ownerName :{
          type : String
     },
     ownerPassword :{
          type : String
     },
     ownerEmail :{
          type : String
     },
})

var userModel = mongo.model('user',userSchema,"userDetails");
var vendorModel = mongo.model('vendor',vendorSchema,"vendorDetails");
var ownerModel = mongo.model('owner',ownerSchema,'ownerDetails');

//rest apis for usersDetails
app.get("/user",function(req,res){
     console.log("get all user details");
     userModel.find({},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data)
          }
     });
     var randomValue = (1 + Math.random()) * 0x10000;
     var trackingId = Math.floor((34243242 * randomValue)).toString(16);
     console.log(trackingId);
});
app.get("/user/:id",function(req,res){
     console.log("get single user details");
     userModel.findOne({userId:req.params.id}, function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.post("/user/save",function(req,res){
     console.log("post user details");
     var userMod = new userModel(req.body);
     userMod.save(function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.put("/user/update",function(req,res){
     console.log("put user details");
     userModel.updateOne({userId:req.body.userId},{userName:req.body.userName,userPassword:req.body.userPassword,userEmail:req.body.userEmail,issue:req.body.issue,description:req.body.description,createdDate:req.body.createdDate},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     })
});
app.delete("/user/delete",function(req,res){
     console.log("delete user details");
     userModel.deleteOne({userId:req.body.userId},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});


//rest apis for vendorDetails
app.get("/vendor",function(req,res){
     console.log("get all vendor details");
     vendorModel.find({},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }

     });
});
app.get("/vendor/:id",function(req,res){
     console.log("get single vendor details");
     vendorModel.findOne({vendorId:req.params.id},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.post("/vendor/save",function(req,res){
     console.log("post vendor details");
     var venderMod = new vendorModel(req.body);
     venderMod.save(function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.put("/vendor/update",function(req,res){
     console.log("put vendor details");
     vendorModel.updateOne({vendorId:req.body.vendorId},{vendorName:req.body.vendorName,vendorPassword:req.body.vendorPassword,vendorEmail:req.body.vendorEmail},function(err,data){
          if(err){
               res.send(err);
          } else {
               res.send(data);
          }
     })
});
app.delete("/vendor/delete",function(req,res){
     console.log("delete vendor details");
     vendorModel.deleteOne({vendorId:req.body.vendorId},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});


//rest apis for ownerDetails
app.get("/owner",function(req,res){
     console.log("get all owner details");
     ownerModel.find({},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.get("/owner/:id",function(req,res){
     console.log("get single owner detail");
     ownerModel.findOne({ownerId:req.params.id},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.post("/owner/save",function(req,res){
     console.log("post owner details");
     var ownerMod = new ownerModel(req.body);
     ownerMod.save(function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.put("/owner/update",function(req,res){
     console.log("put owner details");
     ownerModel.updateOne({ownerId:req.body.ownerId},{ownerName:req.body.ownerName,ownerPassword:req.body.ownerPassword,ownerEmail:req.body.ownerEmail},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.delete("/owner",function(req,res){
     console.log("delete owner details");
     ownerModel.deleteOne({ownerId:req.body.ownerId},function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     })
});

//join two collections

//we use 8000 port for this restapi
app.listen(8000,function(){
     console.log("serviceManagement listnig on 8000");
})
