function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.body.scrollLeft = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  document.documentElement.scrollLeft = 0; // For Chrome, Firefox, IE and Opera
}

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("topbtn").style.display = "block";
  } else {
    document.getElementById("topbtn").style.display = "none";
  }
}