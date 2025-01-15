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

    function detectFace() {
        const detectionInterval = setInterval(() => {
            if (!isFaceDetected) {
                const randomDetect = Math.random() > 0.95;
                if (randomDetect) {
                    isFaceDetected = true;
                    faceGuide.style.borderColor = "green";

                    setTimeout(() => {
                        faceGuide.classList.add("hidden");
                        scanButton.classList.remove("hidden"); // Affiche le bouton Scan après détection
                    }, 2000);

                    clearInterval(detectionInterval);
                }
            }
        }, 500);
    }

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

                canvas.width = cameraFeed.videoWidth;
                canvas.height = cameraFeed.videoHeight;
                ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

                cameraFeed.srcObject = null;
                cameraFeed.style.background = `url(${canvas.toDataURL("image/png")}) no-repeat center`;
                cameraFeed.style.backgroundSize = "cover";

                countdown.classList.add("hidden");
                successMessageContainer.classList.remove("hidden");
            }
        }, 1000);
    });
});
