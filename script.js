document.addEventListener("DOMContentLoaded", () => {
    const startScanButton = document.getElementById("start-scan-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraFeed = document.getElementById("camera-feed");
    const scanButton = document.getElementById("scan-button");
    const countdown = document.getElementById("countdown");
    const randomMessage = document.getElementById("random-message");
    const formSection = document.getElementById("form-section");
    const profileForm = document.getElementById("profile-form");

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
        "Merci d’avoir utilisé Scan Médical. Votre santé est au top !",
    ];

    const audio = new Audio("scan-sound.mp3");

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
        scanButton.disabled = true; // Désactive temporairement le bouton Scan
        randomMessage.classList.add("hidden"); // Cache le message précédent
        countdown.classList.remove("hidden");
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

                const random = messages[Math.floor(Math.random() * messages.length)];
                randomMessage.textContent = random;
                randomMessage.classList.remove("hidden");
                formSection.classList.remove("hidden");

                scanButton.disabled = false; // Réactive le bouton Scan pour un nouveau scan
            }
        }, 1000);

        audio.play(); // Joue le son pendant le scan
    });

    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Vous êtes bien inscrit à notre liste d’attente. Merci !");
        formSection.classList.add("hidden");
    });
});
