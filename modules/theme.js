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
  theme.js
  allows the user to switch colors for optimizing the day
  and night user experience.

  main function:
  dayOrNight() ... gives the user the possibility to choose
                   the day or night color theme.
                   it is the first function that runs after 
                   application start.
                   this function manipulates the css color 
                   variables in root instead of using
                   classList.add and clasList.remove.
*/
import { el } from './lib.js';
import { selectOption } from './typeIt.js';
import { globals, inputRouter } from './main.js';

export function dayOrNight(keyEvent) {
  ///#############Setup Pioneer delivering needed Data
  if (keyEvent === 'pioneer') {
    //first call makes HTML
    //console.log('first call makes HTML');
    //give pioneer a mission
    ///#############Select Object
    const selDayNight = {
      possCount: 2,
      request1: 'type',
      option1: 'day',
      request2: 'or',
      option2: 'night',
    };
    ///#############Create Startpage
    // use Object to create the HTML
    const html = `
<span class="low-visibility">${selDayNight.request1}</span>    
<span id="sel1" class="high-visibility"></span><span id="opt1" class="low-visibility">${selDayNight.option1}</span>    
<span class="low-visibility">${selDayNight.request2}</span>    
<span id="sel2" class="high-visibility"></span><span id="opt2" class="low-visibility">${selDayNight.option2}</span>        
`;

    el('#center-container').innerHTML = html;

    ///#############Waiting for User Select
    selectOption(selDayNight, keyEvent);
  } else {
    const themeMode = selectOption('', keyEvent);
    if (themeMode === 1) {
      //console.log('set DAYMODE');
      ///#############Change to Daymode
      // document.body.classList.add('day-mode');
      // document.body.classList.remove('night-mode');
      const root = document.documentElement;
      // Change the value of the --background-color variable
      root.style.setProperty('--background-color', 'var(--day)');
      root.style.setProperty('--text-color', 'var(--black)');
      globals.chartTextColor = 'black';
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 2;
      inputRouter('pioneer');
    } else if (themeMode === 2) {
      //console.log('set NIGHTMODE');
      ///#############Change to Nightmode
      // document.body.classList.add('night-mode');
      // document.body.classList.remove('day-mode');
      const root = document.documentElement;
      // Change the value of the --background-color variable
      root.style.setProperty('--background-color', 'var(--night)');
      root.style.setProperty('--text-color', 'var(--white)');
      globals.chartTextColor = 'white';
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 2;
      inputRouter('pioneer');
    }
  }
}
