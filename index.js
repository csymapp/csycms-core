'use strict';

// Modules
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookie_parser = require('cookie-parser')
const body_parser = require('body-parser')
const moment = require('moment')
const hogan = require('hogan-express')
const session = require('express-session')
//const passport = require('passport')
//const GitHubStrategy = require('passport-github').Strategy
// const dotenv = require('dotenv')
const fse = require('fs-extra')
const Csystem = require(__dirname + '/core/csystem')
const appRoot = require('app-root-path')
// const base_dir = appRoot.path
// const yargs = require("yargs")
// const argv = yargs.argv
// const site = argv.SITE || process.env.SITE

function initialize(config) {
  // console.log(config);
  // dotenv.config()
  // Load Translations
  if (!config.locale) {
    config.locale = 'en';
  }
  if (!config.lang) {
    config.lang = require('./translations/' + config.locale + '.json');
  }
  const csystem = new Csystem(config)

  const route_sitemap = require('./routes/sitemap.route.js')(csystem);
  const route_auth = require('./routes/auth/auth.js')(csystem);
  const route_robots_txt = require('./routes/robots.txt.route.js')(csystem);
  const error_handler = require('./middleware/error_handler.js')(csystem);

  // var authenticate = require('./middleware/authenticate.js')(csystem);
  // var always_authenticate = require('./middleware/always_authenticate.js')(csystem);
  // var authenticate_read_access = require('./middleware/authenticate_read_access.js')(csystem);

  // var oauth2 = require('./middleware/oauth2.js');
  // var route_logout = require('./routes/logout.route.js');
  // var route_page_edit = require('./routes/page.edit.route.js')(csystem);
  // var route_page_delete = require('./routes/page.delete.route.js')(csystem);
  // var route_page_create = require('./routes/page.create.route.js')(csystem);
  // var route_category_create = require('./routes/category.create.route.js')(csystem);
  // var route_search = require('./routes/search.route.js')(csystem);
  // var route_home = require('./routes/home.route.js')(csystem);
  // var route_wildcard = require('./routes/wildcard.route.js')(csystem);
  // var route_robots_txt = require('./routes/robots.txt.route.js')(csystem);
  // var route_login = require('./routes/login.route.js')(csystem);//(config, pageList, route_wildcard);
  // var route_login_page = require('./routes/login_page.route.js')(csystem);

  const app = express();
  const router = express.Router();
  app.set('port', config.PORT || 3000);
  moment.locale(config.locale);  // set locale as date and time format

  // Setup Views
  // console.log(config)
  // config.theme_dir = path.join(config.directory, 'themes', config.theme_name);

  // if (!config.theme_name) {
  //   config.theme_name = 'default';
  // }
  app.set('views', [
    path.join(config.directory, 'templates', config.theme_name),
    path.join(config.directory, 'templates', 'default'),
    path.join(config.themes_dir, config.theme_name, 'templates'),
    path.join(config.themes_dir, 'default', 'templates'),
  ]);
  // leave it here...
  // app.set('view options', {
  //   layout: false
  // });

  // app.set('layouts', [
  //   path.join(config.directory, 'layouts', config.theme_name),
  //   path.join(config.directory, 'layouts', 'default'),
  //   path.join(config.system_data_dir, 'layouts', config.theme_name),
  //   path.join(config.system_data_dir, 'layouts', 'default')
  //   // system themes... so that we do not have to bloat the sites... & our server with numerous duplications...
  //   /** todo. check.
  //    * We have to pass the system directory here
  //    */
  // ]);
  // process.exit();
  app.set('view engine', 'html');
  app.enable('view cache');
  app.engine('html', hogan);

  // // Setup Express
  // let iconPath = path.join(config.public_dir, 'sites', site, '/icon.png')
  // if (fse.existsSync(iconPath)) {
  //   app.use(favicon(iconPath));
  // } else {
  //   iconPath = path.join(config.public_dir, 'sites', site, '/icon.svg')
  //   // console.log(iconPath)
  //   if (fse.existsSync(iconPath))
  //     app.use(favicon(iconPath));
  //   else
  //     app.use(favicon(path.join(config.public_dir, '/icon.png')));
  // }
  // app.use(favicon(path.join(__dirname, '..', 'public', '/icon.png')));   # 
  app.use(logger('dev'));
  app.use(body_parser.json());
  app.use(body_parser.urlencoded({
    extended: false
  }));
  app.use(cookie_parser());
  app.use(express.static(path.join(config.directory, "public")))
  app.use(express.static(path.join(config.themes_dir, config.theme_name, "public")))
  if (config.theme_name !== 'default') {
    app.use(express.static(path.join(config.themes_dir, "default", "public")))
  }

  // router.use(config.image_url, express.static(path.normalize(config.content_dir + config.image_url)));
  router.use('/translations', express.static(path.normalize(__dirname + '/translations')));

  // // HTTP Authentication
  // if (config.authentication === true || config.authentication_for_edit || config.authentication_for_read) {
  //   app.use(session({
  //     secret: config.secret,
  //     name: 'CSYCMS.sid',
  //     resave: false,
  //     saveUninitialized: false
  //   }));
  //   app.use(authenticate_read_access);
  //   // OAuth2
  //   if (config.googleoauth === true) {
  //     app.use(passport.initialize());
  //     app.use(passport.session());
  //     router.use(oauth2.router(config));
  //     app.use(oauth2.template);
  //   }

  //   router.post('/rn-login', route_login);
  //   router.get('/logout', route_logout);
  //   router.get('/login/:callback?', route_login);
  // }

  // // Online Editor Routes
  // if (config.allow_editing === true) {

  //   var middlewareToUse = authenticate;
  //   if (config.authentication_for_edit === true) {
  //     middlewareToUse = always_authenticate;
  //   }
  //   if (config.googleoauth === true) {
  //     middlewareToUse = oauth2.required;
  //   }

  //   router.post('/rn-edit', middlewareToUse, route_page_edit);
  //   router.post('/rn-delete', middlewareToUse, route_page_delete);
  //   router.post('/rn-add-page', middlewareToUse, route_page_create);
  //   router.post('/rn-add-category', middlewareToUse, route_category_create);

  // }

  // // Router for / and /index with or without search parameter
  // if (config.googleoauth === true) {
  //   router.get('/:var(index)?', oauth2.required, route_search, route_home);
  //   router.get(/^([^.]*)/, oauth2.required, route_wildcard);
  // } else if (config.authentication_for_read === true) {
  //   router.get('/robots.txt', authenticate, route_robots_txt);
  //   router.get('/:var(index)?', authenticate, route_search, route_home);
  //   router.get(/^([^.]*)/, authenticate, route_wildcard);
  // } else {
  //   router.get('/robots.txt', route_robots_txt);
  //   router.get('/:var(index)?', route_search, route_home);
  //   router.get(/^([^.]*)/, route_wildcard);
  // }

  console.log(router)
  router.get('/sitemap.xml', route_sitemap);
  router.get('/sitemap', route_sitemap);
  router.get('/robots.txt', route_robots_txt);

  router.get('/robots.txt', route_robots_txt);

  router.get('/auth/:v1?/:v2?/:v3?/:v4?/:v5?/:v6?/:v7?/:v8?/:v9?/', route_auth);

  // router.get('/', function (req, res, next) {
  //   next('unknown error')
  // });


  // Handle Errors
  // app.use(error_handler);
  console.log('error_handler')
  console.log(error_handler)
  app.use(config.prefix_url || '/', router);

  app.get('*', (req, res, next) => {
    next('unknown error')
  })
  app.use(error_handler);

  // app.use(function (err, req, res, next) {
  //   res.status(err.status || 500);
  //   console.log('has error...')
  //   res.render('error', {
  //     message: err.message,
  //     error: {}
  //   });
  // });



  return app;

}

// Exports
module.exports = initialize;