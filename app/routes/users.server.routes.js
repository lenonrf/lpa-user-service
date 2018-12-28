'use strict';



module.exports = function(app) {

	var users = require('../../app/controllers/users');

	app.route('/users')
		.get(users.list)
		.post(users.create);


	app.route('/users/:userId')
		.get(users.read)
		.delete(users.delete);
    app.param('userId', users.userByID);


	app.route('/users/email/:emailValue')
		.get(users.read)
        .put(users.update);
    app.param('emailValue', users.userByEmail);

};
