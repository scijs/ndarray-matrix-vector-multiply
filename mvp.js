"use strict"

module.exports = matrixVectorProduct

function generateGetter(type, data, index) {
  if(type === "generic") {
    return [ data, ".get(", index, ")" ].join("")
  } else {
    return [ data, "[", index, "]" ].join("")
  }
}

function generateSetter(type, data, index, value) {
  if(type === "generic") {
    return [ data, ".set(", index, ",", value, ")" ].join("")
  } else {
    return [ data, "[", index, "]=", value ].join("")
  }
}

function generateProduct(rowMajor, typesig) {
  var funcName = ["matrixVectorProd", rowMajor ? "RowMajor" : "ColumnMajor", typesig.join("t")].join("")
  var code = ["function ", funcName, "(o,m,v){\
var o_d=o.data,o_i=o.offset,o_s=o.stride[0],\
m_d=m.data,m_i=m.offset,m_s0=m.stride[0],m_s1=m.stride[1],\
v_d=v.data,v_i=v.offset,v_s=v.stride[0],r=m.shape[0],c=m.shape[1],"]
  if(rowMajor) {
    code.push(
"s1=m_s0-m_s1*r;for(var j=0;j<c;++j){\
var v_p=v_i,x=0;\
for(var i=0;i<r;++i){\
x+=", generateGetter(typesig[1], "m_d", "m_i"), "*", generateGetter(typesig[2], "v_d", "v_p"), ";\
v_p+=v_s;\
m_i+=m_s1;\
}",
generateSetter(typesig[0], "o_d", "o_i", "x"), ";\
o_i+=o_s;\
m_i+=s1;\
}")
  } else {
    code.push("o_p=o_i;for(var i=0;i<r;++i){", 
generateSetter(typesig[0], "o_d", "o_p", "0"), ";\
o_p+=o_s}\
var s0=m_s1-m_s0*c;for(var j=0;j<r;++j){\
o_p=o_i;",
"var x=", generateGetter(typesig[2], "v_d", "v_i"), ";\
for(var i=0;i<c;++i){")
    if(typesig[0] === "generic") {
      code.push("o_d.set(o_p,o_d.get(o_p)+x*", generateGetter(typesig[1], "m_d", "m_i"), ";")
    } else {
      code.push("o_d[o_p]+=", generateGetter(typesig[1], "m_d", "m_i"), "*x;")
    }
    code.push("m_i+=m_s0;\
o_p+=o_s;\
}\
m_i+=s0;\
v_i+=v_s;\
}")
  }
  code.push("}return ", funcName, ";")
  
  //Compile result
  var proc = new Function(code.join(""))
  return proc()
}

var ROW_CACHE = {}
var COLUMN_CACHE = {}

function matrixVectorProduct(out, m, v) {
  var cache
  if(m.stride[0] > m.stride[1]) {
    cache = ROW_CACHE
  } else {
    cache = COLUMN_CACHE
  }
  var a = cache[out.dtype]
  if(!a) {
    cache[out.dtype] = a = {}
  }
  var b = a[m.dtype]
  if(!b) {
    a[m.dtype] = b = {}
  }
  var c = b[v.dtype]
  if(!c) {
    b[v.dtype] = c = generateProduct(m.stride[0] > m.stride[1], [out.dtype, m.dtype, v.dtype])
  }
  c(out,m,v)
}