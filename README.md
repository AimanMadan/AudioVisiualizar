# AudioVisiualizar
 *https://aimanmadan.github.io/AudioVisiualizar/*
 
Technologies Used:

    HTML: To create the structure of the web page, including the canvas element for drawing the visualizer and the file input for audio selection.
    CSS: To style the visualizer and set the background color of the canvas.
    JavaScript: To handle audio processing and visualization using the Web Audio API.

Features:

    Audio File Upload: Users can select and upload an audio file from their device.
    Play/Pause Functionality: A button to control the playback of the audio.
    Frequency Visualization: Real-time visualization of the audio's frequency spectrum focused on the lower frequencies.
    Alternating Bar Colors: Bars alternate between 'antique white' and 'gray' with a transparent effect.

How It Works:

    File Upload: The user selects an audio file using the file input.
    Audio Processing: The file is read and decoded using the Web Audio API.
    Visualization Setup: Analyser node captures the frequency data of the audio.
    Drawing Bars: The canvas is used to draw bars representing the frequency data, with a focus on the lower end.
    Play/Pause Control: Users can play or pause the audio using the button.
