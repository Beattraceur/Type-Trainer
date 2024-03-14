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
  generator.js
  houses everything that needs to be created before it can
  be used.
  
  main functions:
  generateArena()        ... combines all the previosly generated
                             elements to display an arena for the
                             randomly generated missions.
  generateQuestArr()     ... generates a long array of letters and
                             spaces for the following mission.
                             this function uses the values in the 
                             selected typeLevel.json and picks the
                             difficulty in relation to the selected
                             level in globals.lvl.
  generateActiveKeyArr() ... generates an array that is in sync with
                             the values in QuestArr.
                             this array contains the id's of every 
                             upcomming key that needs to change color
                             to guide the user through the mission.
                             this array is pregenerated to minimize
                             the computing traffic in a mission.
                             this array is used to cal the id's of the
                             next active directly so no loop like
                             forEach is needed.          
  displayKeyboard()      ... generates a generic keyboard where every
                             keycap is labeled with 'k'.
                             later it will be overwritten with the
                             selected keyLayout. 

  side functions:
  displayLineChart()     ... generates a LineChart of typespeed in chart.js.      
  generateMouseOverlay() ... generates the overlayPage that will be active
                             every mouseClick to inform the user, that this
                             application is controled with keyboard only           
  updateTimer()          ... updates the mission timer as 4 digit clock
                             when feeded with the remaining time in ms.
  generateTextDate()     ... converts UTC-Timecode into a date and time
                             string and returns it.  
  downloadObjectAsJson() ... generates a json file of the active profil
                             an triggers the download automaticly.
                             this json safegame can be used to restore
                             the progress.
                             #### restore fct() not yet implemented ####
*/
import { el, create } from "./lib.js";
import { globals } from "./main.js";
import { pickMonster, monsterTotal } from "./monster.js";
import { symObj, symShiftObj, typeLevel } from "./load.js";

export function generateArena() {
  ///generates Template for typequest

  const monsterHTML = pickMonster(0); /// picks random monster from monster js fitting current globals.lvl
  const keyboardHTML = displayKeyboard(); //get a template keyboard
  ///console.log(keyboardHTML);
  ///create Arena with components
  const arena = create("div");
  arena.setAttribute("id", "arena");
  const questLine = create("div");
  questLine.setAttribute("id", "questLine");
  const arenaTop = create("div");
  arenaTop.setAttribute("id", "arenaTop");
  const questParagraph = create("p");
  questParagraph.setAttribute("id", "questParagraph");
  const textVignette = create("div");
  textVignette.setAttribute("id", "textVignette");
  const past = create("span");
  past.setAttribute("id", "typePast");
  past.setAttribute("class", "low-visibility");
  const error = create("span");
  error.setAttribute("id", "typeError");
  error.setAttribute("class", "error");
  const cursor = create("span");
  cursor.setAttribute("id", "cursor");
  cursor.innerText = "|";
  const present = create("span");
  present.setAttribute("id", "typePresent");
  present.setAttribute("class", "high-visibility");
  const future = create("span");
  future.setAttribute("id", "typeFuture");
  future.setAttribute("class", "mid-visibility");
  questParagraph.append(past);
  questParagraph.append(error);
  questParagraph.append(cursor);
  questParagraph.append(present);
  questParagraph.append(future);
  questLine.append(questParagraph);
  questLine.append(textVignette);
  const monsterBox = create("div");
  monsterBox.setAttribute("id", "monsterBox");
  const timer = create("div");
  timer.setAttribute("id", "timer");
  timer.innerHTML = "00:00";
  const monster = create("div");
  monster.setAttribute("id", "monster");
  monster.innerHTML = monsterHTML;
  monsterBox.append(timer);
  monsterBox.append(monster);
  arenaTop.append(questLine);
  arenaTop.append(monsterBox);
  const arenaBottom = create("div");
  arenaBottom.setAttribute("id", "arenaBottom");
  arenaBottom.append(keyboardHTML);
  arena.append(arenaTop);
  arena.append(arenaBottom);
  return arena; ///returns finished quest layout
}

export function generateQuestArr() {
  /// generates quest array depending on the global level
  // console.log('Array for lvl', globals.lvl);
  //console.log('TypeLEVEL', typeLevel[`lvl${globals.lvl}`]);
  const symbolArr = typeLevel[`lvl${globals.lvl}`];
  const longArr = [];
  //console.log(symbolArr);
  const symCount = symbolArr.length;
  //console.log(symCount);

  for (let i = 0; i < 40; i++) {
    const rndPick = Math.floor(Math.random() * symCount);

    for (let i = 0; i < 3; i++) {
      longArr.push(symbolArr[rndPick]);
    }
    longArr.push(" "); //Space between words
  }
  return longArr; /// return finished quest array
}

export function generateActiveKeyArr(questArr) {
  /// generates a second array with key information corresponding to the quest array
  let activeKeyArr = [];

  questArr.forEach((sym) => {
    if (symObj[sym]) {
      //console.log('normal');
      activeKeyArr.push([symObj[sym]]);
    } else if (symShiftObj[sym]) {
      //console.log('SHIFT');
      activeKeyArr.push([symShiftObj[sym], "key41", "key53"]);
    } else {
      console.log(sym, "not found");
    }
  });

  //console.log(questArr);
  //console.log(activeKeyArr);
  // console.log(symObj);
  // console.log(symShiftObj);

  return activeKeyArr;
}

export function displayLineChart(data, containerElement) {
  /// generates linechart with chart js
  el(
    `#${containerElement}`
  ).innerHTML = `<div id="canvasholder"><canvas id = "canvas"></canvas></div>`;
  // console.log(resultObj);
  const ctx = el("#canvas");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.typedArr,
      datasets: [
        {
          label: "Typespeed in key's per sec",
          data: data.typeSpeedArr,
          borderWidth: 3,
          borderColor: "lightseagreen",
          backgroundColor: "lightseagreen",
        },
      ],
    },
    options: {
      plugins: {
        // 'legend' now within object 'plugins {}'
        legend: {
          labels: {
            color: "lightseagreen", // not 'fontColor:' anymore
            // fontSize: 18  // not 'fontSize:' anymore
            font: {
              size: 16, // 'size' now within object 'font {}'
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: globals.chartTextColor,
            font: {
              size: 16, // 'size' now within object 'font {}'
            },
          },
          grid: {
            color: globals.chartGridColor,
          },
          beginAtZero: true,
        },
        y: {
          ticks: {
            stepSize: 1,
            color: globals.chartTextColor,
            font: {
              size: 16, // 'size' now within object 'font {}'
            },
          },
          grid: {
            color: globals.chartGridColor,
          },
          beginAtZero: true,
        },
      },
    },
  });
}

function displayKeyboard() {
  const keyboard = create("div");
  const keyRow0 = create("div");
  keyRow0.setAttribute("id", "row");
  let label = "";
  let i = 0;
  for (i; i < 14; i++) {
    label = create("label");
    label.setAttribute("id", `key${i}`);
    label.innerText = "k";
    keyRow0.append(label);
  }
  keyboard.append(keyRow0);
  const keyRow1 = create("div");
  keyRow1.setAttribute("id", "row");
  for (i; i < 28; i++) {
    label = create("label");
    label.setAttribute("id", `key${i}`);
    label.innerText = "k";
    keyRow1.append(label);
  }

  keyboard.append(keyRow1);

  const keyRow2 = create("div");
  keyRow2.setAttribute("id", "row");
  for (i; i < 41; i++) {
    label = create("label");
    label.setAttribute("id", `key${i}`);
    label.innerText = "k";
    keyRow2.append(label);
  }
  ///####Bottom Enter

  label = create("label");
  label.setAttribute("class", "enterBottom");
  const underlayL = create("div");
  underlayL.setAttribute("class", "enterMidBackL");
  label.append(underlayL);
  const underlayR = create("div");
  underlayR.setAttribute("class", "enterMidBackR");
  label.append(underlayR);
  const overlay = create("div");
  overlay.setAttribute("class", "enterMid");
  label.append(overlay);
  keyRow2.append(label);
  keyboard.append(keyRow2);
  ///###
  const keyRow3 = create("div");
  keyRow3.setAttribute("id", "row");
  for (i; i < 54; i++) {
    label = create("label");
    label.setAttribute("id", `key${i}`);
    label.innerText = "k";
    keyRow3.append(label);
  }
  keyboard.append(keyRow3);
  const keyRow4 = create("div");
  keyRow4.setAttribute("id", "row");
  for (i; i < 61; i++) {
    label = create("label");
    label.setAttribute("id", `key${i}`);
    label.innerText = "k";
    keyRow4.append(label);
  }
  keyboard.append(keyRow4);

  keyboard.setAttribute("id", "keyboard-container");

  return keyboard;
}

export function generateMouseOverlay() {
  const html = `
  <h2>TypeTrainer is controlled by keyboard only.</h2>
      <pre>
        ____________________________________________________
        T ================================================= |T
        | ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|[L
        | __________________________________________________[|
        |I __==___________  ___________     .  ,. _ .   __  T|
        ||[_j  L_I_I_I_I_j  L_I_I_I_I_j    /|/V| |/|   ==  l|
        lI _______________________________  _____  _________I]
         |[__I_I_I_I_I_I_I_I_I_I_I_I_I_I_] [__I__] [_I_I_I_]|
         |[___I_I_I_I_I_I_I_I_I_I_I_I_L  I   ___   [_I_I_I_]|
         |[__I_I_I_I_I_I_I_I_I_I_I_I_I_L_I __I_]_  [_I_I_T ||
         |[___I_I_I_I_I_I_I_I_I_I_I_I____] [_I_I_] [___I_I_j|
         | [__I__I_________________I__L_]                   |
         |                                                  |
          |__________________________________________________| 
      </pre>
      <h3>Please give your mouse a nap</h2>
      <pre>
        ..----.._    _
        .' .--.    "-.(O)_
'-.__.-'"'=:|  ,  _)_ \__ . c\'-..
         ''------'---''---'-"
      </pre>  
`;
  return html;
}

export function updateTimer(questTimeLeft) {
  const timeLeft = new Date(questTimeLeft);
  const minutes = timeLeft.getMinutes();
  const seconds = timeLeft.getSeconds();
  el("#timer").innerText = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function generateMonBoxes() {
  console.log("mon boxes");
  const boxGrid = create("div");
  const rows = monsterTotal / 6;
  let boxID = 1;
  for (let i = 0; i < rows; i++) {
    const boxRow = create("div");
    boxRow.setAttribute("class", "boxRow");
    for (let i = 0; i < 6; i++) {
      const monBox = create("div");
      monBox.setAttribute("id", `box${boxID}`);
      monBox.setAttribute("class", `monbox`);
      monBox.innerHTML = `<div id="monID${boxID}" class="monDisplay"> soon more...</div>
<pre class='frame'>
|‾‾‾‾‾‾‾‾‾‾‾‾‾‾|
|              |
|              |
|              |
|              |
|              |
|              |
|______________|
 ‾‾‾‾‾‾‾‾‾‾‾‾‾‾</pre>`;
      boxRow.append(monBox);
      boxID++;
    }
    boxGrid.append(boxRow);
  }
  console.log(boxGrid);
  return boxGrid;
}

//////////////////////AI generated stuff below///////////////////////
////AI generated ########################### Date Converter
export function generateTextDate(timeStamp) {
  const currentDate = new Date(timeStamp);
  // Extract individual date components
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  // Format the date as desired
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedDate;
}
///AI generated ############################ JSON-Downloader
export function downloadObjectAsJson(object, fileName) {
  const json = JSON.stringify(object);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
///AI generated ############################
