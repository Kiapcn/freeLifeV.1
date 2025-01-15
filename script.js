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

    // Activation de la caméra
    startScanButton.addEventListener("click", async () => {
        try {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }

            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }, // Utiliser la caméra frontale
            });
            cameraFeed.srcObject = stream;
            await cameraFeed.play();

            cameraContainer.classList.remove("hidden");
            faceGuide.classList.remove("hidden");
            successMessageContainer.classList.add("hidden");
            scanButton.classList.add("hidden");
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
                const randomDetect = Math.random() > 0.95; // Simule une détection aléatoire
                if (randomDetect) {
                    isFaceDetected = true;

                    // Capture l'image et fige l'écran
                    canvas.width = cameraFeed.videoWidth;
                    canvas.height = cameraFeed.videoHeight;
                    ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

                    // Figer l'image sur mobile
                    cameraFeed.srcObject.getTracks().forEach((track) => track.stop());
                    cameraFeed.srcObject = null;
                    cameraFeed.style.background = `url(${canvas.toDataURL("image/png")}) no-repeat center`;
                    cameraFeed.style.backgroundSize = "cover";

                    faceGuide.classList.add("hidden");
                    scanButton.classList.remove("hidden");

                    clearInterval(detectionInterval);
                }
            }
        }, 500);
    }

    // Lancement du scan
    scanButton.addEventListener("click", () => {
        if (!countdown) {
            console.error("Le décompte est manquant dans le DOM.");
            return;
        }

        scanButton.classList.add("hidden");
        countdown.classList.remove("hidden");
        let timeLeft = 7;
        countdown.textContent = timeLeft;

        // Lecture du son et flash simulé
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
