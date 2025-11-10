class SoundHandler {
    constructor() {
        this.playLists = {};
    }

    addPlaylist(strid, songs, loop = false, delay = 0) {
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
        if (!playlist || !playlist.isPlaying) return;

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
        if (!playlist || !playlist.isPaused) return;

        const audio = playlist.songs[playlist.currentSongIndex];
        if (audio && audio.paused) {
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

    addSound(strid, song, loop, delay = 0) {
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
