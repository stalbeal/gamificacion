module.exports = function(req, res, ok, next) {

    Admin.find(function adminsFounded (err, admins) {
    if(err){
        return next(err);
    }

    if(admins[0]==undefined){
        return ok();
    }else{

    if (req.session.authenticated  && req.session.admin ) {
        res.locals.flash = {};
        if (!req.session.flash) return ok();

        res.locals.flash = _.clone(req.session.flash);

        req.session.flash = {};
        return ok();
    }

    
	req.session.flash={
		err:'Debes iniciar sesión'
	}
	res.redirect('session/login');
	return;
    }


});
};