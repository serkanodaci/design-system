/**
 * @file The build tasks handle compiling and optimizing both the
 *  package assets and the documentation site. Essentially makes
 *  everything production-ready.
 */
const babel = require('gulp-babel');
const cleanDist = require('./common/cleanDist');
const copyAssets = require('./common/copyAssets');
const count = require('gulp-count');
const gulp = require('gulp');
const streamPromise = require('./common/streamPromise');
const { compileSass } = require('./sass');
const { getSourceDirs } = require('./common/getPackageDirs');
const { log, logTask } = require('./common/logUtil');
const { CORE_SOURCE_PACKAGE } = require('./common/constants');

/**
 * Copy any JSON files that our components might depend on
 */
function copyJson(dir) {
  return streamPromise(
    gulp
      .src([`${dir}/src/**/*.json`, `!${dir}/src/**/{__mocks__,__tests__}/*.json`])
      .pipe(gulp.dest(`${dir}/dist`))
  );
}

/**
 * Copy Sass files from src to dist because we don't distribute the src folder
 */
function copySass(dir) {
  return streamPromise(
    gulp
      .src([`${dir}/src/**/*.{scss,sass}`, `!${dir}/src/**/*.docs.{scss,sass}`])
      .pipe(gulp.dest(`${dir}/dist`))
  );
}

async function copyAll(dir) {
  const sources = await getSourceDirs(dir);
  const copyTasks = [copyJson(dir), copySass(dir)].concat(sources.map(s => copyAssets(s)));

  if (sources.length > 1) {
    // If this a child DS we also need to copy assets from the core npm package
    logTask('🖼 ', `Copying fonts and images from ${CORE_SOURCE_PACKAGE} to ${dir}`);
  }

  return Promise.all(copyTasks);
}

/**
 * Transpile design system React components.
 *  Note: If you're running a dev server and try to use a newly
 *  babelfied React component in the docs site, you need to run
 *  this task first, otherwise the component won't be found.
 */
function compileJs(dir) {
  return streamPromise(
    gulp
      .src([
        `${dir}/src/**/*.{js,jsx}`,
        `!${dir}/src/**/{__mocks__,__tests__}/*.{js,jsx}`,
        `!${dir}/src/**/*.example.{js,jsx}`,
        `!${dir}/src/**/*.test.{js,jsx}`,
        `!${dir}/src/helpers/e2e/*.{js,jsx}`
      ])
      .pipe(babel())
      .pipe(
        count({
          message: `## JS files processed in ${dir}`,
          logger: message => logTask('📜 ', message)
        })
      )
      .pipe(gulp.dest(`${dir}/dist`))
  );
}

module.exports = {
  /**
   * Builds just the source package for the purpose of publishing
   */
  async buildSrc(sourcePackageDir) {
    logTask('🏃 ', 'Starting design system build task');
    await cleanDist(sourcePackageDir);
    await copyAll(sourcePackageDir);
    await compileJs(sourcePackageDir);
    await compileSass(sourcePackageDir);
    logTask('✅ ', 'Build succeeded');
    log('');
  }
};