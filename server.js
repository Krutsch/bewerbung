const http2 = require('http2');
const fs = require('fs');
const fnc = require('./serverFunctions');

const server = http2.createSecureServer({
    ca: fs.readFileSync('./secure/krutsch_works.ca-bundle'),
    key: fs.readFileSync('./secure/krutsch_works.key'),
    cert: fs.readFileSync('./secure/krutsch_works.crt'),
    allowHTTP1: true
}, onRequest).listen(process.argv.includes('--dev') ? 443 : 4443 );

function onRequest(req, res) {
    const [reqPath, encoding, lang] = [req.url, req.headers["accept-encoding"], req.headers["accept-language"]];
    let filePath;
    if (reqPath.includes('.')) {
        reqPath.includes('/dist/')
            ? filePath = fnc.encodingName(process.cwd() + reqPath, encoding)
            : filePath = fnc.encodingName(process.cwd() + '/src/' + reqPath, encoding)
    } else {
        if (lang.split(',')[0].includes('de')) {
            filePath = fnc.encodingName(`${process.cwd()}/src` + '/de_index.html', encoding)
        } else {
            filePath = fnc.encodingName(`${process.cwd()}/src` + '/en_index.html', encoding);
        }
    }

    const header = fnc.lookupHeader(filePath);

    if (reqPath.endsWith('.js') && filePath.endsWith('_index.html')) {
        res.writeHead(404);
        res.end();
    } else if (reqPath.includes('robots.txt')) {
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Referrer-Policy': 'no-referrer'
        },);
        res.end('User-agent: *\nDisallow: ');
    }

    res.writeHead(200, header);
    fs.createReadStream(filePath).pipe(res);
}

process.on('uncaughtException', () => {
});
server.on('error', () => {
});