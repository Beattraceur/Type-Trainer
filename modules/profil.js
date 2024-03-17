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
  profil.js
  is the interface for communication with the idb database.

  main functions are:
  selProfil() ...    is a side menu that gives the user the
                     obtion to choose between new, load and
                     show profil.
  newProfil() ...    houses the registration page for a new
                     player entry in idb.
  loadProfil() ...   loads all entrys from idb and activates 
                     a selected player profil as
                     global profil.
  showProfil() ...   shows the stats of the selected profil 
                     but only if a profil is loaded first.
  updateProfil() ... updates the profil in idb with the 
                     game data of the last mission.

  side function is:
  maxInGameHistory() ... search throug the game history for
                         the max value of a given param and
                         returns theis max value.
*/
import { el } from './lib.js';
import { globals, inputRouter } from './main.js';
import { selectOption } from './typeIt.js';
import { db } from './db.js';
import {
  generateTextDate,
  downloadObjectAsJson,
  displayLineChart,
  generateMonBoxes,
} from './generator.js';
import { showMonsterList } from './monster.js';

//Global variable as temp storage
let sel = 0;
let profilCount = 0;
let keys = [];
let playerData = {};
let chartActive = false;

export function selProfil(keyEvent) {
  if (keyEvent === 'pioneer') {
    //first call makes HTML

    ///####MonsterBoxes
    const monDisplayHtml = generateMonBoxes();
    let html = monDisplayHtml.innerHTML;
    ///#############Select Object
    const profilOptions = {
      possCount: 3,
      option1: 'new',
      option2: 'load',
      option3: 'show',
    };
    ///#############Create Startpage
    // use Object to create the HTML
    html += `
<pre>
<span id="sel1" class="high-visibility"></span><span id="opt1" class="low-visibility">${profilOptions.option1}</span> Profil

<span id="sel2" class="high-visibility"></span><span id="opt2" class="low-visibility">${profilOptions.option2}</span> Profil

<span id="sel3" class="high-visibility"></span><span id="opt3" class="low-visibility">${profilOptions.option3}</span> Profil

</pre>
  `;

    el('#center-container').innerHTML = html;
    showMonsterList();

    selectOption(profilOptions, keyEvent);
  } else {
    const selOption = selectOption('', keyEvent);
    if (selOption === 1) {
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 6;
      inputRouter('pioneer');
    } else if (selOption === 2) {
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 7;
      inputRouter('pioneer');
    } else if (selOption === 3) {
      el('#center-container').innerHTML = ''; //clear center container
      globals.layer = 8;
      inputRouter('pioneer');
    }
  }
}

export function newProfil(keyEvent) {
  if (keyEvent === 'pioneer') {
    //first call makes HTML
    el('#center-container').innerHTML = `
<pre>
    __________________   __________________
.-/|                  \\ /                  |\\-.
||||                   |                   ||||
||||                   |       ~~*~~       ||||
||||    --==*==--      |       this        ||||
||||                   | is the adventure  ||||
||||       let         |        of         ||||
||||    the journey    |     --==*==--     ||||
||||      begin        |                   ||||
||||                   |  <input id="nameInput" placeholder="type your name">                 ||||
||||                   |                   ||||
||||                   |    and enter...   ||||
||||__________________ | __________________||||
||/===================\\|/===================\\||
'--------------------~___~-------------------''

<p class="idb-notification">This Profil will be saved in your local browser idb database only</p>
</pre>`;
    setTimeout(() => el('#nameInput').focus(), 1); /// timeout needed so that the 'w' from last input 'new' is not in the input field
  } else if (keyEvent === 'Enter') {
    const name = el('#nameInput').value;
    const profilID = Date.now();
    const profilObj = {
      id: profilID,
      name,
      maxlvl: 1,
      games: [],
      monster: [],
    };
    db.writeItem(profilID, profilObj);
    el('#player').innerText = name;
    globals.playerID = profilID;
    globals.layer = 2;
    inputRouter('pioneer');
  }
}

export async function loadProfil(keyEvent) {
  if (keyEvent === 'pioneer') {
    //first call makes HTML
    keys = await db.readKeys();
    const playerData = await db.readAllItems();
    profilCount = keys.length;
    if (profilCount === 0) {
      ///notify if nothing is in storage
      console.log('guest with no data');
      el('#center-container').innerHTML =
        '<h3>no data found</h3><p>press any key to leave</p>';
    } else {
      let html = '';
      Object.keys(playerData).forEach((key) => {
        html += `
         <p id="key${key}" class="low-visibility">${playerData[key].name}</p>
         `;
      });

      html += `
<pre>
navigation    [↑][↓]
                
delete profil  [←  ]

select          [←‾|
                 | |
                  ‾
</pre>
        `;

      el('#center-container').innerHTML = html;
      el('#key0').classList.remove('low-visibility');
    }
  } else {
    if (profilCount === 0) {
      ///abort if nothing is in storage
      globals.layer = 2;
      inputRouter('pioneer');
    } else if (keyEvent === 'ArrowDown') {
      el(`#key${sel}`).classList.add('low-visibility');
      sel++;
      if (sel >= profilCount) {
        sel = 0;
      }
      el(`#key${sel}`).classList.remove('low-visibility');
    } else if (keyEvent === 'ArrowUp') {
      el(`#key${sel}`).classList.add('low-visibility');
      sel--;
      if (sel < 0) {
        sel = profilCount - 1;
      }
      el(`#key${sel}`).classList.remove('low-visibility');
    } else if (keyEvent === 'Enter') {
      el('#player').innerText = el(`#key${sel}`).innerText;
      globals.playerID = keys[sel];
      const profilData = await db.readProfil(keys[sel]);
      //takes monter data when available
      globals.monDisp = profilData.monster || [];
      // console.log("Display", globals.monDisp);
      globals.layer = 2;
      inputRouter('pioneer');
      sel = 0;
    } else if (keyEvent === 'Backspace') {
      db.deleteItem(keys[sel]);
      el('#player').innerText = 'Guest';
      globals.playerID = 0;
      sel = 0;
      globals.layer = 2;
      inputRouter('pioneer');
    }
  }
}

export async function showProfil(keyEvent) {
  if (keyEvent === 'pioneer' && !globals.playerID) {
    ///go back when guest
    globals.layer = 5;
    inputRouter('pioneer');
  } else if (keyEvent === 'pioneer' && globals.playerID) {
    el('#player').style.visibility = 'hidden'; /// hide Player name
    ///#############Select Object
    playerData = await db.readProfil(globals.playerID);
    //console.log(playerData);
    const textDate = generateTextDate(playerData.id);
    const maxTypeSpeed = maxInGameHistory('averageSpeed');
    const profilOptions = {
      possCount: 3,
      option1: 'show',
      option2: 'download',
      option3: 'menu',
    };
    ///#############Create Startpage
    // use Object to create the HTML
    const html = `
<pre>
<h1>History of Trainer ${playerData.name}</h1>
<p>TypeTrainer since ${textDate}</p>
<p>
Current level: ${playerData.maxlvl}
Total missions: ${playerData.games.length}
 
Max average typespeed: ${maxTypeSpeed}keys/sec</p>
<span id="sel1" class="high-visibility"></span><span id="opt1" class="low-visibility">${profilOptions.option1}</span> last Run 
<div id="chart-container"></div>
<div id="hideOptions">
<span id="sel2" class="high-visibility"></span><span id="opt2" class="low-visibility">${profilOptions.option2}</span> Trainer as JSON


<span id="sel3" class="high-visibility"></span><span id="opt3" class="low-visibility">${profilOptions.option3}</span> 
</div>
</pre>
  `;

    el('#center-container').innerHTML = html;

    selectOption(profilOptions, keyEvent);
  } else if (chartActive) {
    // console.log('chartActive');
    chartActive = false;
    globals.layer = 8;
    inputRouter('pioneer');
  } else {
    const selOption = selectOption('', keyEvent);
    if (selOption === 1) {
      if (playerData.games.length > 0) {
        const lastGameIndex = playerData.games.length - 1;
        displayLineChart(playerData.games[lastGameIndex], 'chart-container');
        el('#sel1').innerText = 'the';
        chartActive = true;
        el('#hideOptions').innerHTML = '';
      } else {
        el('#sel1').innerText = 'no';
        chartActive = true;
        el('#hideOptions').innerHTML = '';
      }

      //globals.layer = 8;
      // inputRouter('pioneer');
    } else if (selOption === 2) {
      el('#center-container').innerHTML = ''; //clear center container
      downloadObjectAsJson(playerData, `${playerData.name}.json`);
      globals.layer = 8;
      inputRouter('pioneer');
    } else if (selOption === 3) {
      el('#center-container').innerHTML = ''; //clear center container
      el('#player').style.visibility = 'visible'; /// show Player name
      globals.layer = 2;
      inputRouter('pioneer');
    }
  }
}

export function updateProfil(playerID, resultObj) {
  //console.log(playerID,resultObj);
  db.updateGameHistory(playerID, resultObj);
  if (resultObj.averageSpeed > 4 && resultObj.accuracy > 90) {
    db.updateMaxLvl(playerID, resultObj.level);
  }
  // db.addGameToProfil(playerID,resultObj);
}

export async function updateMonster(playerID, monsterID, monsterValue) {
  const data = await db.readProfil(playerID);
  db.updateMonsterArr(playerID, monsterID, monsterValue);
}

function maxInGameHistory(param) {
  //// finds max param in games history
  let maxValue = 0;
  //console.log(data.games);
  playerData.games.forEach((obj) => {
    const tempVaule = obj[param];
    //console.log(tempVaule);
    if (tempVaule > maxValue) {
      maxValue = tempVaule;
    }
  });
  //console.log(maxValue);
  return maxValue;
}
