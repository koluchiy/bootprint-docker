var boot = require('bootprint');
var fs = require('fs');

if (process.argv.length < 3) {
  console.log('Usage: node.js run.js [swagger-file]');
  process.exit(1);
}

var target = '/bootprint/target';
var swagger = process.argv[2];

var outfile = 'out.html';

if (process.argv.length > 3) {
  outfile = process.argv[3];
}

// Load bootprint-swagger 
boot.load(require('bootprint-openapi'))
// Customize configuration, override any options 
.merge({ /* Any other configuration */})
// Specify build source and target 
.build(swagger, target)
// Generate swagger-documentation into "target" directory 
.generate()
.done(inlineCallback);

function inline(dir, target) {
  var inliner = require('html-inline');
  var inline = inliner({basedir: dir});

  var input = fs.createReadStream(dir + '/index.html');
  var output = fs.createWriteStream(target);


  input.pipe(inline).pipe(output);

  fs.readFile(target, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var minify = require('html-minifier').minify;
    var result = minify(data, {
      minifyCSS: true,
      minifyJS: true,
      preserveLineBreaks: true,
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true
    });

    fs.writeFile(target, result, function(err) {
      console.log(err);
    });
  });
}

function inlineCallback() {
  inline(target, '/tmp/bootprint/' + outfile);
}