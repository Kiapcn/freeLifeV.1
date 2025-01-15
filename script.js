document.addEventListener("DOMContentLoaded", () => {
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const randomMessage = document.getElementById("random-message");
    const paymentSection = document.getElementById("payment-section");

    const messages = [
        "Merci d’avoir utilisé notre service ! Votre diagnostic est parfait.",
        "Félicitations, votre diagnostic est idéal.",
        "Vous êtes en parfaite santé.",
    ];

    startScanButton.addEventListener("click", async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
            cameraFeed.play();
            cameraContainer.classList.remove("hidden");
            scanButton.classList.remove("hidden");
        } catch (error) {
            alert("Impossible d'accéder à la caméra.");
        }
    });

    scanButton.addEventListener("click", () => {
        scanButton.classList.add("hidden");
        countdown.classList.remove("hidden");
        let timeLeft = 7;
        countdown.textContent = timeLeft;

        const interval = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(interval);
                cameraFeed.pause();
                countdown.classList.add("hidden");
                const random = messages[Math.floor(Math.random() * messages.length)];
                randomMessage.textContent = random;
                randomMessage.classList.remove("hidden");
                paymentSection.classList.remove("hidden");
            }
        }, 1000);
    });
});
