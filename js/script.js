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

//Entradas
let v_base = document.getElementById("v_base");
let v_receptor = document.getElementById("v_receptor");
let r_base = document.getElementById("r_base");
let r_receptor = document.getElementById("r_receptor");
let gain = document.getElementById("gain");
let aprox = document.getElementById("aproximacao");
let button = document.getElementById("button");

//Saidas
let ib_current = document.getElementById("base");
let ic_current = document.getElementById("receptor");
let ie_current = document.getElementById("emissor");
let tensao_ce = document.getElementById("tensao");

//Inicialização de valores
v_base.value = 0;
v_receptor.value = 0;
r_base.value = 0;
r_receptor.value = 0;
gain.value = 100;

button.addEventListener("click", () => {
  let ib = calcula_Ib(parseFloat(r_base.value), parseFloat(v_base.value), parseFloat(parseFloat(aprox.value)));
  let ic = calcula_Ic(ib, parseFloat(gain.value));
  let ie = calcula_Ie(ib, ic);
  let tensao = calcula_Vce(parseFloat(v_receptor.value), parseFloat(r_receptor.value), ic);
  
  ic_current.style.color = "white";

  ib_current.textContent = "Ib: " + ib*Math.pow(10, 6) + "µA";
  ic_current.textContent = "Ic: " + ic*Math.pow(10, 3) + "mA";
  ie_current.textContent = "Ie: " + ie*Math.pow(10,3) + "mA";
  tensao_ce.textContent = "Vce: " + tensao.toFixed(2) + "V";


  if(ic > v_receptor.value/r_receptor.value) {
    ic_current.style.color = "red";
  }
})

  
