document.addEventListener("DOMContentLoaded", () => {
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const randomMessage = document.getElementById("random-message");
    const formSection = document.getElementById("form-section");

    // Liste des messages aléatoires
    const messages = [
        "Merci d’avoir utilisé notre service ! Votre diagnostic est parfait : tout va pour le mieux pour vous.",
        "Félicitations, votre diagnostic est idéal. Profitez de votre excellente santé !",
        "Vous êtes en parfaite santé. Merci de nous avoir fait confiance.",
        "Votre diagnostic est irréprochable. Continuez à prendre soin de vous !",
        "Merci pour votre confiance. Tout va bien pour vous, et nous en sommes ravis.",
        "Votre état de santé est excellent. Merci de faire partie de notre communauté !",
        "Super nouvelle : votre diagnostic est parfait. Restez en pleine forme !",
        "Vous êtes en parfaite santé. Continuez comme ça, et merci d’utiliser nos services.",
        "Tout va pour le mieux dans votre diagnostic. Merci de nous avoir choisis.",
        "Merci d’avoir utilisé FreeLife. Votre santé est au top !",
    ];

    // Chargement du son pour le scan
    const audio = new Audio("scan-sound.mp3");

    // Activer la caméra
    startScanButton.addEventListener("click", async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
            cameraFeed.play();
            cameraContainer.classList.remove("hidden");
            scanButton.style.display = "block"; // Affiche le bouton Scan
        } catch (error) {
            alert("Impossible d'accéder à la caméra. Veuillez vérifier les autorisations.");
        }
    });

    // Gestion du scan
    scanButton.addEventListener("click", () => {
        audio.play(); // Joue le son pendant le scan
        scanButton.style.display = "none"; // Cache le bouton Scan
        countdown.classList.remove("hidden");
        let timeLeft = 7; // Temps de compte à rebours
        countdown.textContent = timeLeft;

        // Effet de flash rapide
        const flashInterval = setInterval(() => {
            cameraContainer.style.backgroundColor =
                cameraContainer.style.backgroundColor === "white" ? "black" : "white";
        }, 100);
// Effet de flash pour le scan
scanButton.addEventListener("click", () => {
    scanButton.disabled = true;
    countdown.classList.remove("hidden");
    let timeLeft = 7;
    countdown.textContent = timeLeft;

    // Effet de flash pour simuler l'effet de diagnostic
    const flashInterval = setInterval(() => {
        cameraContainer.style.backgroundColor =
            cameraContainer.style.backgroundColor === "white" ? "black" : "white";
    }, 100);

    const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        countdown.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            clearInterval(flashInterval);
            cameraContainer.style.backgroundColor = "black"; // Réinitialise le fond noir
            countdown.classList.add("hidden");
            scanButton.disabled = false; // Réactive le bouton Scan après 7 secondes
        }
    }, 1000);
});

        // Compte à rebours pour le scan
        const countdownInterval = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(countdownInterval);
                clearInterval(flashInterval);
                cameraContainer.style.backgroundColor = "black"; // Réinitialise le fond
                countdown.classList.add("hidden");

                // Affiche un message aléatoire
                const random = messages[Math.floor(Math.random() * messages.length)];
                randomMessage.textContent = random;
                randomMessage.classList.remove("hidden");

                // Affiche le formulaire après le scan
                formSection.classList.remove("hidden");

                // Réaffiche le bouton Scan après 10 secondes
                setTimeout(() => {
                    scanButton.style.display = "block";
                }, 10000);
            }
        }, 1000);
    });

    // Validation du formulaire
    const profileForm = document.getElementById("profile-form");
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Vous êtes bien inscrit à notre liste d’attente. Merci !");
        formSection.classList.add("hidden"); // Cache le formulaire après validation
    });
});
