document.addEventListener("DOMContentLoaded", () => {
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const randomMessage = document.getElementById("random-message");
    const formSection = document.getElementById("form-section");
    const scanEffect = document.getElementById("scan-effect"); // Ligne rouge animée

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
        scanEffect.classList.add("active"); // Active la ligne rouge
        let timeLeft = 7; // Temps de compte à rebours
        countdown.textContent = timeLeft;

        // Effet de flash rapide
        const flashInterval = setInterval(() => {
            cameraContainer.style.backgroundColor =
                cameraContainer.style.backgroundColor === "white" ? "black" : "white";
        }, 100);

        // Compte à rebours pour le scan
        const countdownInterval = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(countdownInterval);
                clearInterval(flashInterval);
                cameraContainer.style.backgroundColor = "black"; // Réinitialise le fond
                countdown.classList.add("hidden");
                scanEffect.classList.remove("active"); // Désactive la ligne rouge

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
document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("scan-page")) {
        const startScanButton = document.getElementById("start-scan-button");
        const cameraContainer = document.getElementById("camera-container");
        const cameraFeed = document.getElementById("camera-feed");
        const scanButton = document.getElementById("scan-button");
        const countdown = document.getElementById("countdown");
        const randomMessage = document.getElementById("random-message");
        const formSection = document.getElementById("form-section");
        const scanEffect = document.getElementById("scan-effect");

        const messages = [
            "Merci d’avoir utilisé notre service ! Votre diagnostic est parfait.",
            "Félicitations, votre diagnostic est idéal.",
            "Vous êtes en parfaite santé.",
        ];

        const audio = new Audio("scan-sound.mp3");

        startScanButton.addEventListener("click", async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                cameraFeed.srcObject = stream;
                cameraFeed.play();
                cameraContainer.classList.remove("hidden");
                scanButton.style.display = "block";
            } catch (error) {
                alert("Impossible d'accéder à la caméra.");
            }
        });

        scanButton.addEventListener("click", () => {
            audio.play();
            scanButton.style.display = "none";
            countdown.classList.remove("hidden");
            scanEffect.classList.add("active");
            let timeLeft = 7;
            countdown.textContent = timeLeft;

            const flashInterval = setInterval(() => {
                cameraContainer.style.backgroundColor =
                    cameraContainer.style.backgroundColor === "white" ? "black" : "white";
            }, 100);

            const countdownInterval = setInterval(() => {
                timeLeft--;
                countdown.textContent = timeLeft;

                if (timeLeft === 0) {
                    clearInterval(countdownInterval);
                    clearInterval(flashInterval);
                    cameraContainer.style.backgroundColor = "black";
                    countdown.classList.add("hidden");
                    scanEffect.classList.remove("active");

                    const random = messages[Math.floor(Math.random() * messages.length)];
                    randomMessage.textContent = random;
                    randomMessage.classList.remove("hidden");
                    formSection.classList.remove("hidden");

                    setTimeout(() => {
                        scanButton.style.display = "block";
                    }, 10000);
                }
            }, 1000);
        });

        const profileForm = document.getElementById("profile-form");
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Inscription réussie. Merci !");
            formSection.classList.add("hidden");
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("scan-page")) {
        const cameraFeed = document.getElementById("camera-feed");

        // Ajustement dynamique de la taille de la caméra
        function adjustCameraSize() {
            const container = document.querySelector(".camera-container");
            const screenHeight = window.innerHeight;

            // Limite la hauteur de la caméra à 50% de l'écran pour les mobiles
            if (window.innerWidth <= 768) {
                container.style.height = `${screenHeight * 0.5}px`;
            } else {
                container.style.height = `auto`; // Réinitialise pour les grands écrans
            }
        }

        // Applique l'ajustement au chargement et lors du redimensionnement
        adjustCameraSize();
        window.addEventListener("resize", adjustCameraSize);
    }
});
