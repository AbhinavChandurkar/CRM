
const {authJwt} = require('../middleware')
const ticketController = require('../controllers/ticket.controller')

module.exports = (app)=>{

    app.post("/crm/api/v1/tickets",[authJwt.verifyToken],ticketController.createTicket);
    
    
    app.get("/crm/api/v1/tickets",[authJwt.verifyToken],ticketController.getAllTickets);

    app.get("/crm/api/v1/tickets/:id" ,[authJwt.verifyToken], ticketController.getOneTicket );

    app.put("/crm/api/v1/tickets/:id" ,[authJwt.verifyToken], ticketController.updateTicket);
    
}