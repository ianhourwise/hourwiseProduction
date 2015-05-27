/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  
  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  'js/jquery-2.1.1.js',

  'js/dependencies/app.js',

  'js/bootstrap.min.js',

  'js/plugins/fullcalendar/moment.min.js',

  'js/plugins/metisMenu/jquery.metisMenu.js',

  'js/plugins/slimscroll/jquery.slimscroll.min.js',

  'js/plugins/peity/jquery.peity.min.js',
  
  'js/inspinia.js',

  'js/plugins/pace/pace.min.js',

  'js/plugins/jquery-ui/jquery-ui.min.js',

  'js/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',

  'js/plugins/jvectormap/jquery-jvectormap-world-mill-en.js',

  'js/plugins/easypiechart/jquery.easypiechart.js',

  'js/plugins/sparkline/jquery.sparkline.min.js',

  'js/plugins/iCheck/icheck.min.js',

  'js/plugins/fullcalendar/fullcalendar.min.js',

  'js/plugins/chosen/chosen.jquery.js',

  'js/plugins/jsKnob/jquery.knob.js',

  'js/plugins/jasny/jasny-bootstrap.min.js',

  'js/plugins/datapicker/bootstrap-datepicker.js',

  'js/plugins/nouslider/jquery.nouislider.min.js',

  'js/plugins/switchery/switchery.js',

  'js/plugins/ionRangeSlider/ion.rangeSlider.min.js',

  'js/plugins/metisMenu/jquery.metisMenu.js',

  'js/plugins/colorpicker/bootstrap-colorpicker.min.js',

  'js/plugins/cropper/cropper.min.js'

  // Dependencies like jQuery, or Angular are brought in here
  //'js/dependencies/**/*.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  //'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
