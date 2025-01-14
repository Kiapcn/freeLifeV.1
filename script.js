document.addEventListener("DOMContentLoaded", () => {
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

        const countdownInterval = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(countdownInterval);
                scanEffect.classList.remove("active");
                randomMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
                randomMessage.classList.remove("hidden");
                formSection.classList.remove("hidden");
                setTimeout(() => {
                    scanButton.style.display = "block";
                }, 5000);
            }
        }, 1000);
    });
});
