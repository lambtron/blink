
/**
 * Module dependencies.
 */

var render = require('../lib/render');

/**
 * Render index html page.
 */

exports.index = function *index() {
  this.body = yield render('index');
};
