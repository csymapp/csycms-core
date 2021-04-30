'use strict';

// Modules
let path = require('path');
let fs = require('fs');
let build_nested_pages = require('../functions/build_nested_pages.js');
let marked = require('marked');
let toc = require('markdown-toc');
let remove_image_content_directory = require('../functions/remove_image_content_directory.js'),
  showdown = require('showdown'),
  converter = new showdown.Converter(),
  MarkdownIt = require('markdown-it'),
  md = new MarkdownIt({
    html: true
  }),
  markdownItAttrs = require('markdown-it-attrs');


const contentProcessors = require('../functions/contentProcessors');
const contentsHandler = require('../core/contents');
const utils = require('../core/utils');

// import markdownItMermaid from 'markdown-it-mermaid'
const markdownItMermaid = require('markdown-it-mermaid')


// console.log(markdownItMermaid)
// process.exit()
md.use(markdownItAttrs);
md.use(require('markdown-it-imsize'))
md.use(require('markdown-it-checkbox'));
md.use(require('markdown-it-math'));
md.use(require('markdown-it-fontawesome'));
md.use(require('markdown-it-decorate'));
md.use(require('markdown-it-div'));
// md.use(markdownItMermaid);
// md.use(require('markdown-it-vue'));
// md.use(require('markdown-it-container'), '[ui-tabs]');


/**
 * Wildcard route
 * Open only the requested file
 * @param {Object} csystem 
 */
function route_wildcard(csystem/*config, reffilePaths*/) {
  let config = csystem.config
  let files = csystem.sortedFilesPaths.map(item => path.join(csystem.config.content_dir, item));
  let urls = csystem.sortedUrls();

  // let files = csystem.loadPagesList()
  // console.log('------------')
  // console.log('------------')
  // console.log('------------')
  // console.log('------------')
  // console.log('------------', reffilePaths)

  return function (req, res, next) {
    /** which is our file? */
    try {
      if (!req.session) req.session = {}
      // Skip if nothing matched the wildcard Regex
      if (!req.params[0]) {
        return next();
      }

      /** no idea what for */
      let suffix = 'edit';
      /** requested path */
      let slug = req.params[0];
      let rqPathWithoutLeadingSlash = slug.replace(/^(\/)/, '')
      // console.log(files)


      // console.log('the requested path...')
      // console.log('the requested path...')
      // console.log('the requested path...')
      // console.log('the requested path...', rqPathWithoutLeadingSlash, slug, csystem.sortedFilesPathsNoLeadingSlashNorNumber, urls)
      let pathIndex = urls.findIndex((elem) => {
        return elem === rqPathWithoutLeadingSlash
      })
      if (rqPathWithoutLeadingSlash === '') pathIndex = 0;
      if (pathIndex < 0) {
       // console.log('qqqqqqqqqqqqqqq')
       // console.log('qqqqqqqqqqqqqqq')
       // console.log('qqqqqqqqqqqqqqq')
       // console.log(req.path)
       // console.log(req.params)
       // console.log('qqqqqqqqqqqqqqq')
        return next();
      }
      slug = urls[pathIndex]
     // console.log('==============>', { pathIndex, slug, path: req.path, params: req.params, query: req.query })

      /** add navigation for next and previous */
      let navSlugs = {}
      if (pathIndex === 0) navSlugs = {
        next: encodeURI('/'+urls[pathIndex + 1])
      }
      else {
        // if(pathIndex === reffilePaths.length - 1)navSlugs = {prev:encodeURI(filePaths[pathIndex-1])}
        if (pathIndex === urls.length - 1) navSlugs = {
          prev: encodeURI('/'+(urls[pathIndex - 1]))
        }
        // else navSlugs = {prev:filePaths[pathIndex-1], next:encodeURI(filePaths[pathIndex+1])}
        else{
         // console.log('setting NEXT')
         // console.log('setting NEXT')
         // console.log('setting NEXT')
         // console.log('setting NEXT')
         // console.log('setting NEXT', urls)
         navSlugs = {
         
          prev: encodeURI('/'+urls[pathIndex - 1]),
          next: encodeURI('/'+(urls[pathIndex + 1]))
        }
        }
      }

      let preMeta = {};
      /**
       * Check not the whole page should be hidden... 
       */
      if (slug === undefined) {
        // if (req.auth) {
        //   slug = '/errorpages/loggedIn.md'
        //   preMeta.response_code = 404; // 404 is a temporary work around because of allowErrorPages()
        // } else 
        // {
        slug = '/errorpages/404.error.md'
        preMeta.response_code = 404;
        delete navSlugs.prev
        // }
      }
     // console.log({ navSlugs })

     // console.log({ preMeta })

      // try {
      //   let originalFilePaths = reffilePaths["original"]
      //   let filePaths = reffilePaths["modified"]
      //   // let originalFilePaths = reffilePaths["original"]
      //   // let filePaths = reffilePaths["modified"]
      //   let nestedPages = reffilePaths["nestedPages"]
      //   let pathIndex = filePaths.findIndex(function (elem) {
      //     return elem === slug
      //   })
      // } catch (error) {
      //   console.log(error)
      //   // console.log(files)
      // }

      // slug = originalFilePaths[pathIndex]
      // console.log('----{{{{{{{{{{{{{{{{{{{{{{{')
      // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
      // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
      // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
      // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
      // console.log('{{{{{{{{{{{{{{{{{{{{{{{')

     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')

      // if(pathIndex === 0) navSlugs = {next:encodeURI(filePaths[pathIndex+1])}


     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')
     // console.log('{{{{{{{{{{{{{{{{{{{{{{{')

      // console.log(files)
      /** check different functions for processing error pages... */
      let file_path = files[pathIndex] //  ||  path.normalize(config.content_dir + slug);;
      // let file_path = path.normalize(config.content_dir + slug);
     // console.log(file_path)

      /** No idea at all now why these lines 
      file_path = file_path.replace(/\/00\./g, '/')
      let file_path_orig = file_path;
      if (file_path.indexOf(suffix, file_path.length - suffix.length) !== -1) {
        file_path = file_path.slice(0, -suffix.length - 1);
      }
      */
     // console.log(slug)
      let content;
      let meta = { metadata: {} }
      try {
        content = fs.readFileSync(file_path, 'utf8');
        meta = contentProcessors.processMeta(content);
        if (preMeta.response_code) meta.response_code = preMeta.response_code;
        meta.custom_title = meta.title;
        if (!meta.title) {
          meta.title = contentProcessors.slugToTitle(file_path);
        }
       // console.log(meta)
        content = contentProcessors.stripMeta(content);
        content = contentProcessors.processVars(content, config);
      } catch (error) { }
      // console.log(content)


      /**
       * check remove or allow protected sections... (requires a protected stuff handler)
       */


      let template = meta.template || 'page';
      let render = template;

      if (config.table_of_contents) {
        let tableOfContents = toc(content);
        if (tableOfContents.content) {
          content = '#### Table of Contents\n' + tableOfContents.content + '\n\n' + content;
        }
      }

      // Render Markdown
      marked.setOptions({
        langPrefix: ''
      });
      try {
        content = md.render(content)
      } catch (error) { }

     let layout, theme = config.theme_name, renderRoot = ''
      if (meta.theme) {
        if(typeof meta.theme === 'string'){ // system theme
          theme = meta.theme
          renderRoot = `${theme}/templates`
        }else{
          try{
            if(meta.theme.system){
              theme = meta.theme.system
              renderRoot = `${theme}/templates`
            }else{
              theme = meta.theme.local
              renderRoot = `${theme}`
            }
          }catch(error){}
        }
        theme = meta.theme
      }
      layout = 'layout'
      if (meta.theme) {
          layout = meta.layout
      }
      // render = 'render'

      if (meta.redirect) {
        let redirectPath = meta.redirect
        let resCode = redirectPath.match(/\[(.*?)\]/);

        if (!resCode) res.redirect(redirectPath)
        else {
          redirectPath = redirectPath.replace(resCode[0], '')
          res.redirect(redirectPath, resCode[1])
        }
      }
      let toc;
      let author;
      author = meta.metadata.author ? meta.metadata.author : false;
      meta.toc === false ? toc = false : (meta.toc === 'false' ? toc = false : (meta.toc === undefined ? toc = true : toc = 'toc'));

      if (!meta.response_code) meta.response_code = 200


      const getTitle = (slug) => {
        let rqPathWithoutLeadingSlash = slug.replace(/^(\/)/, '')
        let slugIndex = urls.findIndex((elem) => {
          return elem === rqPathWithoutLeadingSlash
        })

        let _file_path = files[slugIndex]
        let _content = fs.readFileSync(_file_path, 'utf8');
        let _meta = contentProcessors.processMeta(_content);
        return _meta.title
      }

      const createBreadCrumbs = (slug, pages) => {
        let breadCrumbTitles = []
        let breadCrumbSlugs = []
        let parts = slug.split('/')
        // console.log(parts)
        // // parts = parts.slice(1)
        // console.log(parts)
        for (let i in parts) {
          let tmpParts = [...parts];
          tmpParts = tmpParts.reverse().slice(tmpParts.length - i - 1)
          tmpParts.reverse();
          tmpParts = '/' + tmpParts.join('/')
          let tmpSlug = tmpParts
          let title = getTitle(tmpSlug)
          breadCrumbTitles.push(title)
          breadCrumbSlugs.push(tmpSlug)
        }
        breadCrumbTitles.reverse()
        breadCrumbSlugs.reverse()
        const addtoRets = (rets, linetoAdd, tmpSlug, isEnd) => {
          if (Object.keys(rets).length === 0) return {
            title: linetoAdd,
            slug: tmpSlug,
            isEnd
          }
          return {
            title: linetoAdd,
            breadCrumbs: rets,
            slug: tmpSlug,
            isEnd
          }
        }
        let ret = {}
        for (let i in breadCrumbTitles) {
          let isEnd = (parseInt(i) === 0) ? true : false;
          ret = addtoRets(ret, breadCrumbTitles[i], breadCrumbSlugs[i], isEnd)
        }
        return ret;
      }

      let breadCrumbs = createBreadCrumbs(slug, urls)
     // console.log(breadCrumbs)
      // console.log(breadCrumbs)
      /**
       * The res.render() function is used to render a view and sends the rendered HTML string to the client.
       */
      return res.status(meta.response_code).render(`${renderRoot}${renderRoot!==''?'/':''}${render}`, {
        config: config,
        pages: {},
        meta: meta,
        content: content,
        body_class: template + '-' + contentProcessors.cleanString(slug),
        last_modified: utils.getLastModified(config, meta, file_path),
        author,
        lang: config.lang,
        loggedIn: {},
        username: (config.authentication ? req.session.username : null),
        canEdit: false,
        navSlugs,
        breadCrumbs,
        // breadCrumbs: {
        //   title: 'linetoAdd',
        //   slug: 'tmpSlug',
        //   breadCrumbs: {
        //     title: 'linetoAdd',
        //     slug: 'tmpSlug',
        //     isEnd: true
        //   },
        //   isEnd: false
        // },
        Toc: toc,
        layout,
        auth: req.auth ? JSON.stringify(req.auth) : ''
      });



     
    } catch (error) {
    }

  };
}

// Exports
module.exports = route_wildcard;
