// Helper to map linear slider value (0-100) to logarithmic volume (0.0-1.0), for correct volume perception
function mapSliderToVolume(value) {
    // Clamp
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    if (value === 0) return 0.0;
    const minp = 0;
    const maxp = 100;
    const minv = Math.log(0.001); // avoid silence being log(0)
    const maxv = Math.log(1);
    const scale = (maxv - minv) / (maxp - minp);
    return Math.exp(minv + scale * (value - minp));
}

// Main sound handler class
class SoundHandler {
    constructor(masterVolume = 1.0) {
        this._disAllowNewPlays = false;
        this.playLists = {};
        this.masterVolume = mapSliderToVolume(masterVolume);
    }

    // Setter for volume that also applies the log-correction
    setMasterVolume(linearVolume) {
        this.masterVolume = mapSliderToVolume(linearVolume);

        // Find any audios that are playing and update their volume
        for (const id in this.playLists) {
            const playlist = this.playLists[id];
            if (playlist.isPlaying && !playlist.isPaused) {
                const audio = playlist.songs[playlist.currentSongIndex];
                if (audio) {
                    audio.volume = this.masterVolume;
                }
            }
        }
    }

    // Disable starting new plays (used internally in mute/unmute logic)
    disAllowNewPlays() {
        this._disAllowNewPlays = true;
    }

    // Re-enable starting new plays
    allowNewPlays() {
        this._disAllowNewPlays = false;
    }

    // Add a playlist of songs, songs is array of Audio() objects or URL-strings/filepath-strings
    addPlaylist(strid, songs, loop = false, delay = 0) {
        // Throw if type of songs is not list
        if (!Array.isArray(songs)) {
            throw new Error("Songs must be an array");
        }

        // If strid is not string throw
        if (typeof strid !== "string") {
            throw new Error("strid must be a string");
        }

        // If strid already exists throw
        if (this.playLists[strid]) {
            throw new Error(`Playlist/Sound with strid ${strid} already exists`);
        }

        // if your playlist has single song duplicate it to fix wrap around issues
        if (songs.length === 1 && loop === true) {
            songs.push(songs[0]);
        }

        // Convert URLs to Audio objects if needed
        songs = songs.map(song => typeof song === "string" ? new Audio(song) : song);

        this.playLists[strid] = {
            songs,
            loop,
            delay,
            currentSongIndex: 0,
            isPlaying: false,
            isPaused: false,
            timerId: null
        };
    }



    removePlaylist(strid) {
        const playlist = this.playLists[strid];
        if (!playlist) return;

        this.stopPlaylist(strid);
        delete this.playLists[strid];
    }

    playPlaylist(strid) {
        const playlist = this.playLists[strid];
        if (!playlist || playlist.isPlaying) return;

        playlist.isPlaying = true;
        playlist.isPaused = false;
        playlist.currentSongIndex = 0;

        this.playNextSong(strid);
    }

    playNextSong(strid) {
        const playlist = this.playLists[strid];
        if (!playlist || !playlist.isPlaying || playlist.isPaused || this._disAllowNewPlays) return;

        const index = playlist.currentSongIndex;
        if (index < 0 || index >= playlist.songs.length) {
            if (playlist.loop) {
                playlist.currentSongIndex = 0;
            } else {
                playlist.isPlaying = false;
                return;
            }
        }

        const audio = playlist.songs[playlist.currentSongIndex];
        if (!audio) return;

        // Reset and play
        audio.currentTime = 0;

        // Clean up old listeners to avoid duplication
        audio.onended = null;
        audio.onerror = null;

        // When song ends, move to next
        audio.onended = () => {
            if (!playlist.isPlaying) return;

            playlist.currentSongIndex++;
            if (playlist.currentSongIndex >= playlist.songs.length) {
                if (playlist.loop) {
                    playlist.currentSongIndex = 0;
                } else {
                    playlist.isPlaying = false;
                    return;
                }
            }

            // Handle optional delay between tracks
            if (playlist.delay > 0 && playlist.isPlaying) {
                clearTimeout(playlist.timerId);
                playlist.timerId = setTimeout(() => {
                    this.playNextSong(strid);
                }, playlist.delay);
            } else {
                this.playNextSong(strid);
            }
        };

        audio.onerror = () => {
            console.warn(`Error playing track ${playlist.currentSongIndex} in ${strid}`);
            playlist.isPlaying = false;
        };

        audio.volume = this.masterVolume;

        audio.play().catch(err => {
            console.warn(`Playback failed for ${strid}:`, err);
            playlist.isPlaying = false;
        });
    }

    pausePlaylist(strid) {
        const playlist = this.playLists[strid];
        if (!playlist || !playlist.isPlaying || playlist.isPaused) return;

        const audio = playlist.songs[playlist.currentSongIndex];
        if (audio && !audio.paused) audio.pause();

        playlist.isPaused = true;
        clearTimeout(playlist.timerId);
    }

    resumePlaylist(strid) {
        const playlist = this.playLists[strid];

        // Was it never started play it instead
        if (!playlist.isPlaying) {            
            this.playNextSong(strid);
            return;
        } 

        if (!playlist || !playlist.isPaused) return;

        const audio = playlist.songs[playlist.currentSongIndex];
        if (audio && audio.paused) {
            audio.volume = this.masterVolume;
            audio.play()
                .catch(err => console.warn(`Resume failed for ${strid}:`, err));
        }

        playlist.isPaused = false;
    }

    stopPlaylist(strid) {
        const playlist = this.playLists[strid];
        if (!playlist) return;

        playlist.isPlaying = false;
        playlist.isPaused = false;
        clearTimeout(playlist.timerId);

        const audio = playlist.songs[playlist.currentSongIndex];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.onended = null;
            audio.onerror = null;
        }
    }

    stopAllPlaylists() {
        for (const id in this.playLists) {
            this.stopPlaylist(id);
        }
    }

    // Sound methods are aliases but for single sound-playlists
    addSound(strid, song, loop, delay = 0) {
        // If song is not string or Audio object throw
        if (typeof song !== "string" && !(song instanceof Audio)) {
            throw new Error("Song must be a string URL or Audio object");
        }

        // If strid is not string throw
        if (typeof strid !== "string") {
            throw new Error("strid must be a string");
        }

        // If strid already exists throw
        if (this.playLists[strid]) {
            throw new Error(`Playlist/Sound with strid ${strid} already exists`);
        }

        this.addPlaylist(strid, [song], loop, delay);
    }

    removeSound(strid) {
        this.removePlaylist(strid);
    }

    playSound(strid) {
        this.playPlaylist(strid);
    }

    stopSound(strid) {
        this.stopPlaylist(strid);
    }

    pauseSound(strid) {
        this.pausePlaylist(strid);
    }

    resumeSound(strid) {
        this.resumePlaylist(strid);
    }
}
