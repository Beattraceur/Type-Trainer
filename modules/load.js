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
  load.js
  manages the async fetching stuff that needs to be loaded.

  main functions:
  loadKeyLayout() ... loads the selected keyboard layout
                      that is set in globals.layout.
                      after changing in globals this function
                      must be executed again.
  loadTypeLevel() ... fetches the level sets that are stored
                      as JSON's.
                      the path is set via globals.region.
                      like changing the layout it is suggested
                      to change the region too, to have a fitting
                      set of typeArray's for the respective layout.                     
  
*/
import { loadJSON } from "./lib.js";
import { globals } from "./main.js";

export let keyLayout = {};
export let typeLevel = {};
export let symObj = {};
export let symShiftObj = {};

export async function loadKeyLayout(){
  keyLayout = await loadJSON(`../data/${globals.layout}.json`);
  
  Object.keys(keyLayout).forEach((key)=>{
    const tempArr = keyLayout[key];
    if(tempArr[0].length > 0){symObj[tempArr[0]] = key;} /// skipping empty entrys
    if(tempArr[1].length > 0){symShiftObj[tempArr[1]] = key;}
  });
  // console.log(symObj);
  // console.log(symShiftObj);
  // console.log(keyLayout);
}
export async function loadTypeLevel(){
  typeLevel = await loadJSON(`../data/typeLevel${globals.region}.json`);
  //console.log(typeLevel);
}
