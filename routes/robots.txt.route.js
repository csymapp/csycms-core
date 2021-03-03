
'use strict';

const route_robots_txt = csystem => {
  let config = csystem.config
  return (req, res, next) => {
    let hostname = config.domain || req.headers.host;
    hostname = `${config.scheme}://${hostname}`
    res.end(`User-agent: * \r\nDisallow: \nAllow: / \r\nSitemap: ${hostname}/sitemap.xml \r\n`);
  };
}
// Exports
module.exports = route_robots_txt;
