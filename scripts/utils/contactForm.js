function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
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
