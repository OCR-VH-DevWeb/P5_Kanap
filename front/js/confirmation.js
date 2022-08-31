console.log("page confirmation")
//---------------------------------------------------------------------------------//
let urlConfirmation = new URL(window.location.href);
console.log(urlConfirmation);

let orderIdConfirmed = urlConfirmation.searchParams.get("orderId");
console.log(orderIdConfirmed);

let orderIdNew = document.getElementById("orderId");
orderIdNew.innerText = orderIdConfirmed;
console.log(orderIdNew);

//supprimer les produits du panier
localStorage.removeItem("cart");





//------------------------------------------------//
