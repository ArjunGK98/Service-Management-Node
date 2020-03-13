const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

var path = require('path');
const logger = require('morgan');

// const fileUpload = require('express-fileupload');
const cors = require('cors');
// const JSON = require('circular-json'); 

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

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
     //Salman
     //TODO: unique name
     // userName :{
     //      type : String
     // },
     userPassword :{
          type : String
     },
     userEmail :{
          type : String
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
});
var issueSchema = new Schema({
     trackId: {
          type : String
     },
     userName:{
          type: String
     },
     issue :{
          type : String
     },
     description :{
          type : String
     },
     assignedVendorName :{
          type : String
     },
     flag :{
          type : Boolean
     },
     status :{
          type : Boolean
     },
     createdDate :{
          type : Date
     }
});

var userModel = mongo.model('user',userSchema,"userDetails");
var vendorModel = mongo.model('vendor',vendorSchema,"vendorDetails");
var ownerModel = mongo.model('owner',ownerSchema,'ownerDetails');
var issueModel  = mongo.model('issue',issueSchema,'issueDetails');

function generateUUID() {
     //randomValue = randomValue +10;
     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (value) {
          randomValue = (1 + Math.random()) * 0x10000;
          return (((value | randomValue)& (15<< value / 4))).toString(16);
     });
}
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
     bcrypt.hash(req.body.userPassword,12,function(err,hash){
          req.body.userPassword =hash;
          var userMod = new userModel(req.body);
          userMod.save(function(err,data){
               if(err){
                    res.send("err "+err);
               } else {
                    res.send(data);
               }
     });
     
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
//login api for user
app.post("/user/login",function(req,res){
     console.log("user login api");
     userModel.find({
          userName:req.body.userName
},function(err,user){
     var pass = user[0].userPassword;//JSON.stringify(user.map(a =>a.userPassword));
     //console.log("pass" +pass);
     if(err){
          console.log("user name err");
         
     } else {
          bcrypt.compare(req.body.userPassword,pass).then(function(){
               //res.redirect("/userhome");
               res.send("match");
          }).catch(function(){
               //res.redirect("/");
               res.send("not match");
          })
     }

})
//owner after assign

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
     bcrypt.hash(req.body.vendorPassword,12,function(err,hash){
          req.body.vendorPassword = hash;
          var venderMod = new vendorModel(req.body);
          venderMod.save(function(err,data){
               if(err){
                    res.send("err "+err);
               } else {
                    res.send(data);
               }
          });
     })
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
//login api for vendor
app.post("/vendor/login",function(req,res){
     console.log("vendor login api");
     vendorModel.find({vendorName:req.body.vendorName},function(err,vendor){
          var pass =vendor[0].vendorPassword;
          if(err){
               console.log("vendor err "+err);
          } else {
               bcrypt.compare(req.body.vendorPassword,pass).then(function(){
                    res.redirect("/vendorhomepage");
                    res.send("match");
               }).catch(function(){
                    res.redirect("/");
                    res.send("not match");
               });
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
     bcrypt.hash(req.body.ownerPassword,12,function(err,hash){
          req.body.ownerPassword = hash;
          var ownerMod = new ownerModel(req.body);
          ownerMod.save(function(err,data){
               if(err){
                    res.send("err "+err);
               } else {
                    res.send(data);
               }
          });
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
//login api for owner
app.post("/owner/login",function(req,res){
     console.log("login for owner");
     ownerModel.find({ownerName:req.body.ownerName},function(err,owner){
          var pass = owner[0].ownerPassword;
          if(err){
               console.log("err "+err);
          } else {
               bcrypt.compare(req.body.ownerPassword,pass).then(function(){
                    //res.redirect("/ownerHomePage");
                    res.send("match");
               }).catch(function(){
                    //res.redirect("/");
                    res.send("not match");
               })
          }
     })
});

//rest aips for issueDetails
app.post("/issue/save",function(req,res){
     console.log("issue save");
     var randomValue = generateUUID();
     var issueMod = new issueModel({
          trackId : randomValue,
          aUserName : req.body.aUserName,//userId,hardcodeid
          type :"strubf", 
          issue : req.body.issue,//tilte
          description : req.body.description,
          assignedVendorName :"Not yet assigned",
          flag : false,
          status :true,
          createdDate : new Date()
     }); 
     issueMod.save(function(err,data){
          if(err){
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
app.put("/issue/VNupdate",function(req,res){
     console.log("vendor assign by the owner");
     if(req.body.flag==false) {
          issueModel.updateOne({flag:req.body.flag},{assignedVendorName:req.body.assignedVendorName},function(err,data){
               flag = true;
               if(err){
                    res.send("err "+err);
               } else {
                    res.send(data);
               }
          });
     } else {
          res.send("vendor is already assinged by the owner :P"); 
     }
});
app.get("/issue/as/:st",function(req,res){
     console.log("list of issur");
     issueModel.find({status:req.params.st},function(err ,data){//condition only user id
          if(err){
               res.send(err);
          } else {

 //res.json({ file: "myfile" }); 
 

              res.json(data);
             //res.json({"trackId": data[0].trackId, "issue": data[0].issue})
          }
     });
});
app.get("/issue/:tid",function(req,res){
     console.log("find issue by id");
     issueModel.findOne({trackId:req.params.tid},function(err,data){
          if(err) {
               res.send("err "+err);
          } else {
               res.send(data);
          }
     });
});
//we use 8000 port for this restapi
app.listen(8000,function(){
     console.log("serviceManagement listnig on 8000");
});
