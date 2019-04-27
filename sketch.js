const steps = 500;
const lines = 100;
const wavefreq = 10; // 10 waves within a line
const offset = 0;
const wavemod = 10;

let waveheight;
let capture;
let slider;
let yvalues = [];

function drawWave() {
  translate(0, 0);
  // black
  stroke(0);
  fill(0);

  loadPixels();
  // pixelを読み込んだらもう画像は不要なので消す
  clear();
    
  for (let y = 0; y < lines; y++) {
    let yoffset = y * height / lines;
    let last_y = yvalues[0] + yoffset;
    for (let i = 0; i < steps - 1; i++) {

      let x1 = i / steps * width;
      let y1_tmp = yvalues[i] + yoffset;
      
      let idx = 4 * int(round(y1_tmp) * width + x1);
      let whiteness = brightness(color(pixels[idx], pixels[idx+1], pixels[idx+2], pixels[idx+3]));
      let blackness = max(0, 255 - whiteness - slider.value());
      let a = wavemod * blackness / (255 - slider.value());
      
      let x2 = (i + 1) / steps * width;
      let y2 = a * yvalues[i + 1] + yoffset;
      line(x1, last_y, x2, y2);

      last_y = y2;
    }
  }
}

function setup() {
  frameRate(1);

  createCanvas(min(windowWidth, 900), min(windowHeight, 900));
  background(255);
  
  slider = createSlider(0, 255, 200, 0);
  slider.position(10, 10);
  slider.style('width', '80px');

  let waveheight = height / lines / 2;
  for (let i = 0; i < steps; i++) {
    yvalues[i] = waveheight * sin(2 * PI * i / steps * wavefreq + offset);
  }
  
  capture = createCapture(VIDEO);
  capture.hide();
}

function draw() {
  switch(frameCount % 4) {
    case 0:
      clear();
      image(capture, 0, 0, width, width * capture.height / capture.width);
      break;
    case 1:
      filter(THRESHOLD, slider.value() / 255);
      break;
    case 2:
      drawWave();
      break;
  }
}

function mouseDragged() {

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
