
// Get elements
const video = document.getElementById("presentation-video");
const playPauseButton = document.getElementById("play-pause");
const muteButton = document.getElementById("mute");
const fullScreenButton = document.getElementById("full-screen");
const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");
const playPauseIcon = document.getElementById('play-pause-icon');
const muteIcon = document.getElementById('mute-icon');

// Play/Pause functionality
playPauseButton.addEventListener("click", function() {
    if (video.paused) {
        video.play();
		playPauseIcon.src = "img/menu/pause.png"; // Switch to pause icon
		sendReply('Video set to Play Using button.');
    } else {
        video.pause();
		playPauseIcon.src = "img/menu/play.png"; // Switch to play icon
		sendReply('Video set to Pause Using button.');
    }
});

// Update seek bar as the video plays
video.addEventListener("timeupdate", function() {
    const value = (100 / video.duration) * video.currentTime;
    seekBar.value = value;
});

// Update the icon when video ends
video.addEventListener('ended', function() {
    playPauseIcon.src = "img/menu/play.png"; // Reset to play icon when video ends
	sendReply('The Video reached the end.');
});

// Seek functionality
seekBar.addEventListener("input", function() {
    const time = video.duration * (seekBar.value / 100);
    video.currentTime = time;
});

// Mute/Unmute functionality with image swap
muteButton.addEventListener('click', function() {
    if (video.muted) {
        video.muted = false;
        muteIcon.src = "img/menu/sound.png"; // Switch to unmute icon
    } else {
        video.muted = true;
        muteIcon.src = "img/menu/mute.png"; // Switch to mute icon
    }
});

// Volume control
volumeBar.addEventListener("input", function() {
    video.volume = volumeBar.value;
});

// Toggle play/pause when clicking on the video itself
video.addEventListener("click", function() {
    if (video.paused) {
        video.play();
		playPauseIcon.src = "img/menu/pause.png"; // Switch to pause icon
		sendReply('Video set to Playing Via Touch.');
    } else {
        video.pause();
		playPauseIcon.src = "img/menu/play.png"; // Switch to play icon
		sendReply('Video set to Paused via Touch.');
    }
});

video.addEventListener("timeupdate", function() {
    const value = (100 / video.duration) * video.currentTime;
    seekBar.value = value;

    // Dynamically update the seek bar's background for the progress
    seekBar.style.background = `linear-gradient(to right, var(--text-primary) ${value}%, #ddd ${value}%)`;
});
