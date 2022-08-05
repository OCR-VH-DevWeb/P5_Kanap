// // quand utilisateur clique sur "Ajouter au panier", on lui passe les paramètres (id/color/quantity) (récupéré de page product)/export fonction
// export function addToCart (idProduct, colorProduct, quantityProduct) {
//     // on crée un objet cartLine avec paramètres, la variable cartLine contient un objet
//     let cartLine = {
//         id: idProduct,
//         color: colorProduct,
//         quantity: parseInt(quantityProduct),             // parseInt pour avoir quantité en nombre entier si veut décimal parseFloat
//     };
//     // on récupère la panier localStorage dans la variable cart (panier en mémoire) 
//     let cart = get cart();                               //récupère un tableau vide ou un tableau d'objet de produit
//     // on va chercher dans localStorage (panier en mémoire) si un produit avec même id et même color existe. On compare la panier mémoire avec saisie utilisateur
//     let index = cart.findIndex((p) => (p.id == idProduct && p.color == colorProduct))
//      // dans ce cas, c'est si le produit existe
//      if(index != -1) {
//         console.log(cartLine);
//         cart[index].quantity += cartLine.quantity;                        // modifie panier pour incrémenter avec la saisie de l'utilisateur, ajoute quantity saisie à celle existante
//         console.log(cart[index]);                                                // contenu panier
//     }
//     else {
//     cart.push(cartLine)}                                                    // push cartLine (saisie utilisateur) donc push produit dans panier
//     //enregistrer le panier dans localStorage, cart tableau mis a jour selon conditoin
//     
// } 
//   
//                                                         // fonction getCart (récupérer le panier)
//                                                         // créer variable pour récupérer le localStorage   
//                                                         // si variable == Null return vide array []
//                                                         // si pas null return le localStorage dans variable créée
//                                                         //-> le parser avec JSON.parse(cart)
//  
// 
// // fonction addToCart modifications
