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
  monster.js
  stores all the asciiMonster informations.
  
  main function:
  pickMonster() ... loads the visual representation of the
                    asciiMonster that is defined in <pre>Tag.
                    each moster is "drawn" as template string.
                    if ID is 0 the monster will be picked randomly
                    fitting the current avtive lvl in globals.lvl.
                    in that case "id" is overwritten before the
                    switch statement.
                    Monsters are not stored in JSON because they 
                    contain many forbidden characters and symbols
                    for the JSON-format.

*/
import { el } from './lib.js';
import { globals } from './main.js';

export const monsterTotal = 18;

export function pickMonster(id) {
  //console.log('MonsterID:', id);
  let monsterHTML = '';
  if (id === 0) {
    /// pick random monster for current globals.lvl
    switch (globals.lvl) {
      case 1:
        id = Math.ceil(Math.random() * 3); /// id = 1-3 for lvl1
        break;
      case 2:
        id = Math.ceil(Math.random() * 3) + 3; /// id = 4-6 for lvl2
        break;
      case 3:
        id = Math.ceil(Math.random() * 3) + 6; /// id = 7-9 for lvl3
        break;
      case 4:
        id = Math.ceil(Math.random() * 3) + 9; /// id = 10-12 for lvl4
        break;
      case 5:
        id = Math.ceil(Math.random() * 3) + 12; /// id = 13-15 for lvl5
        break;
      default:
        id = 1;
    }
    globals.currentMon = id; ///set random mon as current mon in globals
  }

  switch (id) {
    case 1:
      monsterHTML = `
<pre class="monster">
,___,
(O,O)
 (_(\\
⎺⎺""⎺⎺
</pre>
      `;
      break;
    case 2:
      monsterHTML = `
<pre class="monster">
  , _ ,
 ( o o )
/'' ' ''\\
|'''''''|
|\\\\'''//|
   "‾" 
</pre>
      `;
      break;
    case 3:
      monsterHTML = `
<pre class="monster">
    //
   <°)
   /\\\\
 __\\_V__
 ‾‾‾||‾‾
    ||  
</pre>
      `;
      break;
    case 4:
      monsterHTML = `
<pre>
</pre>
      `;
      break;
    default:
      monsterHTML = `
<pre>
Monster
missing!
</pre>
      `;
  }
  return monsterHTML;
}

export function showMonsterList() {
  // console.log(globals.monDisp.length);
  for (let i = 0; i < monsterTotal; i++) {
    const boxState = globals.monDisp[i];
    switch (boxState) {
      case 1:
        el(`#monID${i + 1}`).innerHTML = pickMonster(i + 1);
        el(`#monID${i + 1}`).classList.add('low-visibility');
        break;
      case 2:
        el(`#monID${i + 1}`).innerHTML = pickMonster(i + 1);
        el(`#monID${i + 1}`).classList.remove('low-visibility');
        break;
      default:
        el(`#monID${i + 1}`).innerHTML = `
<pre>
 ___ 
|__ \\
  / /
 |_| 
 (_) 
</pre>
              `;
        el(`#monID${i + 1}`).classList.add('low-visibility');
    }
  }
}
