///Just some shortcut functions
export const el = (css) => document.querySelector(css);
export const group = (css) => document.querySelectorAll(css);
export const create = (html) => document.createElement(html);


export const loadJSON = async (url) => (await fetch(url)).json();