
// script.js
const searchInput = document.getElementById("search");

searchInput.addEventListener("keyup", function () {
  let input = searchInput.value.toLowerCase();
  let books = document.getElementsByClassName("book");

  for (let i = 0; i < books.length; i++) {
    let text = books[i].innerText.toLowerCase();
    if (text.includes(input)) {
      books[i].style.display = "block";
    } else {
      books[i].style.display = "none";
    }
  }
});