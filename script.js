document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('visualizer'); // Get the canvas element
    const audioFile = document.getElementById('audioFile'); // Get the file input element
    const playPauseButton = document.getElementById('playPause'); // Get the play/pause button
    const ctx = canvas.getContext('2d'); // Get the 2D drawing context for the canvas
    let audioContext; // AudioContext for managing and playing audio
    let audioSource; // Source node for the audio
    let analyser; // Analyser node for getting audio frequency data
    let bufferLength; // Length of the frequency data array
    let dataArray; // Array to hold the frequency data
    let isPlaying = false; // Flag to track if the audio is playing
    let audioBuffer; // Store the decoded audio data
    let startTime = 0; // Track the start time of the audio
    let pauseTime = 0; // Track the paused time

    // Add an event listener to handle file selection
    audioFile.addEventListener('change', handleFiles, false);
    // Add an event listener to handle play/pause button clicks
    playPauseButton.addEventListener('click', togglePlayPause, false);

    // Handle the file selection and read the file
    function handleFiles() {
        const file = this.files[0]; // Get the selected file
        const reader = new FileReader(); // Create a FileReader to read the file
        reader.onload = function(event) {
            const audioData = event.target.result; // Get the file data
            initAudioContext(audioData); // Initialize the audio context with the file data
        };
        reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    }

    // Initialize the AudioContext and set up the audio graph
    function initAudioContext(audioData) {
        // Create a new AudioContext if it doesn't exist
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Decode the audio data and set up the audio graph
        audioContext.decodeAudioData(audioData, buffer => {
            audioBuffer = buffer; // Store the decoded audio data

            if (audioSource) {
                audioSource.disconnect(); // Disconnect any existing audio source
            }

            setupAudioGraph(); // Set up the audio graph
        });
    }

    // Set up the audio graph
    function setupAudioGraph() {
        audioSource = audioContext.createBufferSource(); // Create a new audio source
        audioSource.buffer = audioBuffer; // Set the buffer to the decoded audio data

        analyser = audioContext.createAnalyser(); // Create an analyser node
        audioSource.connect(analyser); // Connect the source to the analyser
        analyser.connect(audioContext.destination); // Connect the analyser to the output

        analyser.fftSize = 256; // Set the FFT (Fast Fourier Transform) size
        bufferLength = analyser.frequencyBinCount; // Get the length of the frequency data array
        dataArray = new Uint8Array(bufferLength); // Create the array to hold the frequency data
    }

    // Toggle play and pause functionality
    function togglePlayPause() {
        if (!isPlaying) { // If the audio is not playing
            if (!audioContext) {
                return;
            }
            audioSource = audioContext.createBufferSource(); // Create a new audio source
            audioSource.buffer = audioBuffer; // Set the buffer to the decoded audio data

            audioSource.connect(analyser); // Connect the source to the analyser
            analyser.connect(audioContext.destination); // Connect the analyser to the output

            if (pauseTime) { // If the audio was paused
                startTime += audioContext.currentTime - pauseTime; // Adjust the start time
            } else {
                startTime = audioContext.currentTime; // Set the start time
            }

            audioSource.start(0, pauseTime); // Start the audio from the paused position
            isPlaying = true; // Set the flag to indicate the audio is playing
            playPauseButton.textContent = 'Pause'; // Change the button text to "Pause"
            visualize(); // Start visualizing the audio
        } else { // If the audio is playing
            audioSource.stop(); // Stop the audio
            pauseTime = audioContext.currentTime - startTime; // Record the paused time
            isPlaying = false; // Set the flag to indicate the audio is paused
            playPauseButton.textContent = 'Play'; // Change the button text to "Play"
        }
    }

    // Function to visualize the audio
    function visualize() {
        if (!isPlaying) { // If the audio is not playing, stop the visualization
            return;
        }

        const WIDTH = canvas.width; // Get the width of the canvas
        const HEIGHT = canvas.height; // Get the height of the canvas

        // Function to draw the visualization
        function draw() {
            if (!isPlaying) { // If the audio is not playing, stop drawing
                return;
            }

            requestAnimationFrame(draw); // Schedule the next frame

            analyser.getByteFrequencyData(dataArray); // Get the frequency data

            ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear the canvas

            const barWidth = (WIDTH / (bufferLength / 2.5)) * 1.5; // Calculate the width of each bar
            let barHeight;
            let x = 0;

            // Loop through the first quarter of the frequency data to focus on the lower end
            for (let i = 0; i < bufferLength / 4; i++) {
                barHeight = dataArray[i];

                // Set the bar color with transparency
                ctx.fillStyle = `rgba(255, 255, 255, 0.3)`; // White with 60% opacity
                // Draw the bar
                ctx.fillRect(x, HEIGHT - barHeight / 3, barWidth, barHeight);

                x += barWidth + 1; // Move to the next bar position
            }
        }

        draw(); // Start drawing
    }
});
