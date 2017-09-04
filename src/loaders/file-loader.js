const fs = require('fs');
const path = require('path');

const utils = require('../utils');
const Loader = require('./base-loader');

const FileLoader = class FileLoader extends Loader {
    constructor(searchPaths, options = {}) {
        super();

        this._pathsToNames = {};
        this.noCache = !!options.noCache;
        this.extName = options.extName || 'html';

        if (searchPaths) {
            searchPaths = utils.isArray(searchPaths) ? searchPaths : [searchPaths];
            // For windows, convert to forward slashes
            this.searchPaths = searchPaths.map(path.normalize).map(file => path.resolve(file));
        } else {
            this.searchPaths = ['./'].map(file => path.resolve(file));
        }
    }

    getSource(name) {
        let fullPath = null;
        const checkPath = function checkPath(basePath, name) {
            const filePath = path.resolve(basePath, name);

            if (filePath.indexOf(basePath) === 0 && fs.existsSync(filePath)) {
                fullPath = filePath;
                return true;
            }

            return false;
        };

        this.searchPaths.some(basePath => {
            return checkPath(basePath, name) || checkPath(basePath, `${name}.${this.extName}`);
        });

        if (!fullPath) {
            return null;
        }

        this._pathsToNames[fullPath] = name;

        return {
            src: fs.readFileSync(fullPath, 'utf-8'),
            path: fullPath,
            noCache: this.noCache
        };
    }
};

module.exports = FileLoader;
