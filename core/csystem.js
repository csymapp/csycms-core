'use strict'

const fse = require('fs-extra')
const path = require('path')
const _ = require('underscore')
const contentProcessors = require('../functions/contentProcessors')
const { config } = require('shelljs')
// const yargs = require("yargs")
// const appRoot = require('app-root-path')
// const base_url = appRoot.path
// const argv = yargs.argv

/**
 * Csystem class
 */
class Csystem {
    /**
     * constructor
     * @param {object} config
     */
    constructor(config) {
        this.config = config
        this.loadPagesList();
    }

    /**
     * Remove leading slash and leading directory and file numbers from paths
     * @param {array} path - Optional. Reads from this.sortedFilesPaths if not provided
     * @returns Array of file paths
     */
    pathsNoLeadingSlashNorNumber = paths => {
        if (!paths) {
            paths = this.sortedFilesPaths
        }
        return paths.map(file => file.replace(/\/[0-9]*\./g, '/').replace(/^\//, ''))
    }
    /**
     * Get urls for content files
     * @param {array} paths - Optional. Reads from this.sortedFilesPaths if not provided
     * @returns Array of relative urls without leading /
     */
    sortedUrls = paths => {
        if (!paths) {
            paths = this.pathsNoLeadingSlashNorNumber(this.sortedFilesPaths)
        }
        return paths.map(file => file.replace(/\.md$/, '').replace(/\/chapter/, '').replace(/\/docs/, ''))
    }

    /**
     * Get hierarchical list of urls, for sidebar
     * @param {array} paths - Optional. Reads from this.sortedFilesPaths if not provided
     * @returns Hierarchical list of urls
     */
    nestedUrls = paths => {
        if (!paths) {
            paths = this.sortedUrls(this.pathsNoLeadingSlashNorNumber(this.sortedFilesPaths))
        }
        return this.listToTree(paths)
    }

    /** 
     * Get hierarchical list of all site pages
     * @returns {oject}
    */
    loadPagesList = () => {
        let content_dir = path.join(this.config.directory, 'content')
        let csycmsdocsDir = path.join(this.config.directory, 'content', 'csycmsdocs')
        let files = this.listFiles(content_dir).sort();
        /**
         * ['/var/www/html/csycms/SITE1/content/01.basics/01.what-is-csycms/docs.md',
         * '/var/www/html/csycms/SITE1/content/01.basics/02.Requirements/docs.md',..]
         */

        files = _.filter(files, (file) => {
            // remove csycmsdocs if documentation is disabled.
            let allowCsycmsDocs = this.config.documentation
            return file.match(/\.md$/) && (allowCsycmsDocs ? true : !file.includes(csycmsdocsDir));
        });

        let sortedFilesPaths = files.map(file => file.replace(content_dir, '').replace(/docs\.md$/, `00.docs`).replace(/chapter\.md$/, `00.chapter`)).sort();
        sortedFilesPaths = sortedFilesPaths.map(file => file.replace(/00.docs$/, 'docs.md').replace(/00.chapter$/, 'chapter.md'))
        /** sorted file paths */
        this.sortedFilesPaths = [...sortedFilesPaths];

        let sortedFilesPathsNoLeadingSlashNorNumber = this.pathsNoLeadingSlashNorNumber()
        this.sortedFilesPathsNoLeadingSlashNorNumber = [...sortedFilesPathsNoLeadingSlashNorNumber]
        console.log(sortedFilesPathsNoLeadingSlashNorNumber)

        return
        // let sortedFilesPathsNoLeadingSlashNorNumber = this.pathsNoLeadingSlashNorNumber()
        // this.sortedFilesPathsNoLeadingSlashNorNumber = [...sortedFilesPathsNoLeadingSlashNorNumber]
        // let sortedUrls = sortedFilesPathsNoLeadingSlashNorNumber.map(file => file.replace(/\.md$/, '').replace(/\/chapter/, '').replace(/\/docs/, ''))
        let sortedUrls = this.sortedUrls();

        console.log(sortedUrls)

        // let nestedUrls = this.listToTree(sortedUrls)
        let nestedUrls = this.nestedUrls();
        // nestedUrls = nestedUrls[0].children[0].children;
        console.log(nestedUrls)
        process.exit();

        let urls = filesPath.map(file => file.replace(/docs\.md$/, `00.docs`).replace(/chapter\.md$/, `00.chapter`).replace(/\.md/, '')).sort();
        // urls.sort();
        let originalUrls = urls.map(function (file) {
            file = file.replace('.md', '').replace('\\', '/');
            return file + '.md'
        });
        // originalUrls.sort();
        // original - actualFilePaths, sorted...
        console.log(urls)
        console.log(originalUrls)
        process.exit();
        urls = urls.map(function (file) {
            file = file.replace('/00.docs', '').replace('/00.chapter', '')
            return file
        });
        originalUrls = originalUrls.map(function (file) {
            file = file.replace('/00.docs.md', '/docs.md')
            return file
        });


        for (let i in urls) urls[i] = urls[i].replace(/\/[0-9]+\./g, '/').replace(/^[0-9]+\./g, '')

        let nestedPages = self.build_nested_pages(originalUrls, urls, content_dir)
        let siteSpace = config.site_space
        let dir = 'config/sites-enabled'

        let otherSites = fse.readdirSync(dir).reduce(function (list, file) { // work this later...
            var name = path.join(dir, file);
            var isDir = fse.statSync(name).isDirectory();
            return list.concat(isDir ? self.listFiles(name) : [name]);    // work on this...
        }, []).reduce((accumulator, currentValue, currentIndex, originalPageListArray) => {
            let config_file = path.join(base_url, currentValue)
            config_file = currentValue.split('.')
            config_file.pop();
            config_file = config_file.join('.')
            config_file = config_file.split('/').pop()
            let iConfig = require('../functions/config')(config_file)
                // let iConfig = require(config_file)(rootPath)
                , content_dir = path.join(iConfig.content_dir, iConfig.site)
            siteSpace === iConfig.site_space ? accumulator.push({ domain: iConfig.base_url, content_dir, config_file }) : false;
            return accumulator
        }, [])
        return { original: originalUrls, modified: urls, nestedPages, otherSites }
    }

    /**
     * Put files into hierarchical list of directories
     * @param {Array} files - list of file paths
     * @returns {array} hierarchical list of directories
     */
    listToTree = files =>
        files.map(file => file.split('/'))
            .reduce((out, path) => {
                // console.log(out)
                // console.log(path)
                // process.exit();
                let top = out;
                while (path.length > 0) {
                    let node = path.shift();
                    if (top.findIndex(n => n.text === node) === -1) {
                        top.push({
                            text: node
                        });
                    }
                    // console.log('top')
                    // console.log(top)
                    if (path.length > 0) {
                        let index = top.findIndex(n => n.text === node);
                        top[index] = top[index] || {};
                        top[index].children = top[index].children || [];
                        top[index].children.push({
                            text: path[0]
                        });
                        top = top[index].children;
                    }
                }
                return out;
            }, []);

    /**
     * List all paths of all files in a directory looping through all directories within the given directory
     * @param {string} dir 
     * @returns {array} An array of paths of all files in the provided directory
     */
    listFiles = dir => {
        return fse.readdirSync(dir).reduce((list, file) => {
            let name = path.join(dir, file);
            let isDir = fse.statSync(name).isDirectory();
            return list.concat(isDir ? this.listFiles(name) : [name]);
        }, []);
    }

    build_nested_pages(originalPageList, refPageList, content_dir) {
        let nestedPages = [];
        let pageParts = []
            , metas = []
            , self = this


        for (let i in originalPageList) {
            let filePath = path.join(content_dir, originalPageList[i])
            filePath = filePath.replace('00.chapter.md', 'chapter.md')
            const file = fse.readFileSync(filePath);

            const meta = contentProcessors.processMeta(file.toString('utf-8'));
            metas[i] = meta
        }

        let { pageListWithTitle } = originalPageList.reduce((accumulator, currentValue, currentIndex, originalPageListArray) => {
            accumulator.pageListWithTitle.push({ path: currentValue, index: currentIndex, slug: refPageList[currentIndex], title: metas[currentIndex].title })
            return accumulator
        }, { pageListWithTitle: [] })

        nestedPages = self.build_nested_pages_inner(pageListWithTitle, 0).slice(1)
        return nestedPages
    }

    build_nested_pages_inner(pageListWithTitle, level, debug) {
        let self = this
            , chapters = []
            , prevChapterNum = 0
            , prevDir = ''
            , getIndex = (list, Indexinner) => {
                for (let i in list) {
                    if (list[i].index === Indexinner) return i
                }
                return NaN
            }

        if (debug) {
            console.log(pageListWithTitle)
        }

        for (let i in pageListWithTitle) {
            let filePath = pageListWithTitle[i].path
            let parts = filePath.split('.')
            let chapterNum = parseInt(parts[0].replace('/', ''))
            let thisDir = filePath.split('/')[1]
            if (filePath === '/docs.md') continue;
            if (!isNaN(chapterNum)) {
                if (debug) {
                    console.log(parts)
                }
            }
            else {
                if (thisDir !== prevDir)
                    chapterNum = prevChapterNum + 1
            }
            prevChapterNum = chapterNum
            prevDir = filePath.split('/')[1]

            if (!chapters[chapterNum]) {
                parts = filePath.split('/')
                let folderPart = '/' + parts[1];

                let { numFiles, files_in_dir } = pageListWithTitle.reduce((accumulator, currentValue, currentIndex, originalPageListArray) => {
                    let testLen = currentValue.path.split('/').length

                    let testLenResult = testLen === 3 || testLen === 4 ? true : false;
                    let threeparts = currentValue.path.split('/')
                    threeparts = [threeparts[0], threeparts[1], threeparts[2]].join('/')
                    if (debug) console.log(`${accumulator.needle}=>${currentValue.path}`)
                    if (currentValue.path.indexOf(accumulator.needle) === 0 && currentValue.path !== '/docs.md') {
                        accumulator.numFiles++
                        accumulator.files_in_dir.push({ name: currentValue.path, index: currentValue.index })
                    }

                    return accumulator
                }, { needle: folderPart, numFiles: 0, files_in_dir: [], numDirs: 0 })

                chapters[chapterNum] = {
                    slug: pageListWithTitle[i].slug,
                    title: pageListWithTitle[i].title,
                    chapterNum: chapterNum,
                    show_on_home: true,
                    is_directory: numFiles > 1 ? true : false,

                }

                if (level === 0) numFiles--;
                if (numFiles > 0) {
                    chapters[chapterNum].files = []

                    let pageListWithTitleInner = []
                    for (let j in files_in_dir) {

                        let item = files_in_dir[j]
                        let itemNameParts = item.name.split('/')
                        let indexInner = item.index
                        let pathinner = itemNameParts.slice(2)
                        pathinner = '/' + pathinner.join('/')

                        let itemInner = {
                            path: pathinner,
                            index: item.index,
                            slug: pageListWithTitle[getIndex(pageListWithTitle, indexInner)].slug,
                            title: pageListWithTitle[getIndex(pageListWithTitle, indexInner)].title
                        }
                        if (pathinner !== '/')
                            pageListWithTitleInner.push(itemInner)
                    }
                    // chapters[chapterNum].files = self.build_nested_pages_inner(pageListWithTitleInner, level+1, '/01.environment/docs.md' === filePath?true:false).slice(1)
                    chapters[chapterNum].files = self.build_nested_pages_inner(pageListWithTitleInner, level + 1, false).slice(1)

                } else chapters[chapterNum].is_index = true
            } else {
                ;
            }

        }
        return chapters
    }

}

module.exports = Csystem