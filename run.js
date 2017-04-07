var boot = require('bootprint');
var fs = require('fs');

var target = '/bootprint/target';

if (process.argv.length < 3) {
  console.log('Usage: node.js run.js [swagger-file]');
  process.exit(1);
}

// Load bootprint-swagger 
boot.load(require('bootprint-openapi'))
// Customize configuration, override any options 
.merge({ /* Any other configuration */})
// Specify build source and target 
.build(process.argv[2], target)
// Generate swagger-documentation into "target" directory 
.generate()
.done(inlineCallback);

function inline(dir, target) {
  var inliner = require('html-inline');
  var inline = inliner({basedir: dir});

  var input = fs.createReadStream(dir + '/index.html');
  var output = fs.createWriteStream(target);


  input.pipe(inline).pipe(output);
}

function inlineCallback() {
  inline(target, '/tmp/bootprint/out.html');
}