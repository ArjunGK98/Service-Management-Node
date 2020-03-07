const express = require('express')
const bodyParser= require('body-parser')
const app = express()
var client = require('mongodb').MongoClient; 
var mongo = require("mongoose");
var url = 'mongodb://localhost:27017/';
var db1;
    var mongodb12 = 'mongodb://localhost:27017/demo';
    mongo.connect(mongodb12,{useNewUrlParser:true});
    var db = mongo.connection;
    var Schema = mongo.Schema;

    
    
var UsersSchema = new Schema({
    name :{
            type : String
        },
    bio :{
        type:String
    },
    
})
var model= mongo.model('user',UsersSchema,'userss');
app.post("/api/saveUser", function (req, res) {
    console.log("post");
        console.log('collection name ' + mongo.connection.name + '...');
        const data = 
          { name: 'Salmon', bio: 'J.K. salmon the raising star' };
      
       
          var mod = new model(data);
          mod.save(function (err,data){
              if(err){
                  res.send(err);
              }else {
                  res.send(data +"Record has been inserted");
              }
          });
        
        
    })

    app.delete("/api/deleteUser", function (req, res) {
        console.log("remove");
     //   model.remove({ _id: req.body.id }, function (err) {
         model.deleteOne({name:"Salmon"},function(err){
            if (err) {
                res.send(err);
            }
            else {
                res.send({ data: "Record has been Deleted..!!" });
            }
        });
    })
    app.put("/api/updateUser", function (req, res) {
    //model.findByIdAndUpdate(req.body.id, { uname: req.body.uname, cname: req.body.cname, content: req.body.content },
          console.log("update");
    model.updateOne({name:"Salmon"},{bio:"killing sprey"},
    function (err, data) {
               if (err) {
                   res.send(err);
               }
               else {
                res.send({ data: "Record has been Updated..!!" });
                }
            });
    
    })

    app.get("/api/getUser", function (req, res) {
        console.log("get");
        model.find({}, function (err, data) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(data);
            }
        });
    })
    app.listen(3000, function() {
         console.log('listening on 3000')
       })

