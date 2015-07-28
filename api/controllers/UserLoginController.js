/**
 * UserLoginController
 *
 * @description :: Server-side logic for managing userlogins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	//Id del usuario
	user:{
		type:'string',
		required:true,
		unique:true
	}
};

