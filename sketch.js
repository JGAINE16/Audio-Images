var mode = 0;
var audioStarted = false;
let vol = 0.0;
let mic;
let pitch;
let audioContext;
let colors = [];
let shape = false;
let bgColor = 255; // Initial background color

function setup() {
  createCanvas(windowWidth, windowHeight);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch); // Start pitch detection after mic starts
  splash = new Splash
}

function draw() {
  if (mouseIsPressed == true) {
    mode = 1;
  }
  if (mode == 1) {
    splash.hide();
    
    // Change the colorMode to HSB
    colorMode(HSB); // 360, 100, 100, 1.0
   // Define the color palette
    for (let i = 0; i < scale.length; i++) {
      let newColor = color(i * 360 / scale.length, 50, 100, 0.9);
      colors.push(newColor);
    }
    stroke(0, 0, 0, 0.5);
  
  }

  // Use the volume from the microphone to control the size
  vol = mic.getLevel();
  let diameter = vol * 800; // Larger starting size

  let r = random(0, 255);
  let b = random(0, 255);
  let g = random(0, 255);
  fill(r, b, g);

  if (shape === false) {
    ellipse(mouseX, mouseY, diameter);
  } else {
    rect(mouseX - diameter / 2, mouseY - diameter / 2, diameter, diameter);
  }
}

// Function to start pitch detection
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

// Function to handle model loading
function modelLoaded() {
  select('#status').html('Model Loaded');
  getPitch();
}

// Function to get the pitch, find the closest note, and set the fill color
function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      let midiNum = freqToMidi(frequency);
      currentNote = scale[midiNum % 12];
      fill(colors[midiNum % 12]);
      select('#noteAndVolume').html('Note: ' + currentNote + " - volume " + nf(vol, 1, 2));
    }
    getPitch(); // Call getPitch recursively
  });
}

// Toggle shape on mouse press
function mousePressed() {
  shape = !shape;
}

// Change background color on key press
function keyPressed() {
  if (key === '1') {
    bgColor = color(255, 193, 242); // Change background to pink
  } else if (key === '2') {
    bgColor = color(193, 255, 242); // Change background to turquoise
  }
  background(bgColor);
}
