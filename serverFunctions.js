const fs = require('fs');
let lastFileEncoding = void 0;


function encodingLastFile() {
    return ['br', 'gzip'].includes(lastFileEncoding);
}

exports.encodingName = (file, encoding) => {
    if (process.argv.includes('--dev')) return file;

    if (encoding.includes('br') && fs.existsSync(file + '.br')) {
        lastFileEncoding = 'br';
        file += `.${lastFileEncoding}`;
    } else if (encoding.includes('gzip') && fs.existsSync(file + '.gz')) {
        lastFileEncoding = 'gzip';
        file += '.gz';
    } else {
        lastFileEncoding = '';
    }
    return file;
};
exports.lookupMime = (filePath, encoding = encodingLastFile()) => {
    const mimeTypes = {
        'aac': 'audio/aac',
        'arc': 'application/octet-stream',
        'html': 'text/html',
        'js': 'application/javascript',
        'mjs': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'ico': 'image/x-icon',
        'png': 'image/png',
        'jpg': 'image/jpg',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'mp4': 'video/mp4',
        'woff': 'application/font-woff',
        'ttf': 'application/font-ttf',
        'eot': 'application/vnd.ms-fontobject',
        'otf': 'application/font-otf',
        'svg': 'image/svg+xml',
        'txt': 'text/plain'
    };
    const splitDot = filePath.split('.');
    let file = splitDot.pop();
    if (encoding) file = splitDot.pop();
    return mimeTypes[file] || 'text/html';
};
exports.lookupHeader = filePath => {
    const base = {
        'Content-Type': `${exports.lookupMime(filePath)}; charset=utf-8`,
        'Referrer-Policy': 'no-referrer'
    };
    if (encodingLastFile()) base['Content-Encoding'] = lastFileEncoding;
    return base;
};