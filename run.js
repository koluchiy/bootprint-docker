var bootprint = require('bootprint');
var fs = require('fs');
var path = require('path');

var params = getArgs(process.argv.slice(2));

// Load bootprint-swagger 
bootprint.load(require('bootprint-openapi'))
// Customize configuration, override any options 
.merge({ /* Any other configuration */})
// Specify build source and target 
.build(params.swagger, params.tmp)
// Generate swagger-documentation into "target" directory 
.generate(params)
.done(inlineCallback);

function inline(dir, target) {
  var inliner = require('html-inline');
  var inline = inliner({basedir: dir});

  var input = fs.createReadStream(dir + '/index.html');
  var output = fs.createWriteStream(target);

  input.pipe(inline).pipe(output);

  fs.readFile(target, 'utf8', function (err, data) {
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
  inline(params.tmp, params.outfile);
}

function getArgs(args) {
  console.log(args);
  var result = {
    mode: "local",
    outfile: "out.html",
    tmp: "tmp"
  };

  var map = {
    '-s': 'swagger',
    '-m': 'mode',
    '-o': 'outfile',
    '-tmp': 'tmp'
  };

  for (var i=0; i<args.length; i++) {
    if (map.hasOwnProperty(args[i]) && args.length > i+1) {
      result[map[args[i]]] = args[i+1];
      i++;
    } else {
      console.log('bad');
      throw new Error("Bad parameters");
    }
  }

  if (result.mode != 'docker' && result.mode != 'local') {
    throw new Error("Mode can be docker or local");
  }

  if (result.mode == 'docker') {
    result.tmp = '/tmp/bootprint'
  }

  if (result.mode == 'docker') {
    if(!path.isAbsolute(result.outfile)) {
      result.outfile = result.tmp + '/' + result.outfile;
    }
  }

  return result;
}