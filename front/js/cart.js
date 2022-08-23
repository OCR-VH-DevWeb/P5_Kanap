console.log("page panier");
//-----------------------------------------------------------------------------------//
cart();
// quand utilisateur clique sur "Ajouter au panier", on lui passe les paramètres (id/color/quantity) (récupéré de page product)
export function addToCart(idProduct, colorProduct, quantityProduct) {
  // on crée un objet cartLine avec paramètres, la variable cartLine contient un objet
  let cartLine = {
    id: idProduct,
    color: colorProduct,
    quantity: parseInt(quantityProduct), // parseInt pour avoir quantité en nombre entier si veut décimal parseFloat
  };
  // on récupère la panier localStorage dans la variable cart (panier en mémoire)
  let cart = getCart(); //récupère un tableau vide ou un tableau d'objet de produit
  // on va chercher dans localStorage (panier en mémoire) si un produit avec même id et même color existe. On compare la panier mémoire avec saisie utilisateur
  let index = cart.findIndex(
    (p) => p.id == idProduct && p.color == colorProduct
  );
  // dans ce cas, c'est si le produit existe
  if (index != -1) {
    const totalQuantity = cart[index].quantity + cartLine.quantity;
    if (totalQuantity > 100) {
      // fonction addToCart modifications
      window.alert("Vous avez dépassé la quantité maximale");
      return;
    } //splicer l'index
    console.log(totalQuantity);

    console.log(cartLine);
    cart[index].quantity += cartLine.quantity; // modifie panier pour incrémenter avec la saisie de l'utilisateur, ajoute quantity saisie à celle existante
    console.log(cart[index]); // contenu panier
  } else {
    cart.push(cartLine); // push cartLine (saisie utilisateur) donc push produit dans panier
  }
  //enregistrer la panier dans localStorage, cart tableau mis a jour selon condition
  localStorage.setItem("cart", JSON.stringify(cart));
  //console.log(cart);
}

function getCart() {
  // fonction getCart (récupérer le panier)
  let basket = localStorage.getItem("cart"); // créer variable pour récupérer le localStorage
  if (basket == null) {
    // si variable == Null return vide array []
    return []; // si pas null return le localStorage dans variable créée
  } else {
    return JSON.parse(basket);
  } //-> le parser avec JSON.parse(cart)
}

async function cart() {
  const cartTotal = getCart();
  cartTotal.sort((a, b) => {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
}) // récupérer cart dans variable
  console.log(cartTotal);
  for (let line of cartTotal) {
    // console.log(line.color); //accès color
    await fetch("http://localhost:3000/api/products/" + line.id)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (product) {
        showCartLine(product, line.color, line.quantity); //fct pr afficher color
      })
      .catch(function (err) {
        // Une erreur est survenue
      });
  }
}

function showCartLine(product, basketColor, quantity) {
  //---------------------------------------------------------------------------------//
  const section = document.getElementById("cart__items");
  // parcourir l'array (cart)
  const articleCartItem = document.createElement("article"); //création  article
  articleCartItem.classList.add("cart__item"); //créa class cart__item
  articleCartItem.dataset.id = product._id; //créa attribut data-id
  articleCartItem.dataset.color = basketColor; //créa attribut dat-color

  section.appendChild(articleCartItem); //le rattacher à section mais failed

  const divCartItemImage = document.createElement("div"); //créa div
  divCartItemImage.classList.add("cart__item__img"); // créa classe "cart__item__img"

  articleCartItem.appendChild(divCartItemImage);
  //---------------------------------------------------------------------------------//
  const imageItemCart = document.createElement("img");
  imageItemCart.src = product.imageUrl;
  imageItemCart.alt = product.altTxt;

  divCartItemImage.appendChild(imageItemCart);
  //---------------------------------------------------------------------------------//
  const divCartItemContent = document.createElement("div");
  divCartItemContent.classList.add("cart__item__content");

  articleCartItem.appendChild(divCartItemContent);
  //---------------------------------------------------------------------------------//
  const divCartItemContentDescription = document.createElement("div");
  divCartItemContentDescription.classList.add(
    "cart__item__content__description"
  );

  divCartItemContent.appendChild(divCartItemContentDescription);
  //---------------------------------------------------------------------------------//
  const titleDescription = document.createElement("h2");
  titleDescription.innerText = product.name;

  divCartItemContentDescription.appendChild(titleDescription);
  //---------------------------------------------------------------------------------//
  const pColorDescription = document.createElement("p"); //option sinon
  pColorDescription.innerText = basketColor;

  divCartItemContentDescription.appendChild(pColorDescription);
  //---------------------------------------------------------------------------------//
  const formatedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);                             //new Intl.NumberFormat("fr-FR").format(product.price);
  const pPriceDescription = document.createElement("p");
  pPriceDescription.innerText = formatedPrice;

  divCartItemContentDescription.appendChild(pPriceDescription);
  //---------------------------------------------------------------------------------//
  const divCartItemContentSettings = document.createElement("div");
  divCartItemContentSettings.classList.add("cart__item__content__settings");

  divCartItemContent.appendChild(divCartItemContentSettings);
  //---------------------------------------------------------------------------------//
  const divContentSettingsQuantity = document.createElement("div");
  divContentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );

  divCartItemContentSettings.appendChild(divContentSettingsQuantity);
  //---------------------------------------------------------------------------------//
  const pSettingsQuantity = document.createElement("p");
  pSettingsQuantity.textContent = "Qté :";

  divContentSettingsQuantity.appendChild(pSettingsQuantity);
  //---------------------------------------------------------------------------------//
  const inputSettingsQuantity = document.createElement("input");
  inputSettingsQuantity.type = "Number";
  inputSettingsQuantity.classList.add("itemQuantity");
  inputSettingsQuantity.name = product.name;
  inputSettingsQuantity.min = "1";
  inputSettingsQuantity.max = "100";
  inputSettingsQuantity.value = quantity;

  divContentSettingsQuantity.appendChild(inputSettingsQuantity);
  //---------------------------------------------------------------------------------//
  const divContentDelete = document.createElement("div");
  divContentDelete.classList.add("cart__item__content__settings__delete");

  divCartItemContentSettings.appendChild(divContentDelete);
  //---------------------------------------------------------------------------------//
  const pDeleteItem = document.createElement("p");
  pDeleteItem.classList.add("deleteItem");
  pDeleteItem.innerText = "Supprimer";

  divContentDelete.appendChild(pDeleteItem);

  pDeleteItem.addEventListener('click', () => {
    deleteBasket(product._id, basketColor);
    totalProducts();            //calculer le nombre total de produits
    totalProductsPrice();        //calculer le nombre total de produits
  });
  inputSettingsQuantity.addEventListener('input', (target) => {
    modifyBasket(product._id, basketColor, target.target.value); 
    totalProducts();            //calculer le nombre total de produits
    totalProductsPrice();        //calculer le nombre total de produits
  });
}
//---Supprimer le panier------------------------------------------------------------------------------//
function deleteBasket(productId, basketColor) {
  const finalCart = getCart();
  let indexDeleted = finalCart.findIndex(
    (p) => p.id == productId && p.color == basketColor
  );

  //supprime de l'array
  finalCart.splice(indexDeleted, 1);

  //supprime du localStorage
  localStorage.setItem("cart", JSON.stringify(finalCart));

  //supprime du DOM
  document.querySelector(`article[data-id="${productId}"][data-color="${basketColor}"]`).remove();

  window.alert("Supprimé !");
  console.log(productId);
  console.log(basketColor);
};
//---------------------------------------------------------------------------------//
function modifyBasket(productId, basketColor, quantityInput) {
  const finalCart = getCart();
  let indexModify = finalCart.findIndex(
    (p) => p.id == productId && p.color == basketColor 
  );

  finalCart[indexModify].quantity = quantityInput;

  localStorage.setItem("cart", JSON.stringify(finalCart));

  window.alert("Modifié !");
  console.log(productId);
  console.log(basketColor);
};
//---------------------------------------------------------------------------------//
//déclarer fonction pour changer quantité du panier
function totalProducts() {  
  //récupérer le panier            
  const totalCartProducts = getCart();                                            
  console.log(totalCartProducts);                                                 
  
  //créer la variable de quantityTotal let
  let quantityTotal = 0;
  
  //parcourir array produits
  for(let product of totalCartProducts) {
    //additionner les quantités
    quantityTotal += parseInt(product.quantity);                                          //quantityTotal = product.quantity + quantityTotal;
  }

  //mettre à jour l'interface, selecteur à cibler, //récupérer le noeud html
  let finalQuantityProduct = document.getElementById("totalQuantity");

  //mettre à jour sa valeur avec la quantité totale variable = blalb.quelquechose
  finalQuantityProduct.innerText = quantityTotal;
}  

function totalProductsPrice() {
  //récupérer le panier
  const totalCartProducts = getCart();                                            
  console.log(totalCartProducts);                                                 

  //créer la variable de prices let
  let priceTotal = 0;

  //parcourir array price 
  for(let product of totalCartProducts) {
    //multiplier les quantités * prix
    priceTotal = product * ;
  }

  //mettre à jour valeur prices
  //mettre à jour l'interface, selecteur à cibler, //récupérer le noeud html
  //mettre à jour sa valeur avec la quantité totale variable = blalb.quelquechos
}



// deleteItemParagraph.addEventListener("click", () => {
//   deleteFromCart(product._id, color)
  // totalProducts()
  // totalProductsPrice()
// })
// 
// pDeleteItem.addEventListener(
//   "click",
//   function deleteBasket(product, basketColor) {
//     console.log(product);
//     console.log(basketColor);
//   }
// );
//---------------------------------------------------------------------------------//
// constant pDelete, faire addEventListener ("click") à l'intéreieur j'appele deleteBasket,
// avec id color
// }product._id, basketColor

// function deleteBasket(id, color) {
//   window.alert("Supprimé!");
//   console.log(id);
//   console.log(color);
//   //récupérer Cart (panier)
//   //tester si id=paramètre id et color=paramètre color
// //.splice(permet de supprier un élément du panier)
// // if c'est ça supprimer
//
//
