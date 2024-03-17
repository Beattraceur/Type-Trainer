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
  mission.js
  is the entrypoint for each mission.
  
  main function:
  typeMission() ... collects everything for the actual mission
                    like the arena and puts it on the page.
                    it also relables the keyboard as soon as it
                    appears on the page.
                    it also triggers the questArr generation in
                    generator.js and delivers it to the typeQuest
                    function in typeIt.js
                    In other words when the pioneer call comes in 
                    it gives the pioneer a data package as backpack
                    and guide him to the actual typeQuest.
*/
import { el } from './lib.js';
import {
  generateArena,
  generateQuestArr,
  generateActiveKeyArr,
} from './generator.js';
import { keyLayout } from './load.js';
import { typeQuest } from './typeIt.js';

export function typeMission(keyEvent) {
  //console.log('Mission start',lvl,keyEvent);
  if (keyEvent === 'pioneer') {
    //console.log('pioneer');
    const arena = generateArena();
    el('#center-container').append(arena);

    const keys = Object.keys(keyLayout); //Map Key Names
    keys.forEach((key, i) => {
      const name = keyLayout[key];
      //console.log(i);
      if (
        (i >= 15 && i <= 25) ||
        (i >= 29 && i <= 39) ||
        (i >= 43 && i <= 49)
      ) {
        //show letters in UpperCase
        el(`#${key}`).innerText = name[0].toUpperCase();
      } else {
        el(`#${key}`).innerText = name[0] + ' ' + name[1];
      }
    });
    const questArr = generateQuestArr();
    const activeKeyArr = generateActiveKeyArr(questArr); /// get active key infos from questArray
    //console.log(activeKeyArr);
    typeQuest(questArr, activeKeyArr, keyEvent);
    //console.log(arena);
  } else {
    typeQuest('', '', keyEvent);
  }
}
