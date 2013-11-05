"use strict"

var ndarray = require("ndarray")
var mvp = require("../mvp.js")

function DummyArray(n) {
  this.length = n
  this.data = new Float64Array(n)
}
DummyArray.prototype.get = function(i) {
  return this.data[i]
}
DummyArray.prototype.set = function(i, v) {
  return this.data[i] = v
}

require("tape")(function(t) {

  //Validate matrix multiply
  function validateArray(out, m, v, type) {
    for(var i=0; i<16; ++i) {
      for(var j=0; j<16; ++j) {
        m.set(i,j, 0.0)
      }
    }
    for(var i=0; i<16; ++i) {
      y.set(i, i+1)
    }
    for(var i=0; i<16; ++i) {
      for(var j=0; j<16; ++j) {
        m.set(i,j,1.0)
        mvp(x, m, y)
        m.set(i,j,0.0)
        for(var k=0; k<16; ++k) {
          if(k === i) {
            t.equals(x.get(k), j+1, type + ":(" + i + "," + j + ")-" + k)
          } else {
            t.equals(x.get(k), 0.0, type + ":(" + i + "," + j + ")-" + k)
          }
        }
      }
    }
  }

  //Dense/row major
  var x = ndarray(new Float64Array(16))
  var y = ndarray(new Float64Array(16))
  var m = ndarray(new Float64Array(256), [16,16])
  validateArray(x, m, y, "dense/rowmajor")

  //Dense/column major
  validateArray(x, m.transpose(1,0), y, "dense/colmajor")

  //Sparse/row major
  var p = ndarray(new DummyArray(256), [16,16])
  validateArray(x, p, y, "sparse/rowmajor")

  //Sparse/column major
  validateArray(x, p.transpose(1,0), y, "sparse/colmajor")

  t.end()
})