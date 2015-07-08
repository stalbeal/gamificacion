/**
 * PhaseTypeController
 *
 * @description :: Server-side logic for managing phaseTypes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    new: function(req, res) {
        res.view();

    },
    /*Crea una nueva clase
     */
    create: function(req, res, next) {

        var phaseTypeObj = {
            name: req.param('name'),
            description: ValidateFields.isNull(req.param('description'))
        }

        PhaseType.create(phaseTypeObj, function recordCreated(err, phaseType) {
            if (err) {
                req.session.flash = {
                    err: sails.errorMessage(err)
                }
                return res.redirect('/phasetype/new');
            }
            if (Response.view(phaseType, next)) {

                return res.redirect('/phasetype/show/' + phaseType.id);

            }
        });

    },
    /*Retorna el registro de clase a la vista editar
     **/
    edit: function(req, res, next) {
        PhaseType.findOne(req.param('id'), function recordFounded(err, phaseType) {
            if (err) {
                return next(err);
            }
            if (Response.view(phaseType, next)) {
                return res.view({
                    phaseType: phaseType
                });
            }
        });
    },
    /*Actualiza un registro de clase 
     **/
    update: function(req, res, next) {

        var phaseTypeObj = {
            name: req.param('name'),
            description: ValidateFields.isNull(req.param('description'))
        }
        if (Response.view(req.param('id'), next)) {
            PhaseType.update(req.param('id'), phaseTypeObj, function raceUpdate(err, phaseType) {
                if (err) {
                    req.session.flash = {
                        err: sails.errorMessage(err)
                    }
                }

                return res.redirect('/phasetype/show/' + req.param('id'));

            });
        }

    },
    /*Retorna todas las razaes en la base de datos
     **/
    index: function(req, res, next) {
        PhaseType.find().sort({
            name: 'asc'
        }).exec(function(err, phaseTypes) {
            if (err) {
                return next(err);
            }

            return res.view({
                phaseTypes:phaseTypes});

        });
    },
    /*Retorna todos los registros en la base de datos, de la clase, en json
     **/
    view: function(req, res, next) {
        PhaseType.find().sort({
            name: 'asc'
        }).exec(function(err, phaseTypes) {
            if (err) {
                return res.json(Response.resJson(err.status, phaseTypes));
            }
            return res.json(Response.response('600', phaseTypes));

        });
    },
    /*Retorna el registro de la clase a la vista show
     **/
    show: function(req, res, next) {
        PhaseType.findOne(req.param('id'), function recordFounded(err, phaseType) {
            if (err) {
                return next(err);
            }
        if (Response.view(phaseType, next)) {
        	return res.view({
        		phaseType:phaseType
        	});
        }
        });
    },
    /*Elimina el registro de la clase, eliminando todas las demas relaciones 
     *existentes***no esta terminado
     */
    destroy: function(req, res, next) {
        PhaseType.destroy({
            id: req.param('idrace')
        }).exec(function(err, phaseType) {
            if (err) {
                return next(err);
            }
          

           
        }); //phaseType

    }
};