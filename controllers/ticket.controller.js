const User = require("../models/user.model");
const constants = require("../utils/constant");
const Ticket = require("../models/ticket.model");
const objectConverter = require("../utils/objectConverter");
const notificationServiceClient = require("../utils/notificationServiceClient");


/**
 * Create a ticket
 *   v1 - Any one should be able to create the ticket
 */

exports.createTicket = async (req, res) => {

    //logic to create the ticket

    const ticketObj = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description
    }

    /**
     * If any Engineer is available
     */
    try {
        const engineer = await User.findOne({
            userType: constants.userTypes.engineer,
            userStatus: constants.userStatus.approved
        });

        if (engineer) {
            ticketObj.assignee = engineer.userId;
        }

        const ticket = await Ticket.create(ticketObj);

        /**
         * Ticket is created now
         * 1. We should update the customer and engineer document
         */

        /**
         * Find out the customer
         */
        if (ticket) {
            const user = await User.findOne({
                userId: req.userId
            })
            user.ticketsCreated.push(ticket._id);
            await user.save();

            /**
             * Update the Engineer
             *
             */
            engineer.ticketsAssigned.push(ticket._id);
            await engineer.save();

            /**
            * right place to send the email to customer
            * 
            * call the notification service to send the email 
            * 
            * I need to have a client to call the external service 
            */
            notificationServiceClient(ticket._id, "Created new ticket :"+ticket._id,ticket.description, user.email+","+engineer.email,user.email); 

            return res.status(201).send(objectConverter.ticketResponse(ticket));
        }



    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            message: "Some internal error"
        })
    }

}




exports.getAllTickets = async (req, res) => {
    /**
     * I want to get the list of all the tickets
     */
    console.log("Current user : ",req.userId);

    const queryObj = {};

    if (req.query.status != undefined) {
        queryObj.status = req.query.status;
    }

    const user = await User.findOne({ userId: req.userId });
    if (user.userType == constants.userTypes.admin) {
        //Return all the tickets
        // No need to change anything in the query object
    } else if (user.userType == constants.userTypes.customer) {

        if (user.ticketsCreated == null || user.ticketsCreated.length == 0) {
            return res.status(200).send({
                message: "No tickets created by you !!!"
            })
        }

        queryObj._id = {
            $in: user.ticketsCreated // array of ticket ids
        }

    }
    else{

        queryObj._id - {
            $in : user.ticketsCreated
        };
        queryObj.assignee = req.userId



    }
    const tickets = await Ticket.find(queryObj);

    res.status(200).send(objectConverter.ticketListResponse(tickets))

}

/**
 * contoller to fetch ticket based on id
 */
exports.getOneTicket = async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id
    });

    res.status(200).send(objectConverter.ticketResponse(ticket));
}

/**
 * Write the controller to update the ticket
 * 
 * TODO :
 * Move all the validations to the middleware layer
 */

exports.updateTicket = async (req, res) => {

    // Check if the ticket exists
    const ticket = await Ticket.findOne({
        _id: req.params.id
    });

    if (ticket == null) {
        return res.status(200).send({
            message: "Ticket doesn't exist"
        })
    }

    /**
     * Only the ticket request be allowed to update the ticket
     */
    const user = User.findOne({
        userId: req.userId
    });

    console.log(ticket.assignee);

    if ((user.ticketsCreated == undefined || !user.ticketsCreated.includes(req.params.id)) && !user.userType == constants.userTypes.admin && !ticket.assignee == req.userId)
    {
        return res.status(403).send({
            message: "Only owner of the ticket is allowed to update"
        })
    }

    // Update the attributes of the saved ticket

    ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
    ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
    ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
    ticket.status = req.body.status != undefined ? req.body.status : ticket.status;


    //Ability to re-assign the ticket
    if(user.userType== constants.userTypes.admin){
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee :ticket.assignee ;
    }


    // Saved the changed ticket

    const updatedTicket = await ticket.save();

    // Return the updated ticket

    return res.status(200).send(objectConverter.ticketResponse(updatedTicket));
}