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