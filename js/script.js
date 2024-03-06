function calcula_Ic(ib_current, gain) {
  return ib_current * gain;
}

//v_transistor irá variar conforme a aproximação
function calcula_Ib(r_base, vcc_base, v_transistor) {
  return (vcc_base - v_transistor)/r_base;
}

//calcula vce
function calcula_Vce(vcc_receptor, r_receptor, ic_current) {
  return vcc_receptor - r_receptor*ic_current;
}

//retorna corrente do emissor
function calcula_Ie(ib_current, ic_current) {
  return ib_current + ic_current;
}

let v_base = document.getElementById("v_base");
let v_receptor = document.getElementById("v_receptor");
let r_base = document.getElementById("r_base");
let r_receptor = document.getElementById("r_receptor");




