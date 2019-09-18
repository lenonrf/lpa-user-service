'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	User = mongoose.model('User'),
	_ = require('lodash'),
    pmx = require('pmx');



/**
 * List of Users
 */
exports.list = function(req, res) {

    User.find({languageOrigin: req.get('x-language-origin')})
        .sort('-created')
        .populate('products', '_id').exec(function(err, users) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(users);
            }
        });
};





/**
 * Create a User
 */
exports.create = function(req, res) {

    var user = new User(req.body);

    console.log('user', user);

    user.save(function(err) {

	console.log('user save', err);

        if(_.isEmpty(err)){
            console.log('[USER][CREATE]['+user.email+'] Usuario criado ', user._id);
            res.jsonp(user);
            return null;
        }


        if (err.name === 'ValidationError') {

            if( err.errors.email){

                console.log('[USER][BR][CREATE]['+err.errors.email.value+'] Email ja existe ');

                return res.status(409).send({
                    email : err.errors.email.value,
                    message: errorHandler.getErrorMessage(err)
                });
            }


        }else if(err){

            pmx.notify(new Error('[USER][BR][CREATE]['+user.email+'] Erro ao criar '+err+' \n BODY \n'+user));
            console.log('[USER][BR][CREATE] Erro ao criar ', err.name, 'BODY', user);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }


    });

};



/**
 * Update a User
 */
exports.update = function(req, res) {

    var user = req.user;
    user = _.extend(user , req.body);

    user.save(function(err) {

        if (err) {

            console.log('[USER][BR][UPDATE]['+user.email+'] Erro ao atualizar User ', err);
            pmx.notify(new Error('[USER][BR][UPDATE]['+user.email+'] Erro ao atualizar '+err));

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });

        } else {

            console.log('[USER][BR][UPDATE]['+user.email+'] Usuario atualizado: ');
            res.jsonp(user);
        }
    });
};





exports.userByEmail= function(req, res, next, email) {


    User.findOne({ email: email }).exec(function(err, user) {

            if (err){
                return res.status(500).send({
                    message: errorHandler.getErrorMessage('Erro ao carregar usuario')
                });
            }

            if (!user){
                return res.status(404).send({
                    message: errorHandler.getErrorMessage('Usuario não encontrado')
                });
            }

            req.user = user ;
            next();
        });
};



exports.removeProduct = function(req, res, userId, productId) {

    var user = req.user;

    user.update(
        {_id: userId},
        {$pull: {'contact.phone': {products: productId}}}
    );

};





/**
 * Show the current User
 */
exports.read = function(req, res) {
    res.jsonp(req.user);
};





/**
 * Delete an User
 */
exports.delete = function(req, res) {

    var user = req.user;

    user.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};



/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {

    User.findById(id).exec(function(err, user) {
        if (err) return next(err);
        if (! user) return next(new Error('Failed to load User ' + id));
        req.user = user ;
        next();
    });
};





/**
 * User authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.user.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

