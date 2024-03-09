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
  main.js
  is the conection point between the app.js and all the other
  modules.
  the application receives a constant stream of user key inputs
  via the keyEventListener in app.js.
  main.js manages this userInputStream and shifts it in the
  right direction.
  
  main function:
  inputRouter() ... just a switch statement that guides the
                    key inputs to the active module.
                    the information about the active module
                    is stored in the layer item in the global
                    object "globals".
                    by changing globals.layer you can set the
                    entrypoint of the whole application.
  serviceWorkerActiv() ... initialize the service-worker to
                           cache for offline install as pwa.                  
*/
import { dayOrNight } from './theme.js'
import { mainMenu } from './menu.js';
import { settings, changeKeyboardLayout } from './settings.js';
import { typeMission } from './mission.js';
import { newProfil, selProfil,loadProfil, showProfil } from './profil.js';



//######Function select for router 
export const globals = {
  playerID : 0,
  layer : 1,    ///Default:1////Change Startingpoint of App !4 too fast for JSON fetching!
  lvl : 1,
  layout: 'macDE',
  region: 'DE',
  chartTextColor: 'white',
  chartGridColor: 'grey',
  cursorID : 0
}


//#######Routing user keyinput to the right function
export function inputRouter(keyEvent){
  switch (globals.layer) {
    case 0:
      ///reseved Slot
      break;
    case 1:
      dayOrNight(keyEvent);
      break;
    case 2:
      mainMenu(keyEvent);
      break;
    case 3:
      settings(keyEvent);
      break;  
    case 4:
      typeMission(keyEvent);
      break;
    case 5:
      selProfil(keyEvent);
      break;
    case 6:
      newProfil(keyEvent);
      break; 
    case 7:
      loadProfil(keyEvent);
      break;
    case 8:
      showProfil(keyEvent);
      break;
    case 9:
      changeKeyboardLayout(keyEvent);
      break;                          
    default:  
    console.log('UserInput: ',keyEvent);
  }

}

export function serviceWorkerActiv(){
  if ('serviceWorker' in navigator){
      navigator.serviceWorker.register('../service-worker.js', {scope: './' });
  }
}