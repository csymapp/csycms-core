
'use strict';
const path = require('path');
const fs = require('fs-extra');
const sm = require('sitemap');
const _ = require('underscore');
const contentProcessors = require('../functions/contentProcessors');
const utils = require('../core/utils');

function route_sitemap(csystem) {
  let config = csystem.config
  return (req, res, next) => {
    let hostname = csystem.config.domain || req.headers.host;
    let files = csystem.sortedFilesPaths.map(item => path.join(csystem.config.content_dir, item));
    let urls = csystem.sortedUrls();

    // create sitemap.xml
    let sitemap = sm.createSitemap({
      hostname: `${config.scheme}://${hostname}`,
      cacheTime: 600000
    });

    let conf = {
      datetime_format: 'YYYY-MM-DD'
    };

    for (let i = 0, len = urls.length; i < len; i++) {
      let content = fs.readFileSync(files[i], 'utf8');
      // Need to override the datetime format for sitemap
      sitemap.add({
        url: (config.prefix_url || '') + urls[i],
        changefreq: 'hourly',
        priority: 0.8,
        lastmod: utils.getLastModified(conf, contentProcessors.processMeta(content), files[i])
      });
    }

    let content = fs.readFileSync(files[0], 'utf8');
    sitemap.add({
      url: (config.prefix_url || '') + 'robots.txt',
      changefreq: 'hourly',
      priority: 0.8,
      lastmod: utils.getLastModified(conf, contentProcessors.processMeta(content), files[0])
    });

    res.header('Content-Type', 'application/xml');
    res.send(sitemap.toString());

  };
}
module.exports = route_sitemap;
