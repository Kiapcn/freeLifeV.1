document.addEventListener("DOMContentLoaded", () => {
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const successMessageContainer = document.getElementById("success-message-container");
    const faceGuide = document.getElementById("face-guide");

    // Canvas pour capturer une photo figée
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scanSound = new Audio("scan-sound.mp3");
    let isFaceDetected = false;
    let stream;

    // Fonction pour activer/désactiver la lampe torche
    async function toggleFlash(state) {
        if (stream) {
            const [track] = stream.getVideoTracks();
            if (track.getCapabilities().torch) {
                const settings = { advanced: [{ torch: state }] };
                track.applyConstraints(settings).catch((error) => {
                    console.error("Erreur avec la torche :", error);
                });
            }
        }
    }

    // Fonction pour clignoter le flash pendant le scan
    function startFlashEffect() {
        let isOn = false;
        const flashInterval = setInterval(() => {
            isOn = !isOn;
            toggleFlash(isOn);
        }, 500); // Clignotement deux fois par seconde

        setTimeout(() => {
            clearInterval(flashInterval);
            toggleFlash(false); // Désactiver le flash après 7 secondes
        }, 7000);
    }

    // Activation de la caméra
    startScanButton.addEventListener("click", async () => {
        try {
            // Arrêter les flux existants avant de démarrer un nouveau
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }

            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            cameraFeed.srcObject = stream;

            cameraFeed.style.width = "100%";
            cameraFeed.style.height = "auto";
            cameraFeed.style.objectFit = "cover";

            await cameraFeed.play();

            cameraContainer.classList.remove("hidden");
            scanButton.classList.add("hidden");
            faceGuide.classList.remove("hidden");
            successMessageContainer.classList.add("hidden");
            isFaceDetected = false;
            detectFace(); // Simuler la détection du visage
        } catch (error) {
            console.error("Erreur d'accès à la caméra :", error);
            alert("Impossible d'accéder à la caméra. Veuillez vérifier vos permissions.");
        }
    });

    // Fonction de détection simulée (projet réel nécessiterait une bibliothèque comme FaceAPI)
    function detectFace() {
        const detectionInterval = setInterval(() => {
            if (!isFaceDetected) {
                const randomDetect = Math.random() > 0.95;
                if (randomDetect) {
                    isFaceDetected = true;
                    clearInterval(detectionInterval);
                    faceGuide.style.borderColor = "green"; // Indiquer la détection
                    cameraFeed.pause();
                    scanButton.classList.remove("hidden");
                }
            }
        }, 500);
    }

    // Lancement du scan
    scanButton.addEventListener("click", () => {
        if (!countdown || !cameraFeed || !successMessageContainer) {
            console.error("Un ou plusieurs éléments requis sont manquants dans le DOM.");
            return;
        }

        scanButton.classList.add("hidden");
        countdown.classList.remove("hidden");
        let timeLeft = 7;
        countdown.textContent = timeLeft;

        // Démarrer le flash et le son
        startFlashEffect();
        scanSound.play().catch((error) => console.error("Erreur lors de la lecture du son :", error));

        // Compte à rebours
        const interval = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(interval);

                // Capture une image figée
                canvas.width = cameraFeed.videoWidth;
                canvas.height = cameraFeed.videoHeight;
                ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

                cameraFeed.srcObject = null; // Arrêter le flux vidéo
                cameraFeed.style.background = `url(${canvas.toDataURL("image/png")}) no-repeat center`;
                cameraFeed.style.backgroundSize = "cover";

                countdown.classList.add("hidden");
                successMessageContainer.classList.remove("hidden");
            }
        }, 1000);
    });
});
