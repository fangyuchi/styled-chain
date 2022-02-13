const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('del');
const ts = require('gulp-typescript');
const merge = require('merge2');

const tsProject = ts.createProject('./tsconfig.json');
const ESDIR = './es';
const LIBDIR = './lib';

gulp.task('clean', () => {
  return clean(['lib']);
});

gulp.task('cleanEs', () => {
  return clean(['es']);
});

function compileTs() {
  return tsProject.src()
    .pipe(tsProject());
}

function babelConfig(moduleType) {
  return {
    babelrc: false,
    presets: [
      ["@babel/preset-env", { "modules": moduleType }],
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-proposal-object-rest-spread",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-transform-classes",
    ]
  };
}

gulp.task('es', gulp.series('cleanEs', () => {
  const tsSream = compileTs();
  const jsStream = tsSream.js.pipe(babel(babelConfig(false))).pipe(gulp.dest(ESDIR));
  const tsdStream = tsSream.dts
    .pipe(gulp.dest(ESDIR));
  
  return merge(jsStream, tsdStream);
}));

gulp.task('lib', gulp.series('clean', () => {
  const tsSream = compileTs();
  const jsStream = tsSream.js.pipe(babel(babelConfig('commonjs'))).pipe(gulp.dest(LIBDIR));
  const tsdStream = tsSream.dts
    .pipe(gulp.dest(LIBDIR));
  
  return merge(jsStream, tsdStream);
}));

gulp.task('default', gulp.series('lib', 'es'));
