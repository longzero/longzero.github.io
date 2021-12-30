const filelist = require('gulp-filelist'); // To list files
const fs = require("fs"); // To list files

const gulp = require('gulp');
const clean = require('gulp-clean');
const jsonConcat = require('gulp-json-concat');
const markdownToJSON = require('gulp-markdown-to-json'); // https://www.npmjs.com/package/gulp-markdown-to-json
const markdown = require('gulp-markdown');
const marked = require('marked');
const path = require("path"); // To list files
const pug = require('gulp-pug-3'); // Template engine https://github.com/pugjs/pug
const stylus = require('gulp-stylus'); // CSS preprocessor

// https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
// const getAllFiles = function(dirPath, arrayOfFiles) {
//   files = fs.readdirSync(dirPath)
//   arrayOfFiles = arrayOfFiles || []
//   files.forEach(function(file) {
//     if (fs.statSync(dirPath + "/" + file).isDirectory()) {
//       arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
//     } else {
//       arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
//     }
//   })
//   return arrayOfFiles
// }



// ARTICLES
marked.setOptions({
  breaks: true,
  smartypants: true
});
gulp.task('articles', () =>
  gulp.src('src/html/articles/**/*.md')
    .pipe(markdownToJSON(marked)) // Convert md files to json files
    // .pipe(gulp.dest('html/data/articles'))
    .pipe(jsonConcat('articles.json',function(data){ // merge json files
      // console.log(data)
      for (const key in data) {
        // console.log(data[key].status)
        if (data[key].status === 1) return new Buffer.from(JSON.stringify(data));
      }
    }))
    .pipe(clean())
    .pipe(gulp.dest('html/data'))
);

// CSS
gulp.task('styles', () =>
  gulp.src('src/css/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('html/css/'))
);

// HTML
gulp.task('html', () =>
  gulp.src('src/html/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('html'))
);

// LIST PHOTOS
// gulp.task('photos', () =>
//   gulp.src(getAllFiles('./html/photos/'))
//     .pipe(filelist('photos.json'))
//     .pipe(gulp.dest('html/data'))
// );

// MARKDOWN
gulp.task('markdown', () =>
  gulp.src('src/html/articles/**/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('html/articles'))
);

// WATCH
// gulp.task('watch', gulp.series('styles', 'html', 'photos', (done) => {
gulp.task('watch', gulp.series('styles', 'html', (done) => {
  gulp.watch('src/html/articles/**/*.md', gulp.parallel('articles'));
  gulp.watch('src/css/**/*.styl', gulp.parallel('styles'));
  gulp.watch('src/html/**/*.pug', gulp.parallel('html'));
}));

// TASKS
// Bundled tasks
gulp.task('default', gulp.series('styles', 'articles', 'html'));
