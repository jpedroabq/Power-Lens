//Torna a div do gráfico arrastável e redimensionável

$(function () {
  $(".container").draggable({
    containment: "parent"
  });
});

$(function () {
  $(".container").resizable({
    containment: "#parent",
    handles: "n, e, s, w, ne, se, sw, nw"
  }
  );
});


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