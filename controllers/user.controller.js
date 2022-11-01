const mongoose = require('mongoose');
const User = require('../models/user.model');
const objecConverter = require('../utils/objectConverter')


exports.findALLUsers  = async (req,res) =>{
    
    /**
     * Read the data from the query param
     */

     const nameReq = req.query.name;
     const userStatusReq = req.query.userStatus;
     const userTypeReq = req.query.userType;
     console.log(userTypeReq);
 
 
     const mongoQueryObj = {}
     if (nameReq && userStatusReq && userTypeReq) {
        mongoQueryObj.name = nameReq;
        mongoQueryObj.userStatus = userStatusReq;
        mongoQueryObj.userType = userTypeReq;
 
     } else if (userStatusReq && userTypeReq) {
         mongoQueryObj.userStatus = userStatusReq;
         mongoQueryObj.userType = userTypeReq;
     } else if (nameReq && userStatusReq) {
         mongoQueryObj.name = nameReq;
         mongoQueryObj.userStatus = userStatusReq;
 
     } else if (nameReq && userTypeReq) {
         mongoQueryObj.name = nameReq;
         mongoQueryObj.userType = userTypeReq;
     } else if (nameReq) {
         mongoQueryObj.name = nameReq;
     } else if (userTypeReq) {
         mongoQueryObj.userType = userTypeReq;
     } else if (userStatusReq) {
         mongoQueryObj.userStatus = userStatusReq;
     }
 
     //console.log(mongoQueryObj);

    try{
        const users = await User.find(mongoQueryObj);
        // console.log(users);
        return res.status(200).send(objecConverter.userResponse(users));
    }catch(err){
        console.log(err.message);
        return res.status(500).send({
            message : "Internal error while fetching the data "
        })
    }

}

exports.findUserById = async (req, res) => {
    const userIdReq = req.params.userId; //Reading from the request parameter

    const user = await User.find({ userId: userIdReq });

    if (user) {
        res.status(200).send(objecConverter.userResponse(user));
    } else {
        res.status(200).send({
            message: "User with id " + userIdReq + " doesn't exist"
        })
    }


}




exports.updateUser = (req, res) => {

    /**
     * One of the ways of updating
     */
    try {
        const userIdReq = req.params.userId;

        const user = User.findOneAndUpdate({
            userId: userIdReq
        }, {
            name: req.body.name,
            userStatus: req.body.userStatus,
            userType: req.body.userType
        }).exec();

        return res.status(200).send({
            message: "User record succesfully updated"
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            message: "Internal server error while updating"
        })
    }

} 