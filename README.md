# node-assets

Simple asset concatination via comments.

## Usage

```shell
node-assets compile path/to/assets/dir path/to/another/dir path/to/output/dir
```

Accepts any number of input directories as arguments and a single output directory as the last argument.

```coffeescript
#= require path/to/file
```

```javascript
//= require_tree path/to/file
```

Supported directives:

name | description
---- | -----------
`require` | relative path to file
`require_tree` | relative path to directory
`require_self` | specifies where the contents of the current file should be placed (default is at the end)
