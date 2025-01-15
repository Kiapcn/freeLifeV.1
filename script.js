document.addEventListener("DOMContentLoaded", () => {
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const successMessageContainer = document.getElementById("success-message-container");
    const faceGuide = document.getElementById("face-guide");

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

    // Fonction pour démarrer les flashs
    function startFlashEffect() {
        let isOn = false;
        const flashInterval = setInterval(() => {
            isOn = !isOn;
            toggleFlash(isOn);
        }, 500);

        setTimeout(() => {
            clearInterval(flashInterval);
            toggleFlash(false);
        }, 7000);
    }

    // Activation de la caméra
    startScanButton.addEventListener("click", async () => {
        try {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }

            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            cameraFeed.srcObject = stream;

            await cameraFeed.play();

            cameraContainer.classList.remove("hidden");
            scanButton.classList.add("hidden");
            successMessageContainer.classList.add("hidden");

            faceGuide.classList.remove("hidden");
            isFaceDetected = false;
            detectFace();
        } catch (error) {
            console.error("Erreur d'accès à la caméra :", error);
            alert("Impossible d'accéder à la caméra. Veuillez vérifier vos permissions.");
        }
    });

    // Détection de visage simulée
    function detectFace() {
        const detectionInterval = setInterval(() => {
            if (!isFaceDetected) {
                const randomDetect = Math.random() > 0.95;
                if (randomDetect) {
                    isFaceDetected = true;
                    faceGuide.style.borderColor = "green";

                    // Figer l'image
                    setTimeout(() => {
                        canvas.width = cameraFeed.videoWidth;
                        canvas.height = cameraFeed.videoHeight;
                        ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

                        cameraFeed.srcObject = null;
                        cameraFeed.style.background = `url(${canvas.toDataURL("image/png")}) no-repeat center`;
                        cameraFeed.style.backgroundSize = "cover";

                        faceGuide.classList.add("hidden");
                        scanButton.classList.remove("hidden");
                    }, 2000);

                    clearInterval(detectionInterval);
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

        startFlashEffect();
        scanSound.play().catch((error) => console.error("Erreur lors de la lecture du son :", error));

        const interval = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(interval);
                countdown.classList.add("hidden");
                successMessageContainer.classList.remove("hidden");
            }
        }, 1000);
    });
});
