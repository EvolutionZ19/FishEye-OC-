
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
        const { name, portrait, city, country, tagline, tags } = photographerData;

        const photographHeader = document.querySelector('.photograph-header');
        photographHeader.innerHTML = ''; // supprimer le contenu précédent

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
        photographerInfo.appendChild(tagsElement); 

        photographHeader.appendChild(photographerInfo);
        
        // Create and append the contact button
        const contactButton = document.createElement("button");
        contactButton.classList.add("contact_button");
        contactButton.textContent = "Contactez-moi";
        contactButton.onclick = displayModal; // Add event listener
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

function displayMediaGallery(media, photographerData) {
    const main = document.getElementById('main');
    let currentMediaIndex = 0;
    let slider;
    let sliderContent;
    let prevButton;
    let nextButton;
    let closeButton;
    let sliderMedia;

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
    popularityButton.classList.add('sort-button');
    popularityButton.addEventListener('click', () => {
        media.sort(sortByPopularity);
        updateGallery();
        updateSortButtonActiveState(popularityButton);
    });

    const dateButton = document.createElement('button');
    dateButton.textContent = 'Date';
    dateButton.classList.add('sort-button');
    dateButton.addEventListener('click', () => {
        media.sort(sortByDate);
        updateGallery();
        updateSortButtonActiveState(dateButton);
    });

    const titleButton = document.createElement('button');
    titleButton.textContent = 'Titre';
    titleButton.classList.add('sort-button');
    titleButton.addEventListener('click', () => {
        media.sort(sortByTitle);
        updateGallery();
        updateSortButtonActiveState(titleButton);
    });

    // 7. Ajouter les boutons au conteneur du menu déroulant
    sortButtons.appendChild(popularityButton);
    sortButtons.appendChild(dateButton);
    sortButtons.appendChild(titleButton);

    // 8. Créer la galerie
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    main.appendChild(gallery);

    // 9. Fonctions de tri
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
    popularityButton.classList.add('active'); // Marquer le bouton "Popularité" comme actif initialement

    // 11. Fonction de mise à jour de la galerie
function updateGallery() {
    gallery.innerHTML = ""; // Effacer le contenu précédent de la galerie
  
    media.forEach((mediaItem, index) => {
      const mediaItemDiv = document.createElement("div");
      mediaItemDiv.classList.add("media-item");
      mediaItemDiv.setAttribute('data-media-index', index); // Ajouter index au parent
  
      let mediaElement;
      if (mediaItem.image) {
        mediaElement = document.createElement("img");
        mediaElement.src = `./assets/Sample Photos/${mediaItem.photographerId}/${mediaItem.image}`;
        mediaElement.alt = mediaItem.title;
      } else if (mediaItem.video) {
        mediaElement = document.createElement("video");
        mediaElement.src = `./assets/Sample Photos/${mediaItem.photographerId}/${mediaItem.video}`;
        mediaElement.controls = true;
        mediaElement.alt = mediaItem.title;
      } else {
        // Gestion du cas où le média n'est ni une image ni une vidéo
        mediaElement = document.createElement("p");
        mediaElement.textContent = "Média non disponible";
        console.error("Erreur: le média n'a ni image ni vidéo.");
      }
  
      // Ajouter un écouteur d'événements pour ouvrir le slider
      mediaItemDiv.addEventListener('click', () => {
        openSlider(index);
      });
  
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

    // Fonction pour mettre à jour l'état actif du bouton de tri
    function updateSortButtonActiveState(activeButton) {
        const sortButtons = document.querySelectorAll('.sort-button');
        sortButtons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }

    // Fonction pour ouvrir le slider
    function openSlider(index) {
        currentMediaIndex = index;
        if (!slider) { // Initialisation du slider seulement si ce n'est pas déjà fait
            slider = document.createElement('div');
            slider.classList.add('slider');
            slider.classList.add('open');
            document.body.appendChild(slider);

            sliderContent = document.createElement('div');
            sliderContent.classList.add('slider-content');
            slider.appendChild(sliderContent);

            prevButton = document.createElement('button');
            prevButton.textContent = '<';
            prevButton.classList.add('slider-prev');
            prevButton.addEventListener('click', showPreviousMedia);
            slider.appendChild(prevButton);

            nextButton = document.createElement('button');
            nextButton.textContent = '>';
            nextButton.classList.add('slider-next');
            nextButton.addEventListener('click', showNextMedia);
            slider.appendChild(nextButton);

            closeButton = document.createElement('span');
            closeButton.textContent = '×';
            closeButton.classList.add('slider-close');
            closeButton.addEventListener('click', closeSlider);
            slider.appendChild(closeButton);
        }

        updateSlider(); 
    }

    // Fonction pour afficher le média précédent
    function showPreviousMedia() {
        currentMediaIndex = (currentMediaIndex - 1 + media.length) % media.length;
        updateSlider();
    }

    // Fonction pour afficher le média suivant
    function showNextMedia() {
        currentMediaIndex = (currentMediaIndex + 1) % media.length;
        updateSlider();
    }

    // Fonction pour mettre à jour le contenu du slider
    function updateSlider() {
        const sliderContent = document.querySelector('.slider-content');
        sliderContent.innerHTML = ''; // Effacer le contenu précédent

        const mediaElement = media[currentMediaIndex];
        let sliderMedia;
        if (mediaElement.image) {
            sliderMedia = document.createElement('img');
            sliderMedia.src = `./assets/Sample Photos/${mediaElement.photographerId}/${mediaElement.image}`;
            sliderMedia.alt = mediaElement.title; // Ajout de l'attribut alt pour l'image
        } else if (mediaElement.video) {
            sliderMedia = document.createElement('video');
            sliderMedia.src = `./assets/Sample Photos/${mediaElement.photographerId}/${mediaElement.video}`;
            sliderMedia.controls = true;
            sliderMedia.alt = mediaElement.title; // Ajout de l'attribut alt pour la vidéo
        }

        sliderContent.appendChild(sliderMedia);
}
    
        // Fonction pour fermer le slider
        function closeSlider() {
            const slider = document.querySelector('.slider');
            if (slider) {
                slider.remove();
            }
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
    