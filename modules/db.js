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
  db.js
  houses functions for idb data exchange

  custom functions:
  updateGameHistory() ... updates the history of played games
                          in idb of selected profil.             
  updateMaxLvl()      ... update a levelup in idb of selected profil.
*/

import { update, get, set, del, values, keys } from "../js/idb-src.js";

export const db = {
  readKeys: function () {
    // gibt alle keys als Array zurück
    return keys();
  },
  readAllItems: function () {
    // gibt alle Werte als Array zurück
    return values();
  },
  readProfil: async function (key) {
    return await get(key);
  },
  writeItem: function (key, data) {
    set(key, data);
  },
  deleteItem: function (key) {
    del(parseInt(key));
  },
  upDateItem: function (data) {
    const key = data.id;
    this.writeItem(key, data);
  },
  updateGameHistory: function (key, gameData) {
    update(key, (data) => {
      data.games.push(gameData);
      return data;
    });
  },
  updateMonsterArr: function (key, monID, monVal) {
    // console.log(key, monID);
    update(key, (data) => {
      !data.monster ?? (data.monster = []); //set monArray when missing case of old account
      data.monster[monID] = monVal;
      return data;
    });
  },
  updateMaxLvl: function (key, lvl) {
    update(key, (data) => {
      if (lvl >= data.maxlvl) {
        data.maxlvl++;
      }
      return data;
    });
  },
};
