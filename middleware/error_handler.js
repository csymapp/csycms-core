
'use strict';

/**
 * Error-Handling Middleware
 * Errors: 404, 500, 403
 * @param {*} csystem 
 */
function handler(csystem) {
  return function (err, req, res, next) {
    console.log(err)
    let status = err.code || 500;
    let msg = err.msg || err.message || err || 'unknown error'

    if (typeof msg === 'object') {
      msg = JSON.stringify(msg)
    }

    const config = csystem.config
    if (!req.session) req.session = {}
    res.status(status);
    let renderConfig = {
      layout: 'layout',
      config: config,
      status: status,
      message: config.lang.error[status] || msg,
      error: {},
      body_class: 'page-error',
      loggedIn: ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false)
    }

    res.render(`errors/error-${status}`, renderConfig, (err, html) => {
      if (err) {
        res.render('errors/error', renderConfig);
      } else {
        res.send(html);
      }
    });

  };
}

// Exports
module.exports = handler;
