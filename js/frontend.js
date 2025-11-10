// Handle unmute/mute buttons and volume slider
const playBtn = document.getElementById("audioIcon-paused");
const pauseBtn = document.getElementById("audioIcon-playing");
const volumeSlider = document.getElementById("volumeSlider");

if (playBtn && pauseBtn && volumeSlider && audio) {
    playBtn.addEventListener("click", () => {
        // audio.allowNewPlays();
        // audio.resumePlaylist("bg.music");

        audio.setMasterVolume(parseInt(volumeSlider.value, 10));

        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
    });

    pauseBtn.addEventListener("click", () => {
        // audio.disAllowNewPlays();
        // audio.pausePlaylist("bg.music");

        audio.setMasterVolume(0);

        pauseBtn.style.display = "none";
        playBtn.style.display = "block";
    });

    volumeSlider.addEventListener("input", (event) => {
        const volume = parseInt(event.target.value, 10);
        audio.setMasterVolume(volume);
    });
}