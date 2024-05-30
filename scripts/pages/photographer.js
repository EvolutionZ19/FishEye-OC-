
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

    // On récupère la div existante
    const photographHeader = document.querySelector('.photograph-header');

    // Création des éléments du profil
    const img = document.createElement("img");
    img.src = `./assets/Sample Photos/Photographers ID Photos/${portrait}`;
    img.alt = name;
    img.classList.add("photographer__portrait");

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const location = document.createElement("h3");
    location.textContent = `${city}, ${country}`;
    location.classList.add("photographer__location");

    const taglineElement = document.createElement("h4");
    taglineElement.textContent = tagline;
    taglineElement.classList.add("photographer__tagline");

    const priceElement = document.createElement("p");
    priceElement.textContent = `${price}€/jour`;
    priceElement.classList.add("photographer__price");

    const tagsElement = document.createElement("ul");
    tagsElement.classList.add("tags");

    // Vérifier si tags est un tableau et s'il n'est pas vide
    if (Array.isArray(tags) && tags.length > 0) {
        tags.forEach((tag) => {
            const tagElement = document.createElement("li");
            tagElement.textContent = `#${tag}`;
            tagsElement.appendChild(tagElement);
        });
    }

    // Créer la div pour les informations du photographe
    const photographerInfo = document.createElement("div");
    photographerInfo.classList.add("photographer-info");

    // Ajouter les éléments à la div photographer-info
    photographerInfo.appendChild(h2);
    photographerInfo.appendChild(location);
    photographerInfo.appendChild(taglineElement);
    photographerInfo.appendChild(priceElement);
    photographerInfo.appendChild(tagsElement);

    // Récupérer le bouton principal "Contactez-moi"
    const contactButton = document.querySelector('.photograph-header .contact_button');

    // Ajouter les éléments à la div principale
    photographHeader.appendChild(photographerInfo);
    photographHeader.appendChild(contactButton); // Ajout du bouton
    photographHeader.appendChild(img);
}

// Fonction pour afficher la modale de contact
function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";

    // Supprimer le bouton "Envoyer" de la modale
    const modalButton = modal.querySelector(".contact_button");
    if (modalButton) {
        modalButton.remove(); 
    }

    // Récupérer le bouton principal "Contactez-moi"
    const mainButton = document.querySelector('.photograph-header .contact_button');

    // Cloner le bouton principal
    const clonedButton = mainButton.cloneNode(true);

    // Ajouter le bouton cloné à la modale
    const modalForm = modal.querySelector('form');
    modalForm.appendChild(clonedButton);
}

// Fonction pour fermer la modale de contact
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";

    // Supprimer le bouton cloné de la modale
    const modalButton = modal.querySelector(".contact_button");
    if (modalButton) {
        modalButton.remove();
    }
}

//récupérer et afficher les données du photographe
async function displayPhotographer() {
    // Obtenir l'ID à partir des paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    photographerId = urlParams.get("id");

    if (photographerId) {
        const photographerData = await getPhotographer();
        if (photographerData) {
            photographerTemplate(photographerData); // Appeler la fonction pour modifier la div
        } else {
            console.error("Aucun photographe trouvé avec cet ID.");
        }
    } else {
        console.error("Aucun ID de photographe fourni dans l'URL.");
    }
}

// Appeler la fonction d'affichage lorsque la page se charge
displayPhotographer();
