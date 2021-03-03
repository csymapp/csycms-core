
'use strict';

// Modules
var fs = require('fs');
var _ = require('underscore');
var build_nested_pages = require('../../functions/build_nested_pages.js');
var get_filepath = require('../../functions/get_filepath.js');
var remove_image_content_directory = require('../../functions/remove_image_content_directory.js');

const contentsHandler = require('../../core/contents');
const utils = require('../../core/utils');

class authRoutes {
    constructor(csystem) {
        this.csystem = csystem
    }

    logout = () => {
        this.res.send('going to log out...')
    }

    login = () => {
        let config = this.csystem.config;
        let req = this.req;
        let status = 200
        console.log('{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{')
        console.log(config)
        let renderConfig = {
            config: config,
            status: 200,
            message: config.lang.error[status],
            error: {},
            body_class: 'page-error',
            loggedIn: ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false)
        }

        switch (this.req.method) {
            case "GET":
                this.res.status(200);
                return this.res.render('login', renderConfig);
            case "POST":
                break;
            default:
                console.log('returning this status...')
                return this.next({ code: 405 })
        }
    }

    routeHandler = (req, res, next) => {
        this.req = req
        this.res = res
        this.next = next
        let params = req.params
        console.log(req.method)
        console.log(req.method)
        console.log(req.method)
        console.log(req.method)
        console.log(req.method)
        switch (params.v1) {
            case "logout":
                return this.logout();
            case "login":
                return this.login();
            default:
                return next({ code: 404 })
        }
        console.log(params)
        console.log("we are in the handler....")
        res.send('handled....')
    }
}

// Exports
module.exports = (csystem) => new authRoutes(csystem).routeHandler;