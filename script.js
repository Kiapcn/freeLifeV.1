// Ajout d'effets supplémentaires si nécessaire
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script chargé avec succès !");
});

document.addEventListener("DOMContentLoaded", () => {
    const scanButton = document.getElementById("scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanInstructions = document.getElementById("scan-instructions");
    const emailPopup = document.getElementById("email-popup");
    const emailInput = document.getElementById("email-input");
    const sendEmailButton = document.getElementById("send-email-button");
    const emailMessage = document.getElementById("email-message");

    // Gestion du bouton Go Scan
    scanButton.addEventListener("click", async () => {
        cameraContainer.classList.remove("hidden");
        scanInstructions.classList.remove("hidden");

        // Activer la caméra
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
        } catch (error) {
            alert("Impossible d'accéder à la caméra.");
        }
    });

    // Animation de flash lors du scan
    cameraFeed.addEventListener("click", () => {
        scanInstructions.textContent = "Scannage en cours...";
        let flashInterval = setInterval(() => {
            cameraContainer.style.backgroundColor = cameraContainer.style.backgroundColor === "white" ? "black" : "white";
        }, 200);

        // Arrêter l'animation après 5 secondes
        setTimeout(() => {
            clearInterval(flashInterval);
            cameraContainer.style.backgroundColor = "black";
            emailPopup.classList.remove("hidden");
        }, 5000);
    });

    // Gestion de l'envoi de l'e-mail
    sendEmailButton.addEventListener("click", () => {
        const email = emailInput.value;
        if (email && email.includes("@")) {
            emailMessage.textContent = "Bravo, tu as été scanné !";
            emailMessage.classList.remove("hidden");

            // Simuler l'envoi d'un e-mail
            setTimeout(() => {
                alert(`Un e-mail a été envoyé à : ${email}`);
                emailPopup.classList.add("hidden");
            }, 2000);
        } else {
            alert("Veuillez entrer une adresse e-mail valide.");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const main = document.querySelector("main");

    // Calcul automatique de la hauteur du header
    const adjustMainMargin = () => {
        const headerHeight = header.offsetHeight; // Hauteur totale du header
        main.style.marginTop = `${headerHeight}px`; // Applique la marge équivalente
    };

    // Ajuste la marge au chargement et au redimensionnement de l'écran
    adjustMainMargin();
    window.addEventListener("resize", adjustMainMargin);
});
