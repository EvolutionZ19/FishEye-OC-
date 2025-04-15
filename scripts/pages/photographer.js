// Définir photographerId en dehors de toute fonction pour la rendre globale
let photographerId;
let mediaData = []; // Stocker les données des médias globalement

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

        const photographerInfo = document.createElement("div");
        photographerInfo.classList.add("photographer-info");

        photographerInfo.appendChild(h2);
        photographerInfo.appendChild(location);
        photographerInfo.appendChild(taglineElement);
        photographerInfo.appendChild(tagsElement);

        photographHeader.appendChild(photographerInfo);

        const contactButton = document.createElement("button");
        contactButton.classList.add("contact_button");
        contactButton.textContent = "Contactez-moi";
        contactButton.onclick = displayModal;
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
    const firstInput = modal.querySelector("#first");
    if (firstInput) firstInput.focus();
}

// Fonction pour fermer la modale de contact
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";

    const modalButton = modal.querySelector(".contact_button");
    if (modalButton) modalButton.remove();
}

function displayMediaGallery(media, photographerData) {
    mediaData = media;
    const main = document.getElementById('main');
    let currentMediaIndex = 0;
    let slider;
    let sliderContent;
    let prevButton;
    let nextButton;
    let closeButton;

    // ----- TRI -----
    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');
    main.appendChild(sortContainer);

    const sortLabel = document.createElement('span');
    sortLabel.textContent = 'Trier par :';
    sortLabel.classList.add('sort-label');
    sortContainer.appendChild(sortLabel);

    const sortButtonsWrapper = document.createElement('div');
    sortButtonsWrapper.classList.add('sort-buttons-wrapper');
    sortContainer.appendChild(sortButtonsWrapper);

    const sortToggle = document.createElement('button');
    sortToggle.textContent = 'Popularité ▼';
    sortToggle.classList.add('sort-toggle');
    sortButtonsWrapper.appendChild(sortToggle);

    const sortButtons = document.createElement('div');
    sortButtons.classList.add('sort-buttons');
    sortButtons.style.display = 'none';
    sortButtonsWrapper.appendChild(sortButtons);

    const popularityButton = document.createElement('button');
    popularityButton.textContent = 'Popularité';
    popularityButton.classList.add('sort-button');
    popularityButton.addEventListener('click', () => {
        media.sort(sortByPopularity);
        updateGallery();
        updateSortButtonActiveState(popularityButton);
        sortToggle.textContent = 'Popularité ▼';
        sortButtons.style.display = 'none';
    });

    const dateButton = document.createElement('button');
    dateButton.textContent = 'Date';
    dateButton.classList.add('sort-button');
    dateButton.addEventListener('click', () => {
        media.sort(sortByDate);
        updateGallery();
        updateSortButtonActiveState(dateButton);
        sortToggle.textContent = 'Date ▼';
        sortButtons.style.display = 'none';
    });

    const titleButton = document.createElement('button');
    titleButton.textContent = 'Titre';
    titleButton.classList.add('sort-button');
    titleButton.addEventListener('click', () => {
        media.sort(sortByTitle);
        updateGallery();
        updateSortButtonActiveState(titleButton);
        sortToggle.textContent = 'Titre ▼';
        sortButtons.style.display = 'none';
    });

    sortButtons.appendChild(popularityButton);
    sortButtons.appendChild(dateButton);
    sortButtons.appendChild(titleButton);

    // 📌 Toggle ouverture/fermeture
    sortToggle.addEventListener("click", () => {
        sortButtons.style.display = sortButtons.style.display === "block" ? "none" : "block";
    });

    // Tri initial
    media.sort(sortByPopularity);
    popularityButton.classList.add('active');

    // ----- GALERIE -----
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    main.appendChild(gallery);

    function sortByPopularity(a, b) {
        return b.likes - a.likes;
    }

    function sortByDate(a, b) {
        return new Date(b.date) - new Date(a.date);
    }

    function sortByTitle(a, b) {
        return a.title.localeCompare(b.title);
    }

    function updateGallery() {
        gallery.innerHTML = "";

        media.forEach((mediaItem, index) => {
            const mediaItemDiv = document.createElement("div");
            mediaItemDiv.classList.add("media-item");
            mediaItemDiv.setAttribute('data-media-index', index);

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
                mediaElement = document.createElement("div");
            }

            mediaElement.addEventListener('click', () => {
                openSlider(index);
            });

            mediaItemDiv.appendChild(mediaElement);

            const titleLikesContainer = document.createElement("div");
            titleLikesContainer.classList.add("media-title-likes");

            const title = document.createElement("p");
            title.textContent = mediaItem.title;
            title.classList.add("media-title", "media-title-left");

            const likesContainer = document.createElement("div");
            likesContainer.classList.add("media-likes", "media-likes-right");

            const heartButton = document.createElement("button");
            const heartIcon = document.createElement("i");
            heartIcon.classList.add("fas", "fa-heart");
            heartButton.appendChild(heartIcon);
            likesContainer.appendChild(heartButton);

            const likesCount = document.createElement("span");
            likesCount.textContent = mediaItem.likes;
            likesContainer.appendChild(likesCount);

            heartButton.addEventListener('click', function () {
                if (!mediaItem.liked) {
                    mediaItem.likes++;
                    likesCount.textContent = mediaItem.likes;
                    updateTotalLikesAndPrice();
                    mediaItem.liked = true;
                }
            });

            titleLikesContainer.appendChild(title);
            titleLikesContainer.appendChild(likesContainer);
            mediaItemDiv.appendChild(titleLikesContainer);
            gallery.appendChild(mediaItemDiv);
        });
    }

    function updateSortButtonActiveState(activeButton) {
        const sortButtons = document.querySelectorAll('.sort-button');
        sortButtons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }

    // ----- SLIDER -----
    function openSlider(index) {
        currentMediaIndex = index;
        if (!slider) {
            slider = document.createElement('div');
            slider.classList.add('slider', 'open');
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

    function showPreviousMedia() {
        currentMediaIndex = (currentMediaIndex - 1 + media.length) % media.length;
        updateSlider();
    }

    function showNextMedia() {
        currentMediaIndex = (currentMediaIndex + 1) % media.length;
        updateSlider();
    }

    function updateSlider() {
        sliderContent.innerHTML = '';
        const mediaElement = media[currentMediaIndex];

        let sliderMedia;
        if (mediaElement.image) {
            sliderMedia = document.createElement('img');
            sliderMedia.src = `./assets/Sample Photos/${mediaElement.photographerId}/${mediaElement.image}`;
            sliderMedia.alt = mediaElement.title;
        } else if (mediaElement.video) {
            sliderMedia = document.createElement('video');
            sliderMedia.src = `./assets/Sample Photos/${mediaElement.photographerId}/${mediaElement.video}`;
            sliderMedia.controls = true;
            sliderMedia.alt = mediaElement.title;
        }

        sliderContent.appendChild(sliderMedia);
    }

    function closeSlider() {
        const slider = document.querySelector('.slider');
        if (slider) slider.remove();
    }

    document.addEventListener("keydown", function (e) {
        const slider = document.querySelector(".slider.open");
        if (!slider) return;

        switch (e.key) {
            case "ArrowRight":
                showNextMedia();
                break;
            case "ArrowLeft":
                showPreviousMedia();
                break;
            case "Escape":
                closeSlider();
                break;
        }
    });

    async function updateTotalLikesAndPrice() {
        const totalLikes = mediaData.reduce((sum, media) => sum + media.likes, 0);
        const pricePerDay = (await getPhotographer()).price;

        let totalLikesPriceContainer = document.getElementById('total-likes-price');
        if (!totalLikesPriceContainer) {
            totalLikesPriceContainer = document.createElement('div');
            totalLikesPriceContainer.id = 'total-likes-price';
            totalLikesPriceContainer.classList.add('total-likes-price-container');
            document.body.appendChild(totalLikesPriceContainer);
        }

        totalLikesPriceContainer.innerHTML = `
            <div id="total-likes">${totalLikes}</div>
            <i class="fas fa-heart"></i>
            <span class="separator"></span>
            <div id="price-per-day">${pricePerDay}€/jour</div>
        `;
    }

    updateGallery();
    updateTotalLikesAndPrice();
}

// Afficher les données du photographe
async function displayPhotographer() {
    const urlParams = new URLSearchParams(window.location.search);
    photographerId = urlParams.get("id");

    if (photographerId) {
        const photographerData = await getPhotographer();
        if (photographerData) {
            photographerTemplate(photographerData);
        } else {
            console.error("Aucun photographe trouvé avec cet ID.");
        }
    } else {
        console.error("Aucun ID de photographe fourni dans l'URL.");
    }
}

displayPhotographer();
