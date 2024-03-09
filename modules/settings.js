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
  settings.js
  manages the global changes in TypeTrainer like the theme
  change or the change of the keyboard layout.

  main functions are:
  settings() ...             a side menu to select the item that has to
                             change - like themes or keyboard layout.
  changeKeyboardLayout() ... makes exactly what it sounds like (>^_^)>         
*/
import { el } from "./lib.js";
import { selectOption } from "./typeIt.js";
import { globals,inputRouter } from "./main.js";
import { loadKeyLayout } from "./load.js";

export function settings(keyEvent){
  ///#############Setup Pioneer delivering needed Data
  if (keyEvent === 'pioneer'){ //first call makes HTML
    //console.log('first call makes HTML');
    //give pioneer a mission
    ///#############Select Object
    const settingOptions = {
      possCount    :  2,
      request1     :  'change',
      option1      :  'theme',
      request2     :  'or',
      option2      :  'keyboard'
    }
  ///#############Create Startpage
    // use Object to create the HTML
    const html =`
<span class="low-visibility">${settingOptions.request1}</span>    
<span id="sel1" class="high-visibility"></span><span id="opt1" class="low-visibility">${settingOptions.option1}</span>    
<span class="low-visibility">${settingOptions.request2}</span>    
<span id="sel2" class="high-visibility"></span><span id="opt2" class="low-visibility">${settingOptions.option2}</span>        
`;

  el('#center-container').innerHTML = html;
  
  ///#############Waiting for User Select
  selectOption(settingOptions,keyEvent);
    
  }else{
    const selSetOption = selectOption('',keyEvent);
    if(selSetOption === 1){
      ///############# go to theme
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 1;
      inputRouter('pioneer');
    }else if(selSetOption === 2){
      //console.log('set NIGHTMODE');
      ///############# MENU for now
      
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 9;
      inputRouter('pioneer');
    }
  }
}

export function changeKeyboardLayout(keyEvent){
  ///#############Setup Pioneer delivering needed Data
  if (keyEvent === 'pioneer'){ //first call makes HTML
    //console.log('first call makes HTML');
    //give pioneer a mission
    ///#############Select Object
    const selKeyLayout = {
      possCount    :  2,
      option1      :  'de',
      option2      :  'us'
    }
  ///#############Create Startpage
    // use Object to create the HTML
    const html =`
<h3>Keyboard layout is</h3>
<p>[<span id="sel1" class="high-visibility"></span><span id="opt1" class="low-visibility">${selKeyLayout.option1}</span>]   
   
[<span id="sel2" class="high-visibility"></span><span id="opt2" class="low-visibility">${selKeyLayout.option2}</span>] 
</p>
`;

  el('#center-container').innerHTML = html;
  
  ///#############Waiting for User Select
  selectOption(selKeyLayout,keyEvent);
    
  }else{
    const layout = selectOption('',keyEvent);
    if(layout === 1){
      globals.layout = 'macDE';
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 2;
      inputRouter('pioneer');
      loadKeyLayout();
    }else if(layout === 2){
      globals.layout = 'macUS';
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 2;
      inputRouter('pioneer');
      loadKeyLayout();
    }
  }
}