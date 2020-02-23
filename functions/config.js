'use strict';

const path = require('path'),
  fs = require('fs'),
  _s = require('underscore.string'),
  contentProcessors = require('../functions/contentProcessors'),
  yaml = require('js-yaml'),
  yargs = require("yargs"),
  argv = yargs.argv,
  appRoot = require('app-root-path'),
  randomstring = require("randomstring");

// Exports
module.exports = function (site) {
  let base_dir = appRoot.path
  const metaString = fs.readFileSync(path.join(base_dir, `config/sites-enabled`, `${site}.yaml`), 'utf-8'); // path to config
  let yamlObject = yaml.safeLoad(metaString);
  yamlObject = contentProcessors.cleanObjectStrings(yamlObject);

  let config = {
    site_space: '', // Your site title (format: page_title - site_title)
    site_title: 'test site',
    search_scope: 'local',
    base_url: '', // The base URL of your site (can use %base_url% in Markdown files)
    support_email: '', // Used for the "Get in touch" page footer link
    // Footer Text / Copyright
    copyright: 'Copyright &copy; 2018 - ' + new Date().getFullYear() + ' - <a href="http://www.gospelsounders.org">Gospel Sounders</a>',
    github: false,
    facebook: false,
    youtube: false,
    telegram: false,
    whatsapp: false,
    whitelisted: ["gmail.com"],
    // externalLinks: false,
    // externalLinks: [
    // '<a href="">Login</a>',
    // '<a class="btn" href="">Button Link</a>'
    // ],
    excerpt_length: 400, // Excerpt length (used in search)

    // The meta value by which to sort pages (value should be an integer)
    // If this option is blank pages will be sorted alphabetically
    page_sort_meta: 'sort',

    // Should categories be sorted numerically (true) or alphabetically (false)
    // If true category folders need to contain a "sort" file with an integer value
    category_sort: true,

    // Controls behavior of home page if meta ShowOnHome is not present. If set to true
    // all categories or files that do not specify ShowOnHome meta property will be shown
    show_on_home_default: true,

    // Which Theme to Use?
    theme_dir: path.join(base_dir, 'themes'),
    theme_name: 'default',
    // Specify the path of your content folder where all your '.md' files are located
    // Fix: Needs trailing slash for now!
    // Fix: Cannot be an absolute path
    content_dir: path.join(base_dir, 'content'),  // change this..

    // Where is the public directory or document root?
    public_dir: path.join(base_dir, 'public'),  // change this also..

    // The base URL of your images folder,
    // Relative to config.public_dir
    // (can use %image_url% in Markdown files)
    image_url: '/images',

    // Add your analytics tracking code (including script tags)
    analytics: '',
    // Set to true to enable the web editor
    allow_editing: true,

    // Set to true to enable HTTP Basic Authentication
    authentication: true,

    // If editing is enabled, set this to true to only authenticate for editing, not for viewing
    authentication_for_edit: true,

    // If authentication is enabled, set this to true to enable authentication for reading too
    authentication_for_read: false,

    // Google OAuth
    googleoauth: false,
    oauth2: {
      client_id: '',
      client_secret: '',
      callback: '',
      hostedDomain: 'google.com'
    },
    secret: '',

    credentials: [{
        username: '',
        password: ''
      },
      {
        username: '',
        password: ''
      }
    ],

    locale: 'en',

    // Support search with extra languages
    searchExtraLanguages: ['ru'],
    // Sets the format for datetime's
    datetime_format: 'Do MMM YYYY',
    // Set to true to render suitable layout for RTL languages
    rtl_layout: false,
    // Edit Home Page title, description, etc.
    home_meta: {
      // title       : 'Custom Home Title',
      // description : 'Custom Home Description'
    },

    // variables: [
    //   {
    //     name: 'test_variable',
    //     content: 'test variable'
    //   },
    //   {
    //     name: 'test_variable_2',
    //     content: 'test variable 2'
    //   }
    // ]

    table_of_contents: false
      // where is this site accessible?
      // same as that in .env
      ,
    site: 'test' // site name in csycms (for identifying site folders)

  };

  config = {...config, ...yamlObject }
  // config.public_dir = path.join(ROOTPATH, '..', 'themes', config.theme_name, 'public');

  // remove trailing slash from config.base_url
  config.base_url = config.base_url.replace(/\/$/, "")
  config.site = site
  if(config.site_space ==='') config.site_space = randomstring.generate(7);;
  return config;
}
