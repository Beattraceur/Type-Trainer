/*  ______                                               */
/* /\__  _\                                              */
/* \/_/\ \/  __  __   _____      __                      */
/*    \ \ \ /\ \/\ \ /\ '__`\  /'__`\                    */
/*     \ \ \\ \ \_\ \\ \ \L\ \/\  __/                    */
/*      \ \_\\/`____ \\ \ ,__/\ \____\                   */
/*       \/_/ `/___/> \\ \ \/  \/____/                   */
/*  ______       /\___/ \ \_\                            */
/* /\__  _\      \/__/   \/_/                            */
/* \/_/\ \/  _ __    __   /\_\     ___       __   _ __   */
/*    \ \ \ /\`'__\/'__`\ \/\ \  /' _ `\   /'__`\/\`'__\ */
/*     \ \ \\ \ \//\ \L\.\_\ \ \ /\ \/\ \ /\  __/\ \ \/  */
/*      \ \_\\ \_\\ \__/.\_\\ \_\\ \_\ \_\\ \____\\ \_\  */
/*       \/_/ \/_/ \/__/\/_/ \/_/ \/_/\/_/ \/____/ \/_/  */
/*                                       by Benjamin Hahl*/
/*
  app.js
  Javascript entrypoint connected with index.html
  everything in TypeTrainer uses user key inputs.
  thats why the keyEventListener is always on.
  app.js triggers the inputRouter main.js with every
  key input.
  it is home to a click eventListener to trigger a 
  notification screen, that mouse inputs are not needed.
  finaly it calles some functions for pre-fetching after
  sending the first "pioneer command" to the inputRouter
  in main.js to generate the first visible screen.
  then it triggers the service-worker for pwa caching.
*/

import { inputRouter, globals, serviceWorkerActiv } from '../modules/main.js';
import { generateMouseOverlay } from '../modules/generator.js';
import { loadKeyLayout, loadTypeLevel } from '../modules/load.js';
import { el } from '../modules/lib.js';

let overlayID = 0;

// get and send keyEvent to main.js
document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Shift' || event.key === 'CapsLock') {
    return;
  } // silence Shift key presses
  if (event.key === 'Escape') {
    el('#center-container').innerHTML = ''; //clear center container
    clearInterval(globals.cursorID);
    globals.layer = 2;
    inputRouter('pioneer');
  }
  inputRouter(event.key);
  //console.log(event.key);
});

document.addEventListener('click', () => {
  clearTimeout(overlayID);
  const overlay = document.querySelector('#mouseOverlay');
  overlay.innerHTML = generateMouseOverlay();
  overlay.classList.add('on-visibility');
  overlay.classList.remove('off-visibility');
  overlayID = setTimeout(removeOverlay, 3000); /// removes the overlay after 3sec
});

function removeOverlay() {
  const overlay = document.querySelector('#mouseOverlay');
  overlay.innerHTML = '';
  overlay.classList.add('off-visibility');
  overlay.classList.remove('on-visibility');
}

// start Push to get the whole thing running
inputRouter('pioneer');

//preLoad default JSONS
loadKeyLayout();
loadTypeLevel();

///ServiceWorker for install
//serviceWorkerActiv();
