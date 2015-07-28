module.exports= function (req, res,ok) {
	if(req.session.authenticated){
		return ok();
	}
	req.session.flash={
		err: 'Debes iniciar sesión'
	}
	
	res.redirect('/session/login');
	
	
}