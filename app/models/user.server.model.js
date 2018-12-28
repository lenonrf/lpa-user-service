'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var extend = require('mongoose-schema-extend');
var uniqueValidator = require('mongoose-unique-validator');


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};


/**
 * User Schema
 */
var UserSchema = new Schema({

	ip : {
		type: String,
		trim: true,
		default: ''
	},


	name: {
		type: String,
		trim: true,
		default: '',
		required: true
	},


	email: {
		type: String,
		trim: true,
		default: '',
		required: true,
		unique: 'O email já existe',
		validate: [validateLocalStrategyProperty, 'Preencha o email'],
		match: [/.+\@.+\..+/, 'Preencha o email']
	},

	gender: {
		type: String,
		trim: true,
		default: ''
	},

	
	updated: {
		type: Date
	},


	birthDate: {
		type: Date,
		trim: true,
		default: ''
	},

	cellphone: {
		type: String,
		trim: true,
		default: ''
	},

	status: {
        type: Boolean,
        trim: true,
        default: true

    },

	telephone: {
		type: String,
		trim: true,
		default: ''
	},



	address : {

		street: {
			type: String,
			trim: true,
			default: ''
		},
		number: {
			type: String,
			trim: true,
			default: ''
		},
		complement: {
			type: String,
			trim: true,
			default: ''
		},
		neighborhood: {
			type: String,
			trim: true,
			default: ''
		},
		zipcode: {
			type: String,
			trim: true,
			default: ''
		},
		city: {
			type: String,
			trim: true,
			default: ''
		},
		state: {
			type: String,
			trim: true,
			default: ''
		}
	},


	created: {
		type: Date,
		default: Date.now
	}
},{ versionKey: false });

mongoose.model('User', UserSchema);
UserSchema.plugin(uniqueValidator);


