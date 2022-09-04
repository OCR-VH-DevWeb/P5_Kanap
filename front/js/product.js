console.log("page produit");
//-----------------------------------------------------------------------------------//

/**
 * Import function addToCart from cart.js
 * @param {string} idProduct - l'identifiant du produit
 * @param {string} colorProduct - la couleur du produit
 * @param {number} quantityProduct - la quantité souhaitée et limitée entre 1 à 100
 */
import { addToCart } from "./cart.js";

let url = new URL(window.location);
let id = url.searchParams.get("id");
console.log(id);

// récupération des infos d'un produit
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    showProduct(product);
  })
  .catch(function (err) {
    // Une erreur est survenue
  });
//-----------------------------------------------------------------------------------//

/**
 * Afficher le produit avec description et options de personnalisation
 * @param {*} product
 */
function showProduct(product) {
  let divImage = document.querySelector(".item__img");

  const img = document.createElement("img");
  img.src = product.imageUrl; // attribuer sa src
  img.alt = product.altTxt; // attribuer son alt

  divImage.appendChild(img);

  const h1Title = document.getElementById("title");
  h1Title.innerText = product.name;

  const spanPrice = document.getElementById("price");
  const formatedPrice = new Intl.NumberFormat("fr-FR").format(product.price);
  spanPrice.innerText = formatedPrice;

  const pDescription = document.getElementById("description"); // renseigner description
  pDescription.innerText = product.description;

  const selectColor = document.getElementById("colors");

  for (let color of product.colors) {
    const option = document.createElement("option");
    option.innerText = color;
    option.value = color;
    selectColor.appendChild(option);
  }
}

const alertClick = document.getElementById("addToCart");
alertClick.addEventListener("click", function () {
  const confirmedColor = document.getElementById("colors").value;
  const confirmedQuantity = document.getElementById("quantity").value;

  let checkCart = true;
  if (confirmedColor == "") {
    window.alert("Veuillez renseigner la couleur pour commander, merci");
    checkCart = false;
  }
  if (confirmedQuantity < 1 || confirmedQuantity > 100) {
    window.alert("Veuillez renseigner la quantité pour commander, merci");
    checkCart = false;
  }
  if (checkCart == true) {
    addToCart(id, confirmedColor, confirmedQuantity);
  }
});
