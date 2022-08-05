//console.log("page d'accueil")

// récupérer les produits avec l'API
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(products) {
    for (let product of products) {
        showProduct(product);
     }
  })
  .catch(function(err) {
    // Une erreur est survenue
  });

  function showProduct(product) {                       //afficher la vignette
    const section = document.getElementById("items");

    const a = document.createElement("a");              //creation element <a>
    a.href = "./product.html?id=" + product._id;

    section.appendChild(a);                             //appeler mon a à ma section

    const article = document.createElement("article");  //créer un <article> , const a = doc.get

    a.appendChild(article);                       //append article à <a>

    const image = document.createElement("img");        //créer un élément image
    image.src = product.imageUrl;                       // attribuer sa src  
    image.alt = product.altTxt;                         //attribuer son alt               

    article.appendChild(image);                         //append image à l'article

    const title = document.createElement("h3");         //créer h3
    title.classList.add("productName");                 //lui attribuer la classe
    title.innerText = product.name;                     //lui attribuer son innerText

    article.appendChild(title);                         //append h3 à l'article

    const content = document.createElement("p");        // template ce qu'on a à faire
     
    content.classList.add("productDescription");
    content.innerText = product.description;
    
    article.appendChild(content);
    console.log(content);
  }

