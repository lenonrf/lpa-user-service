'use strict';

module.exports = {
	
	app: {
		title: 'user-service',
		description: ''	
	},
	
	port: process.env.PORT || 3009,
	templateEngine: 'swig',
	sessionSecret: 'user-service',
	sessionCollection: 'sessions',
	

};