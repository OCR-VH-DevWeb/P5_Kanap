console.log("page panier");
//-----------------------------------------------------------------------------------//

/**
 * Appel de la fonction cart()
 */
cart();
//-----------------------------------------------------------------------------------//

/**
 * Créer un objet cartLine avec les paramètres (id/color/quantity, récupérés de page product) au clic de l'utilisateur sur bouton "Ajouter au panier"
 * @param {string} idProduct - l'identifiant du produit
 * @param {string} colorProduct - la couleur du produit
 * @param {number} quantityProduct - la quantité souhaitée et limitée entre 1 à 100
 * @returns {Array}
 */
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
//---------------------------------------------------------------------------------//

/**
 * Récupérer le panier
 * @returns {(Array|object)}
 */
function getCart() {
  // fonction getCart (récupérer le panier)
  let basket = localStorage.getItem("cart"); // créer variable pour récupérer le localStorage
  if (basket == null) {
    // si variable == Null return vide array []
    return []; // si pas null return le localStorage dans variable créée
  } else {
    return JSON.parse(basket);
  } // le parser avec JSON.parse(cart)
}

/**
 * Trier le panier par id et couleur avec method fetch
 */
async function cart() {
  const cartTotal = getCart();
  cartTotal.sort((a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  }); // récupérer cart dans variable
  console.log(cartTotal);
  for (let line of cartTotal) {
    // accès color
    await fetch("http://localhost:3000/api/products/" + line.id)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (product) {
        showCartLine(product, line.color, line.quantity); //fct pr afficher color
        totalProducts(); //calculer le nombre total de produits
        totalProductsPrice(); //calculer le nombre total de produits
      })
      .catch(function (err) {
        // Une erreur est survenue
      });
  }
}
//---------------------------------------------------------------------------------//
/**
 * Montrer le panier à l'utilisateur en passant par le DOM
 * @param {string} product - l'identifiant du produit
 * @param {string} basketColor - la couleur du produit
 * @param {number} quantity - la quantité souhaitée et limitée entre 1 à 100
 */
function showCartLine(product, basketColor, quantity) {
  const section = document.getElementById("cart__items");
  // parcourir l'array (cart)
  const articleCartItem = document.createElement("article"); //création  article
  articleCartItem.classList.add("cart__item"); //créa class cart__item
  articleCartItem.dataset.id = product._id; //créa attribut data-id
  articleCartItem.dataset.price = product.price;
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
  }).format(product.price); //new Intl.NumberFormat("fr-FR").format(product.price);
  const pPriceDescription = document.createElement("p");
  pPriceDescription.innerText = formatedPrice;

  pPriceDescription.dataset.price = product.price;

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

  pDeleteItem.addEventListener("click", () => {
    deleteBasket(product._id, basketColor);
    totalProducts(); //calculer le nombre total de produits
    totalProductsPrice(); //calculer le nombre total de produits
  });
  inputSettingsQuantity.addEventListener("input", (target) => {
    modifyBasket(product._id, basketColor, target.target.value);
    totalProducts(); //calculer le nombre total de produits
    totalProductsPrice(); //calculer le nombre total de produits
  });
}
//---------------------------------------------------------------------------------//

/**
 * Déclarer la fonction pour supprimer une ligne de produit du panier
 * @param {string} productId
 * @param {string} basketColor
 */
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
  document
    .querySelector(
      `article[data-id="${productId}"][data-color="${basketColor}"]`
    )
    .remove();

  console.log(productId);
  console.log(basketColor);
}
//---------------------------------------------------------------------------------//

/**
 * Déclarer la fonction pour modifer la quantité d'un produit en respectant la règle valeur entre 1 à 100
 * @param {string} productId
 * @param {string} basketColor
 * @param {number} quantityInput
 */
function modifyBasket(productId, basketColor, quantityInput) {
  const finalCart = getCart();
  let indexModify = finalCart.findIndex(
    (p) => p.id == productId && p.color == basketColor
  );

  if (quantityInput < 1 || quantityInput > 100) {
    document
      .querySelector(
        `article[data-id="${productId}"][data-color="${basketColor}"]`
      )
      .getElementsByTagName("input")[0].value = finalCart[indexModify].quantity;

    window.alert("Veuillez saisir une quantité entre 0 et 100, merci");
  } else {
    finalCart[indexModify].quantity = quantityInput;
    console.log(productId);
    console.log(basketColor);
  }

  localStorage.setItem("cart", JSON.stringify(finalCart));
}
//---------------------------------------------------------------------------------//

/**
 * Déclarer fonction pour calculer la quantité totale de produits du panier
 */
function totalProducts() {
  //récupérer le panier
  const totalCartProducts = getCart();
  console.log(totalCartProducts);

  //créer la variable de quantityTotal let
  let quantityTotal = 0;

  //parcourir array produits
  for (let product of totalCartProducts) {
    //additionner les quantités
    quantityTotal += parseInt(product.quantity); //quantityTotal = product.quantity + quantityTotal;
  }

  //mettre à jour l'interface, selecteur à cibler, //récupérer le noeud html
  let finalQuantityProduct = document.getElementById("totalQuantity");

  //mettre à jour sa valeur avec la quantité totale variable
  finalQuantityProduct.innerText = quantityTotal;
}
//---------------------------------------------------------------------------------//

/**
 * Déclarer fonction pour calculer le prix total des produits du panier
 */
function totalProductsPrice() {
  //récupérer le panier
  const totalCartProducts = getCart();
  console.log(totalCartProducts);

  //créer la variable de prices let
  let priceTotal = 0;

  //parcourir array price
  for (let product of totalCartProducts) {
    //multiplier les quantités * prix
    priceTotal +=
      parseInt(
        document.querySelector(`article[data-id="${product.id}"]`).dataset.price
      ) * parseInt(product.quantity);
  }

  //mettre à jour valeur prices, mettre à jour l'interface, selecteur à cibler, //récupérer le noeud html
  let finalPriceProduct = document.getElementById("totalPrice");

  //mettre à jour sa valeur avec la quantité totale variable = blalb.quelquechos
  const formatedPrice = new Intl.NumberFormat().format(priceTotal);
  finalPriceProduct.innerText = formatedPrice;
}
//---------------------------------------------------------------------------------//

//Récupérer et analyser les données saisies par l’utilisateur dans le formulaire.
//Afficher un message d’erreur si besoin (par exemple lorsqu’un utilisateur renseigne “bonjour” dans le champ “e-mail”).
//Constituer un objet contact (à partir des données du formulaire) et un tableau de produits
//---------------------------------------------------------------------------------//
// Déclarer une condition "si"
if (document.getElementById("cartAndFormContainer")) {
  // Le formulaire existe alors on déclare et appelle les différentes fonctions pour analyser les champs demandés"

  /**
   * Vérifier et récupérer champ nom
   * @returns {boolean}
   */
  function verifyFirstName() {
    //récupère value firstName
    let valueName = document.getElementById("firstName").value;
    let errorFirstName = document.getElementById("firstNameErrorMsg");

    let masque1 =
      /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]+$/;
    if (valueName.match(masque1)) {
      errorFirstName.innerText = "";
      return true; //a faire dans toutes les fonctions suivantes
    } else {
      errorFirstName.innerText = "Ce champ est invalide";
      return false; //a faire dans toutes les fonctions suivantes
    }
  }

  document.getElementById("firstName").addEventListener("input", () => {
    verifyFirstName();
  });
  //---------------------------------------------------------------------------------//

  /**
   * Vérifier et récupérer champ prénom
   * @returns {boolean}
   */
  function verifyLastName() {
    //récupère value lastName
    let valueName = document.getElementById("lastName").value;
    let errorLastName = document.getElementById("lastNameErrorMsg");

    let masque1 =
      /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]+$/;
    if (valueName.match(masque1)) {
      errorLastName.innerText = "";
      return true;
    } else {
      errorLastName.innerText = "Ce champ est invalide";
      return false;
    }
  }

  document.getElementById("lastName").addEventListener("input", () => {
    verifyLastName();
  });
  //---------------------------------------------------------------------------------//

  /**
   * Vérifier et récupérer champ adresse
   * @returns {boolean}
   */
  function verifyAddress() {
    //récupère value address
    let valueAddress = document.getElementById("address").value;
    let errorAddress = document.getElementById("addressErrorMsg");
    console.log(errorAddress);

    let masque1 =
      /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ0-9\s,.'-]{3,}$/;
    if (valueAddress.match(masque1)) {
      errorAddress.innerText = "";
      return true;
    } else {
      errorAddress.innerText = "Ce champ est invalide";
      return false;
    }
  }

  document.getElementById("address").addEventListener("input", () => {
    verifyAddress();
  });
  //---------------------------------------------------------------------------------//

  /**
   * Vérifier et récupérer le champ ville
   * @returns {boolean}
   */
  function verifyCity() {
    //récupère value city
    let valueCity = document.getElementById("city").value;
    let errorCity = document.getElementById("cityErrorMsg");
    console.log(errorCity);
    let masque1 =
      /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s-]+$/;

    if (valueCity.match(masque1)) {
      errorCity.innerText = "";
      return true;
    } else {
      errorCity.innerText = "Ce champ est invalide";
      return false;
    }
  }

  document.getElementById("city").addEventListener("input", () => {
    verifyCity();
  });
  //---------------------------------------------------------------------------------//

  /**
   * Vérifier et récupérer le champ email
   * @returns {boolean}
   */
  function verifyEmail() {
    //récupère value email
    let valueEmail = document.getElementById("email").value;
    let errorEmail = document.getElementById("emailErrorMsg");
    console.log(errorEmail);
    let masque1 = /^[\w-.]+@([\w-]+.)+[\w-]{2,5}$/;
    // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;

    if (valueEmail.match(masque1)) {
      errorEmail.innerText = "";
      return true;
    } else {
      errorEmail.innerText = "Ce champ est invalide";
      return false;
    }
  }

  document.getElementById("email").addEventListener("input", () => {
    verifyEmail();
  });
  //---------------------------------------------------------------------------------//

  document.getElementById("order").addEventListener("click", (e) => {
    //empêcher le comportement par défaut
    e.preventDefault();
    if (
      verifyFirstName() &&
      verifyLastName() &&
      verifyAddress() &&
      verifyCity() &&
      verifyEmail()
    ) {
      //créer objet contact
      let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      };
      console.log(contact);

      //créer array de produits
      let products = [];

      let cart = getCart();
      console.log(cart);

      if (cart.length == 0) {
        window.alert(
          "Attention, vous ne pouvez pas commander sans produit dans votre panier"
        );
      } else {
        for (let line of cart) {
          let id = line.id;
          products.push(id);
        } //récupère un tableau vide ou un tableau d'objet de produits
        console.log(products);

        let body = {
          //réunir dans un objet
          contact: contact,
          products: products,
        };
        console.log(body);

        //faire un fetch post pour lui envoyer les données /order voire specif
        //JSON.stringify(body)
        fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(body),
        })
          .then(function (res) {
            if (res.ok && res.status === 201) {
              return res.json();
            }
          })
          .then(function (response) {
            window.location.href =
              "/front/html/confirmation.html?orderId=" + response.orderId;
          })
          .catch(function (err) {
            console.log(err);
          });

        //ajouter les autres fonctions
        window.alert("Commandé !");
      }
    } else {
      window.alert("Un ou plusieurs de vos champs ne sont pas bien renseignés");
    }
  });
}
