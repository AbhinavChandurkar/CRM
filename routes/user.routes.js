const userController = require("../controllers/user.controller")
const { authJwt } = require("../middleware");

module.exports = (app) =>{

    app.get("/crm/api/v1/users/",[authJwt.verifyToken, authJwt.isAdmin],userController.findALLUsers);
    app.get("/crm/api/v1/users/:userId",[authJwt.verifyToken],userController.findUserById);
    app.put("/crm/api/v1/users/:userId", [authJwt.verifyToken,authJwt.isAdmin], userController.updateUser);



}