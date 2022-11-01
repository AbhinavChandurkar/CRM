const express = require('express');
const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const app  = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect(dbConfig.DB_URL, ()=>{
    console.log("MongoDB started");
    init();
})

async function init() {

    var user = await User.findOne({ userId: "admin" });

    if (user) {
        return;
    } else {

        //Create the admin user

        const user = await User.create({
            name: "Abhinav",
            userId: "admin",
            email: "email@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("admin", 8)
        });
        console.log("admin user is created");

    }
}

require("./routes/auth.route")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);



app.listen(serverConfig.PORT,()=>{
    console.log("Application is started on:",serverConfig.PORT);
})