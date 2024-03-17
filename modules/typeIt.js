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
  typeIt.js
  manages everything regarding the user word inputs.

  the main-functions are:
  selectOption() ... for selecting functionality. 
  typeQuest() ...    for the functionality in the type missions.

  the side-functions are:
  updateKeyboard() ...   while in a type mission it shows the next key to press.
  displayResult() ...    displays the results after a mission is over and pushes
                         the result to profil.js for storage in idb.
  clearObject() ...      resets the global object that is used in selectOption().
  clearQuestObject() ... resets the global object that is used in typeQuest().
  blinkCursor() ...      blinks the cursor in mission and updates the mission timer.
*/
import { el } from "./lib.js";
import { displayLineChart, updateTimer } from "./generator.js";
import { globals, inputRouter } from "./main.js";
import { updateProfil, updateMonster } from "./profil.js";

///############# Use global variables to store delivered Data and TestArrays
let storedOption = {};
let timeLeft = 0;
let delayID = 0; /// disable fast input after session
let delayDone = false;
let activeChar = "";
let lastActiveKey = [];
//global object that is used in typeQuest()
const questStorage = {
  runningQuest: false,
  questEnded: false,
  timer: 20000,
  timeArr: [],
  endTime: 0,
  startArr: [],
  pastArr: [],
  errorArr: [],
  actKeyArr: [],
};
//global object that is used in selectOption()
const selTest = {
  currentSel: 0,
  activeArr: [],
  opt1Arr: [],
  opt1ArrPassive: [],
  opt2Arr: [],
  opt2ArrPassive: [],
  opt3Arr: [],
  opt3ArrPassive: [],
};

function updateKeyboard() {
  lastActiveKey.forEach((key) => {
    el(`#${key}`).classList.remove("activeKey");
  });
  questStorage.actKeyArr[0].forEach((key) => {
    el(`#${key}`).classList.add("activeKey");
  });
  lastActiveKey = questStorage.actKeyArr[0];
  questStorage.actKeyArr.shift();
  // console.log(questStorage.actKeyArr[0]);
}

export function typeQuest(questArr, activeKeyArr, keyEvent) {
  if (keyEvent === "pioneer") {
    ///first call of typeQuest
    questStorage.startArr = questArr;
    questStorage.actKeyArr = activeKeyArr;
    el("#typeFuture").innerText = questStorage.startArr.join("");
    clearInterval(globals.cursorID);
    ///Check if actual mon is new or known by the player
    if (globals.playerID > 0) {
      // console.log("current mon:", globals.currentMon);
      if (!globals.monDisp[globals.currentMon - 1]) {
        // console.log("new mon found");
        globals.monDisp[globals.currentMon - 1] = 1;
        // console.log(globals.monDisp);
        updateMonster(globals.playerID, globals.currentMon - 1, 1); ///////profil
      }
    }

    el("#key57").innerText = "start Mission...";
    questStorage.questEnded = false;
    delayDone = false;
    updateTimer(questStorage.timer);
  }
  ///############# User Mission Start
  else if (
    !questStorage.runningQuest &&
    keyEvent === " " &&
    !questStorage.questEnded
  ) {
    el("#key57").innerText = "";
    //console.log('start');
    questStorage.runningQuest = true;
    activeChar = questStorage.startArr.shift();
    el("#typeFuture").innerText = questStorage.startArr.join("");
    el("#typePresent").innerText = activeChar;
    updateKeyboard();
    questStorage.timeArr.push(Date.now());
    questStorage.endTime = Date.now() + questStorage.timer;
    clearInterval(globals.cursorID);
    globals.cursorID = setInterval(blinkCursor, 550);
  }
  ///############# ongoing typeQuest
  else if (questStorage.runningQuest) {
    timeLeft = questStorage.endTime - Date.now();
    updateTimer(timeLeft);
    if (timeLeft <= 0) {
      /// checks if time is over
      const zero = 0;
      updateTimer(zero);
      questStorage.runningQuest = false;
      questStorage.questEnded = true;
      clearInterval(globals.cursorID);
      displayResult();
    } //false when time over
    else if (keyEvent === activeChar) {
      //console.log('endTime:',questStorage.endTime);
      updateKeyboard();
      questStorage.pastArr.push(activeChar);
      activeChar = questStorage.startArr.shift();
      el("#typeError").innerText = "";
      el("#typeFuture").innerText = questStorage.startArr.join("");
      el("#typePresent").innerText = activeChar;
      el("#typePast").innerText = questStorage.pastArr.join("");
      questStorage.timeArr.push(Date.now());
      // console.log(questStorage.timeArr);
    } else {
      // instead of activeChar user typed keyEvent
      questStorage.errorArr.push([activeChar, keyEvent]);
      el("#typeError").innerText = keyEvent;
      //  console.log('asked for:',activeChar,'but entered',keyEvent);
    }
  } else if (questStorage.questEnded && delayDone) {
    ///go to menu when typing but only if delay has passed
    globals.layer = 2;
    inputRouter("pioneer");
  } else {
    // console.log('press space to start');
  }
}

function displayResult() {
  const resultObj = {
    level: globals.lvl,
    timeStamp: questStorage.timeArr[0],
    typeSpeedArr: [],
    typedArr: [],
    averageSpeed: 0,
    accuracy: 0,
    errorArr: questStorage.errorArr,
  };
  el("#timer").innerText = "";
  let sum = 0;

  questStorage.pastArr.forEach((char, i) => {
    const reactionTime = questStorage.timeArr[i + 1] - questStorage.timeArr[i];
    const typeSpeed = Math.round(100000 / reactionTime) / 100;
    resultObj.typedArr.push(char);
    resultObj.typeSpeedArr.push(typeSpeed);
    sum += typeSpeed;
    //console.log(reactionTime,'ms for hitting',char,typeSpeed,'keys per second');
  });
  ///##########Calculate ACC
  // console.log('err',questStorage.errorArr.length);
  // console.log('good',questStorage.pastArr.length);
  resultObj.accuracy = Math.round(
    (questStorage.pastArr.length /
      (questStorage.pastArr.length + questStorage.errorArr.length)) *
      100
  );

  resultObj.averageSpeed =
    Math.round((sum / questStorage.pastArr.length) * 100) / 100;
  //console.log(sum);
  el("#questLine").innerHTML = `
<h3>Result:</h3>
<p>Total hits: ${questStorage.pastArr.length}<br>  
Wrong key's: ${questStorage.errorArr.length}</p>  
<p>Average type speed: ${resultObj.averageSpeed}keys/sec<br>  
Accuracy: ${resultObj.accuracy}%</p>  
`;
  displayLineChart(resultObj, "keyboard-container");

  // console.log('acc:', resultObj.accuracy);
  if (globals.playerID) {
    updateProfil(globals.playerID, resultObj);
    clearQuestObject();
    clearTimeout(delayID);
    delayID = setTimeout(() => (delayDone = true), 3000);
  } else {
    clearQuestObject();
    clearTimeout(delayID);
    delayID = setTimeout(() => (delayDone = true), 3000);
  }
}

export function selectOption(options, keyEvent) {
  ///#############Pioneer Data delivery
  if (keyEvent === "pioneer") {
    storedOption = options;
    switch (storedOption.possCount) {
      case 2:
        //console.log('zwei');
        ///make two global testArrays in const selTest
        selTest.opt1Arr = storedOption.option1.split("");
        selTest.opt2Arr = storedOption.option2.split("");
        // console.log(selTest.opt1Arr);
        // console.log(selTest.opt2Arr);
        break;
      case 3:
        //console.log('drei');
        selTest.opt1Arr = storedOption.option1.split("");
        selTest.opt2Arr = storedOption.option2.split("");
        selTest.opt3Arr = storedOption.option3.split("");
        break;

      default:
        console.log("error: wrong possCount in storedOption-Object");
    }
  } else {
    ///############# Handle User Input
    switch (storedOption.possCount) {
      case 2: ///############# Test 2 Options
        ///test two Arrays
        /// if nothing is selected
        if (selTest.currentSel === 0) {
          // console.log('no sel');
          ///############# Set test for first option as active
          if (keyEvent === selTest.opt1Arr[0]) {
            //console.log('sel1');
            selTest.currentSel = 1;
            selTest.activeArr = selTest.opt1Arr.slice();
            selTest.opt1ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt1").innerText = selTest.activeArr.join("");
            el("#sel1").innerText = selTest.opt1ArrPassive[0];
          }
          ///############# Set test for second option as active
          else if (keyEvent === selTest.opt2Arr[0]) {
            //console.log('sel2');
            selTest.currentSel = 2;
            selTest.activeArr = selTest.opt2Arr.slice();
            selTest.opt2ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt2").innerText = selTest.activeArr.join("");
            el("#sel2").innerText = selTest.opt2ArrPassive[0];
          }
        } else if (selTest.currentSel === 1) {
          ///############# Switch select from Option1 to Option2
          if (keyEvent === selTest.opt2Arr[0]) {
            selTest.currentSel = 2;
            selTest.activeArr = selTest.opt2Arr.slice();
            selTest.opt1ArrPassive = [];
            selTest.opt2ArrPassive.push(selTest.activeArr.shift());
            el("#opt1").innerText = storedOption.option1;
            el("#sel1").innerText = "";
            el("#opt2").innerText = selTest.activeArr.join("");
            el("#sel2").innerText = selTest.opt2ArrPassive[0];
          }
          ///############# Stay with Option1
          else if (keyEvent === selTest.activeArr[0]) {
            selTest.opt1ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt1").innerText = selTest.activeArr.join("");
            el("#sel1").innerText = selTest.opt1ArrPassive.join("");
            if (selTest.opt1ArrPassive.length === selTest.opt1Arr.length) {
              ///############# Finish as option 1
              //console.log('OPTION1');
              storedOption = {};
              clearObject();
              return 1;
            } else {
              return false;
            }
          }
        }
        ///############# Switch select from Option2 to Option1
        else if (selTest.currentSel === 2) {
          if (keyEvent === selTest.opt1Arr[0]) {
            // console.log('would like to switch to 1');
            selTest.currentSel = 1;
            selTest.activeArr = selTest.opt1Arr.slice();
            selTest.opt2ArrPassive = [];
            selTest.opt1ArrPassive.push(selTest.activeArr.shift());
            el("#opt2").innerText = storedOption.option2;
            el("#sel2").innerText = "";
            el("#opt1").innerText = selTest.activeArr.join("");
            el("#sel1").innerText = selTest.opt1ArrPassive[0];
          }
          ///############# Stay with Option2
          else if (keyEvent === selTest.activeArr[0]) {
            selTest.opt2ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt2").innerText = selTest.activeArr.join("");
            el("#sel2").innerText = selTest.opt2ArrPassive.join("");
            if (selTest.opt2ArrPassive.length === selTest.opt2Arr.length) {
              ///############# Finish as option 2
              //console.log('OPTION2');
              storedOption = {};
              clearObject();
              return 2;
            } else {
              return false;
            }
          }
        }
        break;
      case 3:
        ///############# Test 3 Options
        /// if nothing is selected
        if (selTest.currentSel === 0) {
          // console.log('no sel');
          ///############# Set test for first option as active
          if (keyEvent === selTest.opt1Arr[0]) {
            //console.log('sel1');
            selTest.currentSel = 1;
            selTest.activeArr = selTest.opt1Arr.slice();
            selTest.opt1ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt1").innerText = selTest.activeArr.join("");
            el("#sel1").innerText = selTest.opt1ArrPassive[0];
          }
          ///############# Set test for second option as active
          else if (keyEvent === selTest.opt2Arr[0]) {
            //console.log('sel2');
            selTest.currentSel = 2;
            selTest.activeArr = selTest.opt2Arr.slice();
            selTest.opt2ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt2").innerText = selTest.activeArr.join("");
            el("#sel2").innerText = selTest.opt2ArrPassive[0];
          }
          ///############# Set test for third option as active
          else if (keyEvent === selTest.opt3Arr[0]) {
            //console.log('sel3');
            selTest.currentSel = 3;
            selTest.activeArr = selTest.opt3Arr.slice();
            selTest.opt3ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt3").innerText = selTest.activeArr.join("");
            el("#sel3").innerText = selTest.opt3ArrPassive[0];
          }
        } else if (selTest.currentSel === 1) {
          ///############# Switch select from Option1 to Option2
          if (keyEvent === selTest.opt2Arr[0]) {
            selTest.currentSel = 2;
            selTest.activeArr = selTest.opt2Arr.slice();
            selTest.opt1ArrPassive = [];
            selTest.opt2ArrPassive.push(selTest.activeArr.shift());
            el("#opt1").innerText = storedOption.option1;
            el("#sel1").innerText = "";
            el("#opt2").innerText = selTest.activeArr.join("");
            el("#sel2").innerText = selTest.opt2ArrPassive[0];
          }
          ///############# Switch select from Option1 to Option3
          else if (keyEvent === selTest.opt3Arr[0]) {
            selTest.currentSel = 3;
            selTest.activeArr = selTest.opt3Arr.slice();
            selTest.opt1ArrPassive = [];
            selTest.opt3ArrPassive.push(selTest.activeArr.shift());
            el("#opt1").innerText = storedOption.option1;
            el("#sel1").innerText = "";
            el("#opt3").innerText = selTest.activeArr.join("");
            el("#sel3").innerText = selTest.opt3ArrPassive[0];
          }
          ///############# Stay with Option1
          else if (keyEvent === selTest.activeArr[0]) {
            selTest.opt1ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt1").innerText = selTest.activeArr.join("");
            el("#sel1").innerText = selTest.opt1ArrPassive.join("");
            if (selTest.opt1ArrPassive.length === selTest.opt1Arr.length) {
              ///############# Finish as option 1
              //console.log('OPTION1');
              storedOption = {};
              clearObject();
              return 1;
            } else {
              return false;
            }
          }
        }
        ///############# Switch select from Option2 to Option1
        else if (selTest.currentSel === 2) {
          if (keyEvent === selTest.opt1Arr[0]) {
            // console.log('would like to switch to 1');
            selTest.currentSel = 1;
            selTest.activeArr = selTest.opt1Arr.slice();
            selTest.opt2ArrPassive = [];
            selTest.opt1ArrPassive.push(selTest.activeArr.shift());
            el("#opt2").innerText = storedOption.option2;
            el("#sel2").innerText = "";
            el("#opt1").innerText = selTest.activeArr.join("");
            el("#sel1").innerText = selTest.opt1ArrPassive[0];
          }
          ///############# Switch select from Option2 to Option3
          else if (keyEvent === selTest.opt3Arr[0]) {
            selTest.currentSel = 3;
            selTest.activeArr = selTest.opt3Arr.slice();
            selTest.opt2ArrPassive = [];
            selTest.opt3ArrPassive.push(selTest.activeArr.shift());
            el("#opt2").innerText = storedOption.option2;
            el("#sel2").innerText = "";
            el("#opt3").innerText = selTest.activeArr.join("");
            el("#sel3").innerText = selTest.opt3ArrPassive[0];
          }
          ///############# Stay with Option2
          else if (keyEvent === selTest.activeArr[0]) {
            selTest.opt2ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt2").innerText = selTest.activeArr.join("");
            el("#sel2").innerText = selTest.opt2ArrPassive.join("");
            if (selTest.opt2ArrPassive.length === selTest.opt2Arr.length) {
              ///############# Finish as option 2
              //console.log('OPTION2');
              storedOption = {};
              clearObject();
              return 2;
            } else {
              return false;
            }
          }
        }
        ///############# Switch select from Option3 to Option1
        else if (selTest.currentSel === 3) {
          if (keyEvent === selTest.opt1Arr[0]) {
            // console.log('would like to switch to 1');
            selTest.currentSel = 1;
            selTest.activeArr = selTest.opt1Arr.slice();
            selTest.opt3ArrPassive = [];
            selTest.opt1ArrPassive.push(selTest.activeArr.shift());
            el("#opt3").innerText = storedOption.option3;
            el("#sel3").innerText = "";
            el("#opt1").innerText = selTest.activeArr.join("");
            el("#sel1").innerText = selTest.opt1ArrPassive[0];
          }
          ///############# Switch select from Option3 to Option2
          else if (keyEvent === selTest.opt2Arr[0]) {
            selTest.currentSel = 2;
            selTest.activeArr = selTest.opt2Arr.slice();
            selTest.opt3ArrPassive = [];
            selTest.opt2ArrPassive.push(selTest.activeArr.shift());
            el("#opt3").innerText = storedOption.option3;
            el("#sel3").innerText = "";
            el("#opt2").innerText = selTest.activeArr.join("");
            el("#sel2").innerText = selTest.opt2ArrPassive[0];
          }
          ///############# Stay with Option3
          else if (keyEvent === selTest.activeArr[0]) {
            selTest.opt3ArrPassive.push(selTest.activeArr.shift()); //remove first value
            el("#opt3").innerText = selTest.activeArr.join("");
            el("#sel3").innerText = selTest.opt3ArrPassive.join("");
            if (selTest.opt3ArrPassive.length === selTest.opt3Arr.length) {
              ///############# Finish as option 3
              //console.log('OPTION3');
              storedOption = {};
              clearObject();
              return 3;
            } else {
              return false;
            }
          }
        }
        break;

      default:
        console.log("error: wrong possCount in storedOption-Object");
    }
    ///############# Return false as long as ther is no result
    return false;
  }
}

///############# Clear Array Object
function clearObject() {
  selTest.currentSel = 0;
  selTest.activeArr = [];
  selTest.opt1Arr = [];
  selTest.opt1ArrPassive = [];
  selTest.opt2Arr = [];
  selTest.opt2ArrPassive = [];
  selTest.opt3Arr = [];
  selTest.opt3ArrPassive = [];
}

function clearQuestObject() {
  (questStorage.timeArr = []),
    (questStorage.endTime = 0),
    (questStorage.startArr = []),
    (questStorage.pastArr = []),
    (questStorage.errorArr = []);
}

///############# Blinking cursor with timer update
function blinkCursor() {
  const cursor = document.querySelector("#cursor");
  cursor.style.visibility =
    cursor.style.visibility == "visible" ? "hidden" : "visible";
  timeLeft = questStorage.endTime - Date.now();
  updateTimer(timeLeft);
  if (timeLeft <= 0) {
    /// checks if time is over
    const zero = 0;
    updateTimer(zero);
    questStorage.runningQuest = false;
    questStorage.questEnded = true;
    clearInterval(globals.cursorID);
    displayResult();
  }
}
