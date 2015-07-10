ndarray-matrix-vector-product
=============================
Dense [matrix-vector multiply](http://en.wikipedia.org/wiki/Matrix_multiplication) for [ndarrays](https://github.com/mikolalysenko/ndarray).

[![build status](https://secure.travis-ci.org/scijs/ndarray-matrix-vector-multiply.png)](http://travis-ci.org/scijs/ndarray-matrix-vector-multiply)

## Example

```javascript
var mvp = require("ndarray-matrix-vector-product")
var zeros = require("zeros")

//Initialize some vectors and a matrix
var x = zeros([16])
var M = zeros([16, 8])
var y = zeros([8])

M.set(1,2,  10.0)
y.set(2, 3)

//Multiply y by M storing result in x
mvp(x, M, y)
```

## Install
Install using [npm](https://www.npmjs.com/):

    npm install ndarray-matrix-vector-product

## API

#### `require("ndarray-matrix-vector-product")(out, M, y)`
Multiplies a matrix by a vector

* `out` is an 1D ndarray with shape `[n]`
* `M` is a 2D ndarray with shape `[n,m]`
* `v` is a 1D ndarray with shape `[m]`

## License
(c) 2013 Mikola Lysenko. MIT License
