
// Définir photographerId en dehors de toute fonction pour la rendre globale
let photographerId;

// Récupérer les données du photographe
async function getPhotographer() {
    try {
        const response = await fetch("./data/photographers.json");
        const data = await response.json();
        return data.photographers.find((photographer) => photographer.id == photographerId);
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
}

// Récupérer les données des médias du photographe
async function getPhotographerMedia(photographerId) {
    try {
        const response = await fetch("./data/photographers.json");
        const data = await response.json();
        return data.media.filter((media) => media.photographerId == photographerId);
    } catch (error) {
        console.error("Erreur lors du chargement des données media:", error);
    }
}

// Fonction pour créer et afficher le profil du photographe
async function photographerTemplate() {
    const photographerData = await getPhotographer();

    if (photographerData) { 
        const { name, portrait, city, country, tagline, price, tags } = photographerData;

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

        const tagsElement = document.createElement("ul");
        tagsElement.classList.add("photographer__tags");

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
    
    // Récupérer le bouton principal "Contactez-moi"
    const contactButton = document.querySelector('.photograph-header .contact_button');

    photographHeader.appendChild(photographerInfo);
    photographHeader.appendChild(contactButton);
    photographHeader.appendChild(img);

        const mediaData = await getPhotographerMedia(photographerId);
        if (mediaData) {
            displayMediaGallery(mediaData, photographerData); 
        } else {
            console.error("Aucun média trouvé pour ce photographe.");
        }
    } else {
        console.error("Aucun photographe trouvé avec cet ID.");
    }
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

/// Fonction pour créer et afficher la galerie de médias (avec tri)
function displayMediaGallery(media, photographerData) {
    const main = document.getElementById('main');
  
    // 1. Créer le conteneur principal pour le tri
    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');
    main.appendChild(sortContainer);
  
    // 2. Ajouter le texte "Trier par :"
    const sortLabel = document.createElement('span');
    sortLabel.textContent = 'Trier par :';
    sortLabel.classList.add('sort-label');
    sortContainer.appendChild(sortLabel);

    // 3. Créer le conteneur du menu déroulant
    const sortButtonsWrapper = document.createElement('div');
    sortButtonsWrapper.classList.add('sort-buttons-wrapper');
    sortContainer.appendChild(sortButtonsWrapper);

    // 4. Créer le bouton pour ouvrir/fermer le menu
    const sortToggle = document.createElement('button');
    sortToggle.textContent = '▼';
    sortToggle.classList.add('sort-toggle');
    sortButtonsWrapper.appendChild(sortToggle);

    // 5. Créer le conteneur des boutons de tri (à l'intérieur du menu déroulant)
    const sortButtons = document.createElement('div');
    sortButtons.classList.add('sort-buttons');
    sortButtonsWrapper.appendChild(sortButtons);

    // 6. Créer les boutons de tri
    const popularityButton = document.createElement('button');
    popularityButton.textContent = 'Popularité';
    popularityButton.addEventListener('click', () => {
        media.sort(sortByPopularity);
        updateGallery();
    });
  
    const dateButton = document.createElement('button');
    dateButton.textContent = 'Date';
    dateButton.addEventListener('click', () => {
        media.sort(sortByDate);
        updateGallery();
    });
  
    const titleButton = document.createElement('button');
    titleButton.textContent = 'Titre';
    titleButton.addEventListener('click', () => {
        media.sort(sortByTitle);
        updateGallery();
    });

    // 7. Ajouter les boutons au conteneur du menu déroulant
    sortButtons.appendChild(popularityButton);
    sortButtons.appendChild(dateButton);
    sortButtons.appendChild(titleButton);

    // 8. Créer la galerie
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    main.appendChild(gallery);
  
    // 7. Fonctions de tri
    function sortByPopularity(mediaA, mediaB) {
        return mediaB.likes - mediaA.likes;
    }

    function sortByDate(mediaA, mediaB) {
        return new Date(mediaB.date) - new Date(mediaA.date);
    }

    function sortByTitle(mediaA, mediaB) {
        return mediaA.title.localeCompare(mediaB.title);
    }

    // 10. Tri initial par popularité
    media.sort(sortByPopularity);

    // 11. Fonction de mise à jour de la galerie
    function updateGallery() {
        gallery.innerHTML = ""; // Effacer le contenu précédent de la galerie

        media.forEach((mediaItem) => {
            const mediaItemDiv = document.createElement("div");
            mediaItemDiv.classList.add("media-item");

            let mediaElement;
            if (mediaItem.image) {
                mediaElement = document.createElement("img");
                mediaElement.src = `./assets/Sample Photos/${mediaItem.photographerId}/${mediaItem.image}`;
                mediaElement.alt = `Image: ${mediaItem.title}`;
            } else if (mediaItem.video) {
                mediaElement = document.createElement("video");
                mediaElement.src = `./assets/Sample Photos/${mediaItem.photographerId}/${mediaItem.video}`;
                mediaElement.controls = true;
                mediaElement.alt = `Vidéo: ${mediaItem.title}`;
            } else {
                // Gestion du cas où le média n'est ni une image ni une vidéo
                mediaElement = document.createElement("p");
                mediaElement.textContent = "Média non disponible";
                console.error("Erreur: le média n'a ni image ni vidéo.");
            }

            mediaItemDiv.appendChild(mediaElement);

            // Conteneur pour le titre et les likes
            const titleLikesContainer = document.createElement("div");
            titleLikesContainer.classList.add("media-title-likes");

            // Titre à gauche
            const title = document.createElement("p");
            title.textContent = mediaItem.title;
            title.classList.add("media-title", "media-title-left");
            titleLikesContainer.appendChild(title);

            // Likes à droite (avec icône Font Awesome)
            const likes = document.createElement("p");
            likes.classList.add("media-likes", "media-likes-right");
            const heartIcon = document.createElement("i");
            heartIcon.classList.add("fas", "fa-heart");
            likes.appendChild(heartIcon);
            likes.appendChild(document.createTextNode(` ${mediaItem.likes}`));
            titleLikesContainer.appendChild(likes);

            mediaItemDiv.appendChild(titleLikesContainer);
            gallery.appendChild(mediaItemDiv);
        });
    }

    // 12. Gestion du menu déroulant
    document.addEventListener('DOMContentLoaded', () => {
        if (sortToggle && sortButtons) {
            sortToggle.addEventListener('click', () => {
                sortButtons.style.display = sortButtons.style.display === 'block' ? 'none' : 'block';
                sortToggle.textContent = sortToggle.textContent === '▼' ? '▲' : '▼';
            });
        } else {
            console.error("Éléments du menu déroulant non trouvés.");
        }
    });

    // 13. Appel initial pour afficher la galerie
    updateGallery();
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
