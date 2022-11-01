// logic to transform the object 





exports.userResponse = (users) =>{

    userResponse = [];

    users.forEach(user => {
        userResponse.push({
            name: user.name,
            userId : user.userId,
            email : user.email,
            userType : user.userTypes,
            userStatus : user.userStatus
        })    
    });

    return userResponse

}


exports.ticketResponse = (ticket) =>{
    return {
        title : ticket.title,
        description : ticket.description,
        ticketPriority : ticket.ticketPriority,
        status : ticket.status,
        reporter : ticket.reporter,
        assignee : ticket.assignee,
        id : ticket._id,
        createdAt : ticket.createdAt,
        updatedAt : ticket.updatedAt
    }
} 

exports.ticketListResponse = (tickets) =>{
    ticketResult = [];
    tickets.forEach(ticket =>{
        ticketResult .push({
            title : ticket.title,
            description : ticket.description,
            ticketPriority : ticket.ticketPriority,
            status : ticket.status,
            reporter : ticket.reporter,
            assignee : ticket.assignee,
            id : ticket._id,
            createdAt : ticket.createdAt,
            updatedAt : ticket.updatedAt
        })
    })

    return ticketResult;
}