const playBtn = document.getElementById("audioIcon-paused");
const pauseBtn = document.getElementById("audioIcon-playing");

if (playBtn && pauseBtn && audio) {
    playBtn.addEventListener("click", () => {
        audio.allowNewPlays();
        audio.resumePlaylist("bg.music");
        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
    });

    pauseBtn.addEventListener("click", () => {
        audio.disAllowNewPlays();
        audio.pausePlaylist("bg.music");
        pauseBtn.style.display = "none";
        playBtn.style.display = "block";
    });
}