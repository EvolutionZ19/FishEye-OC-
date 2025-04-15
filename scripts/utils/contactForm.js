function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex"; 
    modal.setAttribute("aria-hidden", "false");

    // Empêche le scroll de fond
    document.body.classList.add("no-scroll");

    // Mettre le focus sur le champ Prénom à l’ouverture
    const firstInput = modal.querySelector("#first");
    if (firstInput) firstInput.focus();
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    // Restaure le scroll de fond
    document.body.classList.remove("no-scroll");

    // Rendre le focus au bouton "Contactez-moi"
    const mainButton = document.querySelector('.photograph-header .contact_button');
    if (mainButton) mainButton.focus();
}

// Validation du formulaire : affichage des données en console
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#contact_modal form");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const prenom = form.first.value;
            const nom = form.last.value;
            const email = form.email.value;
            const message = form.message.value;

            console.log("------ Formulaire envoyé ------");
            console.log("Prénom :", prenom);
            console.log("Nom :", nom);
            console.log("Email :", email);
            console.log("Message :", message);
            console.log("-------------------------------");

            form.reset(); // Réinitialiser le formulaire
        });
    }
});
  
// GESTION DU FOCUS TRAP DANS LA MODALE
document.addEventListener("keydown", function (e) {
    const modal = document.getElementById("contact_modal");

    if (modal.style.display === "block") {
        const focusableSelectors = 'input, textarea, button, [tabindex]:not([tabindex="-1"])';
        const focusables = modal.querySelectorAll(focusableSelectors);
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        // Touche TAB
        if (e.key === "Tab") {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                // Tab normal
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        }

        // Touche ÉCHAP pour fermer
        if (e.key === "Escape") {
            closeModal();
        }
    }
});
