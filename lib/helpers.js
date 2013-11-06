var fs = require('fs');

exports.escapeRegExp = function ( string ) {
  return string.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1" );
}

exports.bindFunctionToScope = function ( fn, me ) {
  return function () {
    return fn.apply( me, arguments );
  }
}

exports.fsJoinPaths = function () {
  var parts = [];

  for ( var i = 0, _len = arguments.length; i < _len; i++ ) {
    parts.push( arguments[i] );
  }

  return parts.join('/')
}

exports.extendsClass = function( child, parent ) {

  for ( var key in parent ) {
    if ( parent.hasOwnProperty( key ) ) {
      child[key] = parent[key];
    }
  }

  function ctor() { this.constructor = child; }

  ctor.prototype = parent.prototype;

  child.prototype = new ctor();

  child.__super__ = parent.prototype;

  return child;

}

exports.fsEachLine = function ( file_path, callback ) {
  var BLOCK_SIZE = 2;

  var LINEBREAK_REGEX = /(\r\n)|\r|\n/;

  var buffer = new Buffer(BLOCK_SIZE);

  var file_descriptor = fs.openSync( file_path, 'r' );

  var read_offset = 0;

  var lines;

  var last_line = '';

  var _bytes;

  var running = true;

  var stop = function () {
    running = false;
  }

  while ( running && ( _bytes = fs.readSync( file_descriptor, buffer, 0, BLOCK_SIZE, read_offset ) ) ) {
    read_offset += _bytes;

    lines = buffer.toString( 'utf8', 0, _bytes ).split( LINEBREAK_REGEX )

    // Make sure we always have the full line
    lines[0] = last_line + lines[0];
    last_line = lines.pop();

    for ( var i = 0, _len = lines.length; i < _len; i++ ) {
      callback( lines[i], stop );
    }
  }

}
