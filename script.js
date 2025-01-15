document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments DOM
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const successMessageContainer = document.getElementById("success-message-container");
    const faceGuide = document.getElementById("face-guide");

    // Messages aléatoires pour le diagnostic
    const messages = [
        "Merci d’avoir utilisé notre service ! Votre diagnostic est parfait.",
        "Félicitations, votre diagnostic est idéal.",
        "Vous êtes en parfaite santé.",
    ];

    // Audio setup
    const scanSound = new Audio("scan-sound.mp3");

    let isFaceDetected = false;

    // Fonction pour simuler un flash
    function simulateFlash() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        if (isMobile) {
            // Sur mobile, le conteneur de la caméra clignote
            cameraContainer.style.backgroundColor = "white";
            setTimeout(() => {
                cameraContainer.style.backgroundColor = "black";
            }, 100); // Flash rapide
        } else {
            // Sur PC, le body clignote
            document.body.style.backgroundColor = "white";
            setTimeout(() => {
                document.body.style.backgroundColor = "black";
            }, 100); // Flash rapide
        }
    }

    // Activation de la caméra (caméra avant)
    startScanButton.addEventListener("click", async () => {
        try {
            // Arrêter les flux existants avant de démarrer un nouveau
            if (cameraFeed.srcObject) {
                const tracks = cameraFeed.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }, // Utiliser la caméra avant
            });
            cameraFeed.srcObject = stream;

            // Gestion de la taille pour qu'elle reste dans le conteneur
            cameraFeed.style.width = "100%";
            cameraFeed.style.height = "auto";
            cameraFeed.style.objectFit = "cover"; // Ajuster pour rester dans le cadre

            await cameraFeed.play(); // Assurez-vous que play() est appelé après avoir défini le flux

            cameraContainer.classList.remove("hidden");
            scanButton.classList.add("hidden"); // Désactiver le bouton Scan au départ
            faceGuide.classList.remove("hidden"); // Montrer la forme de visage
            detectFace(); // Lancer la détection du visage
        } catch (error) {
            console.error("Erreur d'accès à la caméra :", error);
            alert("Impossible d'accéder à la caméra. Veuillez vérifier vos permissions ou utiliser un site sécurisé (https).");
        }
    });

    // Fonction de détection simulée (projet réel nécessiterait une bibliothèque comme FaceAPI)
    function detectFace() {
        const detectionInterval = setInterval(() => {
            if (!isFaceDetected) {
                // Simulation d'une détection de visage
                const randomDetect = Math.random() > 0.95; // 5% de chance de "détecter"
                if (randomDetect) {
                    isFaceDetected = true;
                    clearInterval(detectionInterval);
                    faceGuide.style.borderColor = "green"; // Changer la couleur pour indiquer la détection
                    cameraFeed.pause(); // Figer la caméra
                    scanButton.classList.remove("hidden"); // Activer le bouton Scan
                }
            }
        }, 500); // Vérifier toutes les 500ms
    }

    // Lancement du scan après détection
    scanButton.addEventListener("click", () => {
        if (!countdown || !cameraFeed || !successMessageContainer) {
            console.error("Un ou plusieurs éléments requis sont manquants dans le DOM.");
            return;
        }

        scanButton.classList.add("hidden");
        countdown.classList.remove("hidden");
        let timeLeft = 7;
        countdown.textContent = timeLeft;

        // Lecture du son pendant le scan
        scanSound.play().catch((error) => console.error("Erreur lors de la lecture du son :", error));

        // Début des flashs et du compte à rebours
        const interval = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            // Simuler un flash à chaque seconde
            simulateFlash();

            if (timeLeft === 0) {
                clearInterval(interval);

                // Arrêter la caméra après le scan
                const tracks = cameraFeed.srcObject ? cameraFeed.srcObject.getTracks() : [];
                tracks.forEach((track) => track.stop());

                countdown.classList.add("hidden");
                successMessageContainer.classList.remove("hidden");
            }
        }, 1000);
    });
});
