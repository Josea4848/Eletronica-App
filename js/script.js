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
v_base.value = 5;
v_receptor.value = 15;
r_base.value = 1000;
r_receptor.value = 10000;
gain.value = 100;

button.addEventListener("click", () => {
  let ib = calcula_Ib(parseFloat(r_base.value), parseFloat(v_base.value), parseFloat(parseFloat(aprox.value)));
  let ic = calcula_Ic(ib, parseFloat(gain.value));
  let ie = calcula_Ie(ib, ic);
  let tensao = calcula_Vce(parseFloat(v_receptor.value), parseFloat(r_receptor.value), ic);
  
  ic_current.style.color = "white";
  tensao_ce.style.color = "white";

  ib_current.textContent = "Ib: " + ib*Math.pow(10, 6).toFixed(2) + "µA";
  ic_current.textContent = "Ic: " + ic*Math.pow(10, 3).toFixed(2) + "mA";
  ie_current.textContent = "Ie: " + ie*Math.pow(10,3).toFixed(2) + "mA";
  tensao_ce.textContent = "Vce: " + tensao.toFixed(2) + "V";


  if(ic > v_receptor.value/r_receptor.value) {
    ic_current.style.color = "red";
    tensao_ce.style.color = "red";
  }

})

  
//Gráficos

const rand = (x) => (v_receptor.value - x)*1000/r_receptor.value;

var x = [0, v_receptor.value];

const new_data = (trace) => Object.assign(trace, {y: x.map(rand)});

// add random data to three line traces
var data = [
  {mode:'lines', line: {color: "#b55400"}}, 
].map(new_data);

var layout = {
  title: 'Gráfico V x I',
  uirevision:'true',
  xaxis: {autorange: true},
  yaxis: {autorange: true}
};

Plotly.react(graphDiv, data, layout);

var myPlot = document.getElementById('graphDiv');

var cnt = 0;
var interval = setInterval(function() {
  data = data.map(new_data);

  // user interation will mutate layout and set autorange to false
  // so we need to reset it to true
  layout.xaxis.autorange = true;
  layout.yaxis.autorange = true;
  
  // not changing uirevision will ensure that user interactions are unchanged
  // layout.uirevision = rand();
  
  Plotly.react(graphDiv, data, layout);
  if(cnt === 100) clearInterval(interval);
}, 2500);

