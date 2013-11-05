var Compiler = require('./compiler.js').Compiler;

var dirs = process.argv.slice(2);

var compiler = new Compiler( {
  output_dir: dirs.pop()
  asset_dirs: dirs,
} );

compiler.compileAssets();
