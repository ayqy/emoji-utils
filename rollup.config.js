// Rollup plugins
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const ENV = JSON.stringify(process.env.NODE_ENV || 'development');
// es, umd
const BUILD_FORMAT = process.env.BUILD_FORMAT;

let babelOpts = {
  "plugins": [
    // Stage 0
    "@babel/plugin-proposal-function-bind",

    // Stage 1
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-logical-assignment-operators",
    ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
    "@babel/plugin-proposal-do-expressions",

    // Stage 2
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",

    // Stage 3
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
    "@babel/plugin-proposal-json-strings"
  ],
  presets: [],
  exclude: 'node_modules/**'
};
if (BUILD_FORMAT === 'umd') {
  babelOpts.presets.push(["@babel/env", {
    "targets": {
      // The % refers to the global coverage of users from browserslist
      "browsers": [ ">0.25%", "not ie 11", "not op_mini all"]
    }
  }]);
}
let format = BUILD_FORMAT || 'es';
let opts = {
  input: 'emoutils.js',
  output: {
    name: 'emojiUtils',
    file: ENV === '"production"' ? `dist/${format}/emoutils.js` : `dist/${format}/emoutils.dev.js`,
    format,
    sourcemap: 'true'
  },
  plugins: [
    eslint({
      parser: 'babel-eslint',
      include: ['emoutils.js', 'test.js'],
      exclude: [
        'node_modules/**'
      ]
    }),
    babel(babelOpts)
  ],
};

if (process.env.MINIFY) {
  opts.plugins.push(uglify({}, minify));
  opts.output.file = opts.output.file.replace(/\.js$/, '.min.js');
}

export default opts;
