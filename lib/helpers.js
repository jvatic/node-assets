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

// Remove ./ and ../ from path
exports.fsCleanupPath = function ( path ) {

  var parts = path.split('/');

  var new_parts = [];

  var _part;
  while ( _part = parts.pop() ) {

    // Ignore ./ as it's not needed
    if ( _part === '.' ) continue;

    // Take one more off the stack
    if ( _part === '..') {
      parts.pop();
      continue;
    }

    // Normal part, put it on the new stack
    new_parts.unshift( _part );

  }

  return new_parts.join('/');

}

exports.extendsClass = function( child, parent ) {

  // Copy all properties of parent to child
  for ( var key in parent ) {
    if ( parent.hasOwnProperty( key ) ) {
      child[key] = parent[key];
    }
  }

  // Child inherits prototype from parent
  function ctor() {
    this.constructor = child;
  }

  ctor.prototype = parent.prototype;

  child.prototype = new ctor();

  // Give child class access to parent class
  child.__super__ = parent.prototype;

  // Give parent class access to child classes
  if ( parent.__children__ == null ) {
    parent.__children__ = [];
  }

  parent.__children__.push( child );

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
