
module.exports = function(req, res, ok) {
	UserLogin.findOne({user:req.param('loggedUser')}).exec(function (err, login) {
		
            if (err) {
                    var response = {
                        message: sails.errorMessage(err)
                    }
                    return res.json(response);
                }

    if(login!=undefined){
        return ok();
    }
    var response={
        message:'Debe iniciar session'
    }
    res.json(response);
	});
}