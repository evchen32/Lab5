// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  console.log('loading');
  const canvas = document.getElementById("user-image");
  console.log(canvas);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas context

  ctx.fillStyle = 'black'; // Fill the canvas context with black to add borders on non-square images
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the image
  const dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dim['startX'], dim['startY'], dim['width'], dim['height']);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const selectImg = document.getElementById("image-input");
selectImg.addEventListener('change', (event) => {
  // Give image a source with URL (selectImg only gives file type)
  img.src = URL.createObjectURL(selectImg.files[0]);
  console.log(img.src);

 
  // add image alt by getting filename
  img.alt = selectImg.files[0].name;
  console.log(img.alt);
});



function logSubmit(event) {
  const submit = document.querySelector("button[type='submit']");
  const reset = document.querySelector("button[type='reset']");
  const button = document.querySelector("button[type='button']");
  
  submit.disabled = true;
  reset.disabled = false;
  button.disabled = false;
 

  const textTop = document.getElementById('text-top');
  const textBottom = document.getElementById('text-bottom');

  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');
  const dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.font = '48px impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';

  console.log(textTop.value);
  ctx.textAlign = 'center';
  ctx.fillText(textTop.value, canvas.width / 2, 100);
  ctx.fillText(textBottom.value, canvas.width / 2, canvas.height - 50);
  
  event.preventDefault();
}


const form = document.getElementById('generate-meme');
console.log(form);
form.addEventListener('submit', logSubmit);


const reset = document.querySelector("button[type='reset']");
reset.addEventListener('click', event => {
  const submit = document.querySelector("button[type='submit']");
  const reset = document.querySelector("button[type='reset']");
  const button = document.querySelector("button[type='button']");
  
  submit.disabled = false;
  reset.disabled = true;
  button.disabled = true;

  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas context
});

function populateVoiceList() {
  const none = document.getElementById('voice-selection');
  none.remove(none[0]);
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  var voices = speechSynthesis.getVoices();

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voice-selection").appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

const voice = document.getElementById('voice-selection');
voice.disabled = false;

const button = document.querySelector("button[type='button']");
var synth = window.speechSynthesis;

button.addEventListener('click', event =>  {
  event.preventDefault();

  const textTop = document.getElementById('text-top');
  const textBottom = document.getElementById('text-bottom');

  var utterThis = new SpeechSynthesisUtterance(textTop.value +' ' + textBottom.value);
  var voices = speechSynthesis.getVoices();
  //const voice = document.getElementById('voice-selection');
  var idx = voice.selectedIndex;
  console.log(voice[idx]);
  
  for(let i = 0; i < voices.length ; i++) {
    if(voices[i].name === voice[idx]) {
      utterThis.voice = voices[i];
    }
  }

  utterThis.volume = volume.value / 100;


  synth.speak(utterThis);
  textTop.blur();
});




const volume = document.querySelector("[type='range']");
volume.addEventListener('input', (event) => {
  console.log(volume.value);
  let check = document.querySelector("#volume-group img");
  console.log(check);
  if (volume.value >= 67) {
    check.src = "icons/volume-level-3.svg";
    check.alt="Volume Level 3"
  } else if ( volume.value  >= 34 ) {
    check.src = "icons/volume-level-2.svg";
    check.alt="Volume Level 2"
  } else if ( volume.value  >= 1) {
    check.src = "icons/volume-level-1.svg";
    check.alt="Volume Level 1"
  } else  {
    check.src = "icons/volume-level-0.svg";
    check.alt="Volume Level 0"
  }
});





/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
