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
