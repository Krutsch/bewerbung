import babel from 'rollup-plugin-babel';
import gzipPlugin from 'rollup-plugin-gzip';
import {compress} from 'brotli';

const files = [
    'src/de_index.html',
    'src/en_index.html',
    'src/style.css'
];
export default {
    input: 'src/app.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        babel({
            'presets': ['minify'],
            'comments': false
        }),
        gzipPlugin({
            additionalFiles: files
        }),
        gzipPlugin({
            fileName: '.br',
            additionalFiles: files,
            customCompression: content => compress(Buffer.from(content))
        })
    ]
};