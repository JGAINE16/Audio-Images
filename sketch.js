var mode = 0;
var audioStarted = false;
let vol = 0.0;
let mic;
let pitch;
let audioContext;
let colorPaletteIndex = 0; // Index to track the current color palette
let colorPalettes = [
  ['#FF5733', '#FFD133', '#33FF57'], // Palette 1
  ['#3366FF', '#FF33FF', '#33FFFF']  // Palette 2
];
let shape = false;
let bgColor = 255; // Initial background color

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  audioContext = getAudioContext().suspend();
  mic = new p5.AudioIn();
  mic.start(startPitch); // Start pitch detection after mic starts
  splash = new Splash ();
  
  // Button to switch color palette
  let switchPaletteButton = createButton('Switch Palette');
  switchPaletteButton.position(20, 20);
  switchPaletteButton.mousePressed(switchColorPalette);
}
// Function to switch between color palettes
function switchColorPalette() {
  colorPaletteIndex = (colorPaletteIndex + 1) % colorPalettes.length;
}

// Function to smoothly change background color
function changeBackgroundColor(newColor) {
  let currentColor = bgColor.levels;
  let targetColor = newColor.levels;
  let transitionDuration = 30; // Number of frames for transition
  let transitionStep = currentColor.map((val, i) => (targetColor[i] - val) / transitionDuration);
  
  for (let i = 0; i < transitionDuration; i++) {
    setTimeout(() => {
      bgColor.setRed(currentColor[0] + transitionStep[0] * i);
      bgColor.setGreen(currentColor[1] + transitionStep[1] * i);
      bgColor.setBlue(currentColor[2] + transitionStep[2] * i);
    }, i * 20);
  }
}
function draw() {
  if (mouseIsPressed == true && splash. update()==true) {
    mode = 1;
    background(255)
  }
  if (mode == 1) {
    splash.hide();
    
// Function to smoothly change background color
function changeBackgroundColor(newColor) {
  let currentColor = bgColor.levels;
  let targetColor = newColor.levels;
  
  // Check if the current background color is already the same as the target color
  if (currentColor[0] === targetColor[0] && currentColor[1] === targetColor[1] && currentColor[2] === targetColor[2]) {
    return; // No need to transition if already at the target color
  }
  
  let transitionDuration = 30; // Number of frames for transition
  let transitionStep = currentColor.map((val, i) => (targetColor[i] - val) / transitionDuration);
  
  for (let i = 0; i < transitionDuration; i++) {
    setTimeout(() => {
      bgColor.setRed(currentColor[0] + transitionStep[0] * i);
      bgColor.setGreen(currentColor[1] + transitionStep[1] * i);
      bgColor.setBlue(currentColor[2] + transitionStep[2] * i);
    }, i * 20);
  }
}

  }


  // Use the volume from the microphone to control the size
  vol = mic.getLevel();
  let diameter = vol * 800; // Larger starting size

  let r = random(0, 255);
  let b = random(0, 255);
  let g = random(0, 255);
  fill(r, b, g);

  if (shape === false && mode ==1) {
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
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
    //mode = 1
  }
  shape = !shape;
}
  
  

// Change background color on key press
function keyPressed() {
  if (key === '1') {
    bgColor = color('rgb(240,217,221)'); // Change background to pink
  } else if (key === '2') {
    bgColor = color('rgb(219,241,219)'); // Change background to turquoise
  }
  background(bgColor);
}
