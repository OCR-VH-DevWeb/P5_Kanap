console.log("page panier")

// utilisateur doit pouvoir -> modifier quantité produit, total doit se mettre à jour
//                          -> supprimer produit du panier, produit doit dispataître de la page
//formulaire pour passer commande = données doivent être correctes & bien formatées avant envoi 
//backend. Sinon msg d'erreur sous le champ concerné
//Attention à ne pas stocker le prix des articles en local (données non sécu/ utilisateur pourrait modifier prix lui-m)
//panier = array => id produit, quantité produit, couleur produit
//alerte lors du clic sur le bouton "Ajouter au panier" (écouter l'évènement au clic)
//-----------------------------------------------------------------------------------//

// quand utilisateur clique sur "Ajouter au panier", on lui passe les paramètres (id/color/quantity) (récupéré de page product)
export function addToCart(idProduct, colorProduct, quantityProduct) {
    // on crée un objet cartLine avec paramètres, la variable cartLine contient un objet
    let cartLine = {
        id: idProduct,
        color: colorProduct,
        quantity: parseInt(quantityProduct),        // parseInt pour avoir quantité en nombre entier si veut décimal parseFloat
    }
    // on récupère la panier localStorage dans la variable cart (panier en mémoire)
     let cart = getCart();                          //récupère un tableau vide ou un tableau d'objet de produit
    // on va chercher dans localStorage (panier en mémoire) si un produit avec même id et même color existe. On compare la panier mémoire avec saisie utilisateur
     let index = cart.findIndex((p) => (p.id == idProduct && p.color == colorProduct)) 
     // dans ce cas, c'est si le produit existe
     if(index != -1) {
        const totalQuantity = cart[index].quantity + cartLine.quantity;
        if(totalQuantity > 100) {                   // fonction addToCart modifications
            window.alert("Vous avez dépassé la quantité maximale");
            return;
        }                                           //splicer l'index 
        console.log(totalQuantity);

        console.log(cartLine);
        cart[index].quantity += cartLine.quantity;  // modifie panier pour incrémenter avec la saisie de l'utilisateur, ajoute quantity saisie à celle existante
        console.log(cart[index]);                   // contenu panier
    
      } else {
            cart.push(cartLine);                    // push cartLine (saisie utilisateur) donc push produit dans panier
        }
    //enregistrer la panier dans localStorage, cart tableau mis a jour selon condition
    localStorage.setItem("cart", JSON.stringify(cart));
    //console.log(cart);
  
}

function getCart() {                               // fonction getCart (récupérer le panier)
  let basket = localStorage.getItem("cart");      // créer variable pour récupérer le localStorage   
  if(basket == null) {                            // si variable == Null return vide array []
      return [];                                  // si pas null return le localStorage dans variable créée
   } else { return JSON.parse(basket) }           //-> le parser avec JSON.parse(cart)
}

 const cartTotal = getCart();    // récupérer cart dans variable
 console.log(cartTotal);

 for(let line of cartTotal) {  
  // console.log(line.color); //accès color
  fetch("http://localhost:3000/api/products/" + line.id)
  .then(function(res) {
   if (res.ok) {
     return res.json();
   }
 })
 .then(function(product) {
   showCartLine(product, line.color); //fct pr afficher color
})
 .catch(function(err) {
   // Une erreur est survenue
 });
 }

 function showCartLine(product, basketColor) {
  console.log(product);

  const section = document.getElementById("cart__items");
  console.log(section);
                                                          // parcourir l'array (cart)
  const articleCartItem = document.createElement("article"); //création  article
  articleCartItem.classList.add("cart__item");               //créa class cart__item
  articleCartItem.dataset.id = product._id;                        //créa attribut data-id
  articleCartItem.dataset.color = basketColor;                  //créa attribut dat-color

  section.appendChild(articleCartItem);                  //le rattacher à section mais failed

  const divCartItemImage = document.createElement("div");         //créa div
  divCartItemImage.classList.add("cart__item__img");              // créa classe "cart__item__img"

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
  divCartItemContentDescription.classList.add("cart__item__content__description");

  divCartItemContent.appendChild(divCartItemContentDescription);
  //---------------------------------------------------------------------------------//
  const titleDescription = document.createElement("h2");
  titleDescription.innerText = product.name;

  divCartItemContentDescription.appendChild(titleDescription)
  //---------------------------------------------------------------------------------//
  const pColorDescription = document.createElement("p"); //option sinon
  pColorDescription.innerText = basketColor;

  divCartItemContentDescription.appendChild(pColorDescription);
  //---------------------------------------------------------------------------------//
  const formatedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price) //new Intl.NumberFormat("fr-FR").format(product.price);
  const pPriceDescription = document.createElement("p");
  pPriceDescription.innerText = formatedPrice;

  divCartItemContentDescription.appendChild(pPriceDescription);
  //---------------------------------------------------------------------------------//
  const divCartItemContentSettings = document.createElement("div");
  divCartItemContentSettings.classList.add("cart__item__content__settings");

  divCartItemContent.appendChild(divCartItemContentSettings);
  //---------------------------------------------------------------------------------//
  const divContentSettingsQuantity = document.createElement("div");
  divContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");

  divCartItemContentSettings.appendChild(divContentSettingsQuantity);
  console.log(divContentSettingsQuantity);
  //---------------------------------------------------------------------------------//
  const pSettingsQuantity = document.createElement("p");
  const productArray = getCart();
  let quantityLine;
  for(let productLineIndex in productArray) {
    let lineProduct = productArray[productLineIndex];
    if (product._id === lineProduct.id) {
      quantityLine = lineProduct.quantity;
      console.log(quantityLine);
    }
  }
  pSettingsQuantity.textContent = "Qté :";

  divContentSettingsQuantity.appendChild(pSettingsQuantity);
  console.log(pSettingsQuantity);
  //---------------------------------------------------------------------------------//
  const inputSettingsQuantity = document.createElement("input");
  inputSettingsQuantity.type = "Number";
  inputSettingsQuantity.classList.add("itemQuantity");
  inputSettingsQuantity.name = product.name;
  inputSettingsQuantity.min = "1";
  inputSettingsQuantity.max = "100";
  inputSettingsQuantity.value = quantityLine;

  divContentSettingsQuantity.appendChild(inputSettingsQuantity);
  console.log(inputSettingsQuantity);
  //---------------------------------------------------------------------------------//
  const divContentDelete = document.createElement("div");
  divContentDelete.classList.add("cart__item__content__settings__delete");

  divCartItemContentSettings.appendChild(divContentDelete);
  console.log(divContentDelete);
  //---------------------------------------------------------------------------------//
  const pDeleteItem = document.createElement("p");
  pDeleteItem.classList.add("deleteItem");
  pDeleteItem.innerText = "Supprimer";

  divContentDelete.appendChild(pDeleteItem);
  console.log(pDeleteItem);



}

// constant pDelete, faire addEventListener ("click") à l'intéreieur j'appele deleteBasket, avec id color
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
 
// <div class="cart__item__content">
//   <div class="cart__item__content__description">
//     <h2>Nom du produit</h2>
//     <p>Vert</p>
//     <p>42,00 €</p>
//   </div>
//   <div class="cart__item__content__settings">
//     <div class="cart__item__content__settings__quantity">
//       <p>Qté : </p>
//       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
//     </div>
//     <div class="cart__item__content__settings__delete">
//       <p class="deleteItem">Supprimer</p>
//     </div>
//   </div>
// </div>
//</article>
