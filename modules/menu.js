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
  menu.js
  the central place in the application where the user is 
  able to go in any direction.
  
  main function:
  mainMenu() ... the select function to reach the profil,
                 change and mission page.
*/
import { el } from './lib.js';
import { selectOption } from './typeIt.js';
import { globals, inputRouter } from './main.js';

export function mainMenu(keyEvent) {
  ///#############Setup Pioneer delivering needed Data
  if (keyEvent === 'pioneer') {
    //first call makes HTML
    //console.log('first call makes HTML');
    //give pioneer a mission
    ///#############Select Object
    const menuOptions = {
      possCount: 3,
      option1: 'profil',
      option2: 'change',
      option3: 'mission',
    };
    ///#############Create Startpage
    // use Object to create the HTML
    const html = `
<pre>
____________________________________________________
| ================================================= |
| ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|[
| __________________________________________________[|                A     _,,,,--,,_
|I __==___________  ___________     .  ,. _ .   __  T|               /,'.-'''    -,  \-;,
||[_]  [_I_I_I_I_]  [_I_I_I_I_]    /|/ ||( /|   ==  l|              |,4-  ) ),,__ , (  ;; 
lI _______________________________  _____  _________I]             '---''(.'--'  '-''.)''
 |[__I_I_I_I_I_I_I_I_I_I_I_I_I_I_] [__I__] [_I_I_I_]|
 |[___I_I_I_I_I_I_I_I_I_I_I_I_L  I   ___   [_I_I_I_]|                 <span id="sel3" class="high-visibility"></span><span id="opt3" class="low-visibility">${menuOptions.option3}</span>
 |[__I_I_I_I_I_I_I_I_I_I_I_I_I_L_I __I_]_  [_I_I_T ||
 |[___I_I_I_I_I_I_I_I_I_I_I_I____] [_I_I_] [___I_I_j|
 | [__I__I_________________I__L_]                   |
 |          <span id="sel1" class="high-visibility"></span><span id="opt1" class="low-visibility">${menuOptions.option1}</span>    <span id="sel2" class="high-visibility"></span><span id="opt2" class="low-visibility">${menuOptions.option2}</span>                        |
 |__________________________________________________| 
</pre>
  `;

    el('#center-container').innerHTML = html;

    selectOption(menuOptions, keyEvent);
  } else {
    const selOption = selectOption('', keyEvent);
    if (selOption === 1) {
      //console.log('enter PROFIL');
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 5;
      inputRouter('pioneer');
    } else if (selOption === 2) {
      //console.log('make CHANGE');

      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 3;
      inputRouter('pioneer');
    } else if (selOption === 3) {
      //console.log('go on MISSION');

      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 4;
      inputRouter('pioneer');
    }
  }
}
