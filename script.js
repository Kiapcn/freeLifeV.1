document.addEventListener("DOMContentLoaded", () => {
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const emailPopup = document.getElementById("email-popup");
    const emailInput = document.getElementById("email-input");
    const sendEmailButton = document.getElementById("send-email-button");

    // Activer la caméra
    startScanButton.addEventListener("click", async () => {
        cameraContainer.classList.remove("hidden");
        scanButton.classList.remove("hidden");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
        } catch (error) {
            alert("Impossible d'accéder à la caméra.");
        }
    });

    // Lancer le scan
    scanButton.addEventListener("click", () => {
        scanButton.disabled = true;
        countdown.classList.remove("hidden");
        let timeLeft = 7;
        countdown.textContent = timeLeft;

        const flashInterval = setInterval(() => {
            cameraContainer.style.backgroundColor =
                cameraContainer.style.backgroundColor === "white" ? "black" : "white";
        }, 100);

        const audio = new Audio("router-sound.mp3");
        audio.play();

        const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            countdown.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(countdownInterval);
                clearInterval(flashInterval);
                cameraContainer.style.backgroundColor = "black";
                audio.pause();
                countdown.classList.add("hidden");
                emailPopup.classList.remove("hidden");
                scanButton.disabled = false;
            }
        }, 1000);
    });

    // Envoi de l'email
    sendEmailButton.addEventListener("click", () => {
        const email = emailInput.value;
        if (email && email.includes("@")) {
            alert(`Un e-mail a été envoyé à ${email} avec un message personnalisé.`);
            emailPopup.classList.add("hidden");
        } else {
            alert("Veuillez entrer une adresse e-mail valide.");
        }
    });
});
