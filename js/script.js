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

function calcula_vb (r1, r2, v_base) {
  return r2/(r1+r2)*v_base;
}

//Entradas
let v_base = document.getElementById("v_base");
let v_receptor = document.getElementById("v_receptor");
let r_base = document.getElementById("r_base");
let r_receptor = document.getElementById("r_receptor");
let gain = document.getElementById("gain");
let aprox = document.getElementById("aproximacao");
let button = document.getElementById("button");
let res_option = document.getElementById("pos_res");
let r_base1 = document.getElementById("r_base1");
let r_base2 = document.getElementById("r_base2");
let r_emissor = document.getElementById("r_emissor");
let tensao;
//imagem
let circuit_image = document.getElementById("circuito");
var myChart;

//Saidas
let ib_current = document.getElementById("base");
let ic_current = document.getElementById("receptor");
let ie_current = document.getElementById("emissor");
let tensao_ce = document.getElementById("tensao");
let saida_r1 = document.getElementById("r_base1_out");
let saida_r2 = document.getElementById("r_base2_out");
let saida_emissor = document.getElementById("r_emissor_out");
let saida_r  = document.getElementById("r_base_out");

//Inicialização de valores
v_base.value = 5;
v_receptor.value = 15;
r_base.value = 1000;
r_receptor.value = 10000;
gain.value = 100;
r_base1.hidden = true;
r_base2.hidden = true;
r_emissor.hidden = true;
r_base.hidden = false;
saida_emissor.hidden = true;
saida_r.hidden = false;
saida_r1.hidden = true;
saida_r2.hidden = true;
res_option.value = "base";

res_option.addEventListener("change", () => {
  //resistor na base
  if (res_option.value == "base") {
    r_base1.hidden = true;
    r_base2.hidden = true;
    r_emissor.hidden = true;
    r_base.hidden = false;
    saida_emissor.hidden = true;
    saida_r.hidden = false;
    saida_r1.hidden = true;
    saida_r2.hidden = true;
    circuit_image.style.backgroundImage =  'url("https://raw.githubusercontent.com/Josea4848/Eletronica-App/master/images/Rb.jpg")';
  } 
  //resistor no emissor
  else if (res_option.value == "emissor") {
    r_base1.hidden = true;
    r_base2.hidden = true;
    r_emissor.hidden = false;
    r_base.hidden = true;
    saida_emissor.hidden = false;
    saida_r.hidden = true;
    saida_r1.hidden = true;
    saida_r2.hidden = true;
    circuit_image.style.backgroundImage = 'url("https://raw.githubusercontent.com/Josea4848/Eletronica-App/master/images/remissor.jpg")';
  } 
  //resistor na base e no emissor 
  else {
    r_base1.hidden = false;
    r_base2.hidden = false;
    r_emissor.hidden = false;
    r_base.hidden = true;
    saida_emissor.hidden = false;
    saida_r.hidden = true;
    saida_r1.hidden = false;
    saida_r2.hidden = false;
    circuit_image.style.backgroundImage =  'url("https://raw.githubusercontent.com/Josea4848/Eletronica-App/master/images/divisor.jpg")';
  }
});

button.addEventListener("click", () => {
  if(res_option.value == "base") {
    let ib = calcula_Ib(parseFloat(r_base.value), parseFloat(v_base.value), parseFloat(parseFloat(aprox.value)));
    let ic = calcula_Ic(ib, parseFloat(gain.value));
    let ie = calcula_Ie(ib, ic);
    tensao = calcula_Vce(parseFloat(v_receptor.value), parseFloat(r_receptor.value), ic);
    r_emissor.value = 0;
    ic_current.style.color = "white";
    tensao_ce.style.color = "white";

    ib_current.textContent = "Ib: " + (ib*Math.pow(10, 6)).toFixed(2) + "µA";
    ic_current.textContent = "Ic: " + (ic*Math.pow(10, 3)).toFixed(2) + "mA";
    ie_current.textContent = "Ie: " + (ie*Math.pow(10,3)).toFixed(2) + "mA";
    tensao_ce.textContent = "Vce: " + tensao.toFixed(2) + "V";
    if(ic > v_receptor.value/r_receptor.value) {
      ic_current.textContent += " (Saturação)";
      ic_current.style.color = "red";
      tensao_ce.style.color = "red";
    }

    mostraGraph(tensao, ic);
  }

  else if (res_option.value == "e_divisor") {
    let ie = (calcula_vb(parseFloat(r_base1.value), parseFloat(r_base2.value), v_base.value)- 0.7)/r_emissor.value;
    let tensao = calcula_Vce(parseFloat(v_receptor.value), parseFloat(Number(r_receptor.value) + Number(r_emissor.value)), ie); 
    let ib = (parseFloat(v_base.value))/(Number(r_base1.value)+Number(r_base2.value));

    ic_current.style.color = "white";
    tensao_ce.style.color = "white";

    ib_current.textContent = "Ib: " + 0  + "µA";
    ic_current.textContent = "Ic: " + (ie*Math.pow(10, 3)).toFixed(2) + "mA";
    ie_current.textContent = "Ie: " + (ie*Math.pow(10,3)).toFixed(2) + "mA";
    tensao_ce.textContent = "Vce: " + tensao.toFixed(2) + "V";


    if(ic > 1000*v_receptor.value/(r_receptor.value+r_emissor.value)) {
      ic_current.style.color = "red";
      tensao_ce.style.color = "red";
      ic_current.textContent += " (Saturação)";
    }
    
  } 
  else {
    let ie = calcula_Ib(parseFloat(r_emissor.value), parseFloat(v_base.value), parseFloat(aprox.value));
    
    let ic = ie;
    let tensao = calcula_Vce(parseFloat(v_receptor.value), parseFloat(Number( r_receptor.value) + Number(r_emissor.value)), ic); 

    ic_current.style.color = "white";
    tensao_ce.style.color = "white";

    ib_current.textContent = "Ib: " + 0 + "µA";
    ic_current.textContent = "Ic: " + (ic*Math.pow(10, 3)).toFixed(2) + "mA";
    ie_current.textContent = "Ie: " + (ie*Math.pow(10,3)).toFixed(2) + "mA";
    tensao_ce.textContent = "Vce: " + tensao.toFixed(2) + "V";


    if(ic > 1000*v_receptor.value/(r_receptor.value+r_emissor.value)) {
      ic_current.style.color = "red";
      tensao_ce.style.color = "red";
      ic_current.textContent += " (Saturação)";
    }

  }});

  


function mostraGraph(vce, ic) {
  //Gráficos
calculaI = (tensao) => (Number(v_receptor.value) - tensao)/(Number(r_receptor.value)+Number(r_emissor.value))*1000;

// Valores de exemplo para x e y
const valoresX = [0, Number(v_receptor.value)];
const valoresY = valoresX.map(calculaI);
  // Configuração dos dados
const data = {
  labels: valoresX,
  datasets: [{
      label: 'V(V) x I(mA)',
      data: valoresY,
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      fill: false
  }, 
  {
    label: 'Ponto Q',
    data: [{ x: vce, y: ic*1000 }],
    backgroundColor: 'red',
    pointRadius: 5,
    pointHoverRadius: 7,
    type: 'scatter'
}]
};

// Configuração do gráfico
const config = {
  type: 'line',
  data: data,
  options: {
      scales: {
          x: {
              type: 'linear',
              position: 'bottom', 
              ticks: {
                stepSize: 1, // Define o intervalo entre os valores do eixo x
                precision: 0 // Remove a precisão decimal dos valores do eixo x
            }
          },
          y: {
              type: 'linear',
              position: 'left'
          }
      }
  }
};

// Se o gráfico já foi criado, atualize-o
if (myChart) {
  myChart.data = data;
  myChart.update();
} else {
  // Se o gráfico ainda não foi criado, crie-o
  myChart = new Chart(document.getElementById("myChart"), config);
}
  }

