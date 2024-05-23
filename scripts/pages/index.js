async function getPhotographers() {
    try {
      const response = await fetch("./data/photographers.json");
      const data = await response.json();
      return { photographers: data.photographers };
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      // Gérer l'erreur de manière appropriée
    }
  }
  
  function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price } = data;
  
    function getUserCardDOM() {
      const article = document.createElement("article");
  
      const img = document.createElement("img");
      img.src = `./assets/Sample Photos/Photographers ID Photos/${portrait}`;
      img.alt = name;
      article.appendChild(img);
  
      const h2 = document.createElement("h2");
      h2.textContent = name;
      article.appendChild(h2);
  
      const location = document.createElement("h3");
      location.textContent = `${city}, ${country}`;
      article.appendChild(location);
  
      const taglineElement = document.createElement("h4");
      taglineElement.textContent = tagline;
      article.appendChild(taglineElement);
  
      const priceElement = document.createElement("p");
      priceElement.textContent = `${price}€/jour`;
      article.appendChild(priceElement);
  
      return article;
    }
  
    return { getUserCardDOM };
  }
  
  async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");
    photographersSection.innerHTML = ""; // Effacer le contenu précédent
  
    photographers.forEach((photographer) => {
      const photographerModel = photographerTemplate(photographer);
      const userCardDOM = photographerModel.getUserCardDOM();
      photographersSection.appendChild(userCardDOM);
    });
  }
  
  async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
  }
  
  init();
  