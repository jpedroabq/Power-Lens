//Torna a div do grafico arrastavel e redimensionavel

let query = "";

$(function () {
  $(".container").resizable({
    containment: "#parent",
    handles: "n, e, s, w, ne, se, sw, nw"
  }
  );
});

//Trava e destrava divs
let isMovable = false;

function lockDiv() {
  if (!isMovable) {
    document.getElementById('lock').style.visibility = "visible";
    document.getElementById('unlock').style.transition = "0s";
    document.getElementById('unlock').style.visibility = "hidden";
    document.getElementById('lock').style.transition = "0.5s";
    // Habilitar a movimentacao da div usando a biblioteca Draggable (ou qualquer outra de sua preferencia)
    $(".container").draggable({
      containment: "parent",
      handles: "n, e, s, w, ne, sw, nw"
    });
    
    isMovable = true;
    


  } else {
    document.getElementById('unlock').style.visibility = "visible";
    document.getElementById('lock').style.transition = "0s";
    document.getElementById('lock').style.visibility = "hidden";
    document.getElementById('unlock').style.transition = "0.5s";
    // Desabilitar a movimentacao da div
    $(".container").draggable("destroy");
    isMovable = false;
 
  }
}

const lockBtn = document.getElementById('lock');
const unlockBtn = document.getElementById('unlock');
unlockBtn.addEventListener('click', lockDiv)
lockBtn.addEventListener('click', lockDiv)

//Adiciona as divs invisiveis
let inputForm = document.getElementById('searchBtn');
let i = 1;
inputForm.addEventListener("click", (e) => {
  e.preventDefault();

  let input = document.getElementById('searchBar');

  if (input.value ==""){
    alert("Digite algo no campo de busca");
  } else {
    //torna a div # visï¿½vel
    let divName = "container" + i;
    document.getElementById(divName).style.visibility = "visible";

    console.log(input.value);
    query = input.value;
    input.value = "";
    i++;
  }
});

//Criação do seletor de graficos
c = 1

$(document).ready(function () {
  // Send a request to the Django backend to retrieve the graph data from the session
  $.get('power_lens/retrieve_graph/', function (data) {
    // Parse the received JSON data back to JavaScript objects
    const graphsList = data.graphs_list;

    // Loop through the list of graphs and render each one
    graphsList.forEach(function(graphData) {
      // Parse the received JSON data back to JavaScript objects
      const GraphData = JSON.parse(graphData.graph_data);
      const query = graphData.query;
      const g_type = graphData.g_type;
      const c_value = graphData.c_value;

      let divContainer = 'container' + c_value;
      console.log(divContainer);
      document.getElementById(divContainer).style.visibility = "visible";

      // Now create the Plotly graph using the retrieved data
      // You can use the search() function here with the retrieved query and g_type
      search(query, g_type, save = false, cvalue=c_value, graphData=GraphData);
    });
  });
});

function criarBotoes(query, c_value) {
  const divContainer = document.getElementById('container' + c_value);

  const botaoBarras = document.createElement('button');
  botaoBarras.textContent = 'Barras';
  botaoBarras.id = ('barras' + c_value);

  const botaoLinhas = document.createElement('button');
  botaoLinhas.textContent = 'Linhas';
  botaoLinhas.id = ('linhas' + c_value);

  const botaoTorta = document.createElement('button');
  botaoTorta.textContent = 'Torta';
  botaoTorta.id = ('torta' + c_value);

  const botaoTabela = document.createElement('button');
  botaoTabela.textContent = 'Tabela';
  botaoTabela.id = ('tabela' + c_value);

  divContainer.appendChild(botaoBarras);
  divContainer.appendChild(botaoLinhas);
  divContainer.appendChild(botaoTorta);
  divContainer.appendChild(botaoTabela);

  function removeBtns() {
    botaoBarras.remove();
    botaoLinhas.remove();
    botaoTabela.remove();
    botaoTorta.remove();
  }

 

  botaoBarras.addEventListener('click', function () {
    search(query, 'bar', save=true, cvalue=c_value);
    removeBtns();

  });

  botaoLinhas.addEventListener('click', function () {
    search(query, 'line', save=true, cvalue=c_value);
    removeBtns();
  });

  botaoTabela.addEventListener('click', function () {
    search(query, 'bar', save=true, cvalue=c_value);
    removeBtns();
  });

  botaoTorta.addEventListener('click', function () {
    search(query, 'bar', save=true, cvalue=c_value);
    removeBtns();
  });

}

// Function to retrieve the CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


// Search function
function search(query, g_type, save = true, cvalue = c, graphData = null) {
  if (graphData != null) {
    // trace
    var trace1 = {
      type: g_type,  // set the chart type
      x: graphData[0]['x'],  // x-axis values
      y: graphData[0]['y'],  // y-axis values
    };

    var layout = {
      title: query,  // chart title
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

    // control variable for div
    Plotly.newPlot('container'+cvalue, data, layout, config);

    $('#container'+cvalue).resizable({
      resize: function (event, ui) {
        Plotly.relayout('container'+cvalue, {
          width: ui.size.width,
          height: ui.size.height
        });
      }
    });
    c++;
  } else {
    const api_tunnel_url = document.getElementById('api_tunnel_url').textContent;
    $.get(api_tunnel_url + '/api/sql', { prompt: query }, function (data) {
      var keys = Object.keys(data[0])
      // trace
      var trace1 = {
        type: g_type,  // set the chart type
        x: data.map(function (item) { return item[keys[0]]; }),  // x-axis values
        y: data.map(function (item) { return item[keys[keys.length - 1]]; }),  // y-axis values
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

      // control variable for div
      Plotly.newPlot('container'+cvalue, data, layout, config);

      $('#container'+cvalue).resizable({
        resize: function (event, ui) {
          Plotly.relayout('container'+cvalue, {
            width: ui.size.width,
            height: ui.size.height
          });
        }
      });
      c++;

      if (save == true) {
        const graphJson = JSON.stringify(data);
        const csrftoken = getCookie('csrftoken'); // Function to get the CSRF token (see below)
        
        $.ajax({
          type: 'POST',
          url: 'power_lens/save_graph/', // URL to the Django view that handles saving the graph
          data: {
            'graph_data': graphJson,
            'query': query,
            'g_type': g_type,
            // Add any other data you need to save related to the graph
            'c_value': cvalue,
            'csrfmiddlewaretoken': csrftoken, // Include the CSRF token in the request
          },
          success: function (response) {
            console.log('Graph saved to session.');
          },
          error: function (error) {
            console.error('Error saving graph to session:', error);
          }
        });
      }
    });
  }
}

//Evento de clique no botÃ£o de busca
$('#searchBtn').on('click', function () {
  criarBotoes(query, c_value=c);
  c++; // Incrementa o contador de divs
});

$('#clearGraphsBtn').on('click', function () {
  const csrftoken = getCookie('csrftoken'); // Function to get the CSRF token (see below)

  $.ajax({
    type: 'POST',
    url: 'power_lens/clear_graphs/', // URL to the Django view that handles clearing graphs
    data: {
      'csrfmiddlewaretoken': csrftoken, // Include the CSRF token in the request
    },
    success: function (response) {
      console.log('Graphs cleared successfully.');
      // You may want to refresh the page or update the UI after clearing the graphs
    },
    error: function (error) {
      console.error('Error clearing graphs:', error);
    }
  });
});