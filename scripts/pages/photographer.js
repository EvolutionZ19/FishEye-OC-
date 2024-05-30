
// Définir photographerId en dehors de toute fonction pour la rendre globale
let photographerId;

async function getPhotographer() {
    try {
        const response = await fetch("./data/photographers.json");
        const data = await response.json();
        return data.photographers.find((photographer) => photographer.id == photographerId);
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
}

function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, tags } = data;

    function getPhotographerDOM() {
        const article = document.createElement("article");

        const img = document.createElement("img");
        img.src = `./assets/Sample Photos/Photographers ID Photos/${portrait}`;
        img.alt = name;
        img.classList.add("photographer__portrait");
        article.appendChild(img);

        const h2 = document.createElement("h2");
        h2.textContent = name;
        article.appendChild(h2);

        const location = document.createElement("h3");
        location.textContent = `${city}, ${country}`;
        location.classList.add("photographer__location");
        article.appendChild(location);

        const taglineElement = document.createElement("h4");
        taglineElement.textContent = tagline;
        taglineElement.classList.add("photographer__tagline");
        article.appendChild(taglineElement);

        const priceElement = document.createElement("p");
        priceElement.textContent = `${price}€/jour`;
        priceElement.classList.add("photographer__price");
        article.appendChild(priceElement);

        const tagsElement = document.createElement("ul");
        tagsElement.classList.add("tags");

        // Vérifier si tags est un tableau et s'il n'est pas vide
        if (Array.isArray(tags) && tags.length > 0) {
            tags.forEach((tag) => {
                const tagElement = document.createElement("li");
                tagElement.textContent = `#${tag}`;
                tagsElement.appendChild(tagElement);
            });
        } // Pas besoin de else ici car les balise sont vides par défaut

        article.appendChild(tagsElement);

        return article;
    }

    return getPhotographerDOM();
}

//récupérer et afficher les données du photographe
async function displayPhotographer() {
    // Obtenir l'ID à partir des paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    photographerId = urlParams.get("id");

    if (photographerId) {
        const photographerData = await getPhotographer();
        if (photographerData) {
            const photographerDOM = photographerTemplate(photographerData);

            // Ciblez l'élément <main> existant
            const mainElement = document.getElementById("main"); 

            // Insérez le profil du photographe à la fin du <main>
            mainElement.appendChild(photographerDOM);  
        } else {
            console.error("Aucun photographe trouvé avec cet ID.");
        }
    } else {
        console.error("Aucun ID de photographe fourni dans l'URL.");
    }
}

// Appeler la fonction d'affichage lorsque la page se charge
displayPhotographer();
