const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const constant = require('../utils/constant');
const user = require('../models/user.model');
const config = require('../configs/auth.config')


exports.signup = async (req,res) => {

    var userStatus = req.body.userStatus;
    if(!userStatus){
        if(!req.body.userType || req.body.userType == constant.userTypes.customer){
            userStatus = constant.userStatus.approved;
        }else{
            userStatus = constant.userStatus.pending;
        }
    }

    const userObjToBeStored ={

        name:req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password,8),
        userStatus : userStatus
    }
    //inserting new user to database
    try{
            
        const userCreated = await user.create(userObjToBeStored) ;

        console.log("user created",userCreated);
        
        const userCreationResposne = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt:userCreated.updatedAt
        }
        res.status(201).send(userCreationResposne) 
    }catch(err){
        console.error("Error while creating new user",err.message);
        res.status(500).send({
            message : "some internal error while inserting new user"
        })
    }
}

// login

exports.signin = async (req,res) =>{

    try{

        //already exisit
        var users = await user.findOne({userId : req.body.userId});

    }catch(err){
        
        console.log(err.message);

    }

    if(users == null){
        return res.status(400).send({
            message : "Failed ! User id does not exist"
        })
    }
    //check if the user is approved
    if(users.userStatus != constant.userStatus.approved){
        return res.status(200).send({
            message : "Can't allow the login as the User is still not approved"
        })
    }

    //user is existing , so now we will do password matching

    const isPasswordValid = bcrypt.compareSync(req.body.password, users.password)

    if(!isPasswordValid){
        return res.status(401).send({
            message:"Invalid Password"
        })
    }

    // succesfully loged in 
    // generate token

    const token = jwt.sign({id: users.userId},config.secret,{
        expiresIn:600
    });

    res.status(200).send({
        name: users.name,
        userId: users.userId,
        email: users.email,
        userType : users.userType,
        userStatus : users.userStatus,
        accesstoken : token

    })


};