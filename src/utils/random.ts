const WORDS = [
  "lorem","ipsum","dolor","amet","consectetur","adipisicing","elit","tempora","quasi","voluptas",
  "molestiae","necessitatibus","illo","assumenda","quia","deleniti","fugiat","pariat","sit","autem",
  "quis","minus","quaerat","rerum","numquam","provident","magni","nostrum","sequi","repellat"
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]) { return arr[randInt(0, arr.length - 1)]; }
function word() { return pick(WORDS); }
function words(n = 3) { return Array.from({ length: n }, word).join(" "); }
function sentence() {
  const n = randInt(6, 12);
  const s = words(n);
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
function paragraph() { return Array.from({ length: randInt(2, 4) }, sentence).join(" "); }
function bool() { return Math.random() < 0.5; }
function idLike() { return randInt(1, 9999); }
function uuidLike() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function firstName() { return pick(["Alper","Ece","Deniz","Mert","Zeynep","Can","Elif","Kerem"]); }
function lastName() { return pick(["Yılmaz","Demir","Kaya","Çelik","Şahin","Aydın"]); }
function fullName() { return `${firstName()} ${lastName()}`; }
function email(name = fullName()) {
  const n = name.toLowerCase().replace(/\s+/g, ".");
  const d = pick(["example.com","mail.com","dev.test","test.local"]);
  return `${n}@${d}`;
}
function phoneTR() { return `5${randInt(0,9)}${randInt(0,9)}-${randInt(100,999)}-${randInt(10,99)}-${randInt(10,99)}`; }
function urlLike() { return `https://example.com/${word()}/${randInt(1,999)}`; }
function dateISO() { return new Date(Date.now() - randInt(0, 365)*86400000).toISOString(); }

export const rnd = {
  int: randInt, bool, sentence, paragraph, word, words,
  idLike, uuidLike, fullName, email, phoneTR, urlLike, dateISO
};