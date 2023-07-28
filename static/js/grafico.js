//Torna a div do gráfico arrastável e redimensionável
$(function () {
  $(".container").draggable({
    containment: "parent",
    handles: "n, e, s, w, ne, sw, nw"
  });
});
$(function () {
  $(".container").resizable({
    containment: "#parent",
    handles: "n, e, s, w, ne, se, sw, nw"
  }
  );
});


//Adiciona as divs invisíveis
let inputForm = document.getElementById('searchBtn');
let i = 1;
inputForm.addEventListener("click", (e) => {
  e.preventDefault();

  let input = document.getElementById('searchBar');

  if (input.value ==""){
    alert("Digite algo no campo de busca");
  } else {
    //torna a div # visível
    let divName = "container" + i;
    document.getElementById(divName).style.visibility = "visible";

    console.log(input.value);
    input.value = "";
    i++;
  }
});

//Criação do seletor de gráficos
c = 1
function criarBotoes(query) {
  const divContainer = document.getElementById('container' + c);

  const botaoBarras = document.createElement('button');
  botaoBarras.textContent = 'Barras';
  botaoBarras.id = ('barras' + c);

  const botaoLinhas = document.createElement('button');
  botaoLinhas.textContent = 'Linhas';
  botaoLinhas.id = ('linhas' + c);

  const botaoTorta = document.createElement('button');
  botaoTorta.textContent = 'Torta';
  botaoTorta.id = ('torta' + c);

  const botaoTabela = document.createElement('button');
  botaoTabela.textContent = 'Tabela';
  botaoTabela.id = ('tabela' + c);

  divContainer.appendChild(botaoBarras);
  divContainer.appendChild(botaoLinhas);
  divContainer.appendChild(botaoTorta);
  divContainer.appendChild(botaoTabela);

  botaoBarras.addEventListener('click', function () {
    search(query, 'bar');
  });

  botaoLinhas.addEventListener('click', function () {
    search(query, 'line');
  });

  botaoTabela.addEventListener('click', function () {
    search(query, 'bar');
  });

  botaoTorta.addEventListener('click', function () {
    search(query, 'bar');
  });

  c++;
}


// Search function
function search(query, g_type) {
  $.get('http://127.0.0.1:5000/api/sql', { prompt: query }, function (data) {

    // trace
    var trace1 = {
      type: g_type,  // set the chart type
      x: data.map(function (item) { return item.FirstName; }),  // x-axis values
      y: data.map(function (item) { return item.QuantitySold; }),  // y-axis values
    };

    var layout = {
      title: 'Quantidade de vendas por cliente',  // chart title
      xaxis: {
        title: 'X axis',  // x-axis label
      },
      yaxis: {
        title: 'Y axis',  // y-axis label
      }
    };

    var data = [trace1];

    var config = {
      responsive: true,
      editable: true, // Allow the graph to be dragged and resized
    };

    Plotly.newPlot('container1', data, layout, config);

    $('#container1').resizable({
      resize: function (event, ui) {
        Plotly.relayout('container1', {
          width: ui.size.width,
          height: ui.size.height
        });
      }
    });
  });
}


//Evento de clique no botão de busca
$('#searchBtn').on('click', function () {
  var query = $('#searchBar').val();
  criarBotoes(query);
  //search(query); // Chama a função de busca (api)
});