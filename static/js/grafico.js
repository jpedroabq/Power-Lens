//Torna a div do gráfico arrastável e redimensionável

$(function () {
  $("#container").draggable({
    containment: "parent"
  });
});

$(function () {
  $("#container").resizable({
    containment: "#parent",
    handles: "n, e, s, w, ne, se, sw, nw"
  }
  );
});


let inputForm = document.getElementById('inputForm');

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let input = document.getElementById('input');

  if (input.value ==""){
    alert("Digite algo no campo de busca");
  } else {
    //torna a div visível
    document.getElementById("container").style.visibility = "visible";

    console.log(input.value);
    input.value = "";
  }
});