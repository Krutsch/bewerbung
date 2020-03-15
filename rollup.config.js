import babel from "rollup-plugin-babel";

export default {
    input: "src/app.js",
    output: {
        file: "src/bundle.js",
        format: "iife"
    },
    plugins: [
        babel({
            presets: ["minify"],
            comments: false
        })
    ]
};
