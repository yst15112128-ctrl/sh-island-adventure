import { useState, useRef, useEffect, useCallback } from "react";
import { NODES, getPath } from "./mapdata.js";

import imgCover from "./assets/cover.webp";
import imgMap from "./assets/map.webp";
import imgFountain from "./assets/fountain.webp";
import imgMorning from "./assets/morning.webp";
import imgPark from "./assets/park.webp";
import imgDawn from "./assets/dawn.webp";
import imgGardener from "./assets/gardener.webp";
import imgKeeper from "./assets/keeper.webp";
import imgCountess from "./assets/countess.webp";
import imgMiracle from "./assets/miracle.webp";
import imgJarShut from "./assets/jarshut.webp";
import imgJarOpen from "./assets/jaropen.webp";

/* ============================================================
   TODO — 伯爵夫人的房間（等三張 MJ 圖）
   ------------------------------------------------------------
   圖到了之後：
     1. 三張檔案放進 src/assets/，命名為：
          room_a.webp （燈全暗、火冷）
          room_b.webp （燈亮、火冷 = 基準圖）
          room_c.webp （燈亮、火燒起來）
     2. 解開下面三行 import 的註解
     3. 把 ROOM = null 改成下面那一行
   CountessScene 會自動從「只有對話」切換成「點燈 → 生火」的完整互動。
   ============================================================ */
// import imgRoomA from "./assets/room_a.webp";
// import imgRoomB from "./assets/room_b.webp";
// import imgRoomC from "./assets/room_c.webp";
const ROOM = null;
// const ROOM = { a: imgRoomA, b: imgRoomB, c: imgRoomC };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&display=swap');
:root{
  --paper:#f5eede; --ink:#392e26; --ink2:#4a3c30; --muted:#8c7c6a;
  --terra:#cf6442; --terra-d:#b5562f; --terra-l:#e88161; --gold:#d6a05c;
  --sage:#6f8466; --sage-d:#5e6b4e; --line:#e4d6bf; --card:#fbf6ec;
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

/* ---- 全域：關捲動、關縮放、關長按選字。要像遊戲，不要像網頁 ---- */
html, body { overscroll-behavior: none; touch-action: manipulation; }
.stage, .stage * {
  -webkit-user-select: none; -moz-user-select: none; user-select: none;
  -webkit-touch-callout: none;
}
.stage img { -webkit-user-drag: none; pointer-events: none; }

.stage { min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 24px 12px;
  background: radial-gradient(120% 80% at 20% 0%, #efe4d2 0%, rgba(239,228,210,0) 55%), linear-gradient(160deg, #efe6d6 0%, #e2d6c4 100%);
  font-family: 'Noto Sans TC', sans-serif; }
.phone { width: 100%; max-width: 384px; height: 800px; max-height: 92vh; border-radius: 44px; background: linear-gradient(160deg,#3a2f26,#251d16); padding: 11px; position: relative;
  box-shadow: 0 50px 90px -30px rgba(50,34,22,.6), inset 0 1px 0 rgba(255,255,255,.08); }
.notch { position: absolute; top: 17px; left: 50%; transform: translateX(-50%); width: 108px; height: 22px; background: #241c15; border-radius: 0 0 16px 16px; z-index: 5; }
.screen { width: 100%; height: 100%; border-radius: 33px; overflow: hidden; position: relative; display: flex; flex-direction: column;
  background: linear-gradient(170deg, #f6efe2 0%, #ece0cd 100%); }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 26px 20px 6px; z-index: 3; min-height: 40px; }
.tag { font-family: 'Fraunces', serif; font-style: italic; color: var(--terra-d); font-size: 12px; letter-spacing: .08em; display: flex; align-items: center; gap: 7px; }
.tag::before { content: ""; width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); display: inline-block; }
.back { font-size: 12.5px; color: var(--muted); background: rgba(120,90,60,.06); border: 1px solid rgba(120,90,60,.12); border-radius: 20px; padding: 5px 11px; font-family: inherit; cursor: pointer; }
.back:active { transform: scale(.96); }
.prog { height: 4px; background: rgba(120,90,60,.1); border-radius: 4px; margin: 6px 22px 0; z-index: 3; overflow: hidden; }
.prog > i { display: block; height: 100%; background: linear-gradient(90deg,var(--gold),var(--terra)); border-radius: 4px; transition: width .6s cubic-bezier(.3,.7,.3,1); }

/* 不彈跳、不橡皮筋 */
.body { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain;
  padding: 12px 22px 16px; z-index: 2; display: flex; flex-direction: column; position: relative; }
.body::-webkit-scrollbar { width: 0; }

.kicker { font-family: 'Fraunces', serif; font-style: italic; color: var(--terra-d); letter-spacing: .16em; font-size: 12px; text-transform: uppercase; }
.htitle { font-family: 'Noto Serif TC'; font-weight: 700; color: var(--ink); font-size: 23px; margin-top: 8px; line-height: 1.4; }
.narr { color: var(--ink2); font-size: 14.5px; line-height: 1.9; margin-top: 11px; }
.narr b, .found b, .say b, .bt b { color: var(--terra-d); font-weight: 700; }
.enter { animation: rise .55s cubic-bezier(.2,.7,.2,1) both; }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.d2{animation-delay:.1s}.d3{animation-delay:.2s}.d4{animation-delay:.3s}.d5{animation-delay:.4s}
.opt { width: 100%; text-align: left; border: 1px solid var(--line); background: var(--card); border-radius: 14px; padding: 13px 15px 13px 17px; margin-top: 10px; font-size: 14.5px; line-height: 1.7; color: var(--ink2); cursor: pointer; position: relative; box-shadow: 0 3px 9px -7px rgba(90,60,40,.4); font-family: inherit; }
.opt::before { content: ""; position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px; border-radius: 3px; background: var(--gold); opacity: .45; }
.opt:active { background: #fdf0e8; border-color: var(--terra-l); }
.foot { margin-top: auto; padding-top: 14px; }
.btn { width: 100%; border: none; border-radius: 15px; padding: 15px; font-size: 15.5px; font-weight: 700; color: #fffaf2; font-family: inherit; cursor: pointer;
  background: linear-gradient(160deg, var(--terra-l), var(--terra) 45%, var(--terra-d)); box-shadow: 0 8px 18px -8px rgba(181,86,47,.6), inset 0 1px 0 rgba(255,255,255,.25); }
.btn:active { transform: translateY(1px); }
.btn.ghost { background: none; color: var(--terra-d); border: 1px solid #e2c4a6; box-shadow: none; }
.hint { font-size: 11.5px; color: #a99883; text-align: center; margin-top: 10px; font-style: italic; }
.found { background: linear-gradient(100deg,#fdf7ec,#f8efdf); border-left: 3px solid var(--terra); border-radius: 0 10px 10px 0; padding: 10px 13px; margin-top: 9px; font-size: 13.5px; color: #5b4b3e; line-height: 1.65; box-shadow: 0 3px 9px -7px rgba(90,60,40,.4); }

/* ---------- 場景圖 ---------- */
.scene { position: relative; width: 100%; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -14px rgba(70,50,32,.55); flex-shrink: 1; min-height: 0; margin-top: 12px; }
.scene img { display: block; width: 100%; height: auto; }
.hot { position: absolute; border-radius: 14px; cursor: pointer; }
.hot.on::after { content: ""; position: absolute; inset: 0; border-radius: 14px;
  background: radial-gradient(closest-side, rgba(255,222,150,.4), rgba(255,222,150,0) 78%);
  box-shadow: inset 0 0 0 2px rgba(233,175,96,.85); animation: pop .35s cubic-bezier(.2,1.4,.4,1) both; }
@keyframes pop { from { transform: scale(.82); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* 單行線索：換掉、不疊 */
.toast { margin-top: 10px; min-height: 44px; display: flex; align-items: center; }
.toast > div { width: 100%; background: linear-gradient(100deg,#fdf7ec,#f8efdf); border-left: 3px solid var(--terra); border-radius: 0 10px 10px 0;
  padding: 10px 13px; font-size: 13.5px; color: #5b4b3e; line-height: 1.6; box-shadow: 0 3px 9px -7px rgba(90,60,40,.4);
  animation: swap .4s cubic-bezier(.2,.8,.2,1) both; }
@keyframes swap { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
.counter { display: flex; gap: 6px; justify-content: center; margin-top: 8px; }
.counter i { width: 8px; height: 8px; border-radius: 50%; background: rgba(140,110,80,.2); transition: .35s; }
.counter i.on { background: var(--terra); box-shadow: 0 0 10px rgba(207,100,66,.7); }

/* 半透明對話框 */
.sheet { position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center; padding: 24px;
  background: rgba(38,28,20,.42); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); animation: fade .45s ease both; }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
.sheet > div { width: 100%; background: linear-gradient(165deg,#fdf8ee,#f5ead6); border-radius: 20px; padding: 22px 20px 18px;
  box-shadow: 0 30px 60px -20px rgba(40,26,14,.6); animation: rise .5s cubic-bezier(.2,.8,.2,1) .06s both; }

/* ---------- 角色 ---------- */
.who { display: flex; gap: 12px; align-items: flex-start; margin-top: 12px; }
.face { width: 92px; height: 92px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background: var(--paper); }
.face img { width: 100%; height: 100%; object-fit: cover; display: block; }
.face.big { width: 130px; height: 130px; }
.saybox { flex: 1; }
.name { font-size: 12.5px; color: var(--sage); font-weight: 700; letter-spacing: .04em; }
.say { font-size: 14.5px; color: var(--ink2); line-height: 1.8; margin-top: 4px; }
.slip { color: var(--terra-d); font-weight: 700; }

/* ---------- 先猜：四張臉 2×2 ---------- */
.g4 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.gcard { border: 1px solid var(--line); background: var(--card); border-radius: 16px; padding: 10px 10px 12px; cursor: pointer; text-align: center;
  box-shadow: 0 4px 12px -8px rgba(90,60,40,.5); }
.gcard:active { transform: scale(.97); border-color: var(--terra-l); background: #fdf0e8; }
.gcard img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 12px; display: block; }
.gcard .gn { font-size: 13.5px; font-weight: 700; color: var(--ink); margin-top: 8px; }
.gcard .gd { font-size: 11px; color: var(--muted); line-height: 1.5; margin-top: 3px; }

/* ---------- 地圖中樞 ---------- */
.mapwrap { position: relative; width: 100%; border-radius: 14px; overflow: hidden; touch-action: none;
  box-shadow: 0 10px 26px -14px rgba(70,50,32,.55); margin-top: 12px; }
.mapwrap img { display: block; width: 100%; height: auto; }
.mpin { position: absolute; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%; cursor: pointer; z-index: 3; }
.mpin::before { content: ""; position: absolute; inset: 9px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff8e4, var(--gold)); box-shadow: 0 0 0 2px rgba(255,250,235,.9), 0 0 16px rgba(214,160,92,.95); transition: .4s; }
.mpin.lit::before { animation: breathe2 2.1s ease-in-out infinite; }
.mpin.done::before { background: #b9ac97; box-shadow: 0 0 0 2px rgba(255,250,235,.5); opacity: .45; animation: none; }
.mpin.locked::before { background: rgba(190,178,158,.6); box-shadow: none; opacity: .35; animation: none; }
.mpin.sel::before { background: radial-gradient(circle at 35% 30%, #fff6e2, var(--terra)); box-shadow: 0 0 0 3px rgba(255,248,235,.95), 0 0 22px rgba(207,100,66,.9); }
@keyframes breathe2 { 0%,100% { transform: scale(1); } 50% { transform: scale(1.22); } }
.mlabel { position: absolute; transform: translate(-50%, 10px); font-size: 10px; font-weight: 700; color: #4a3c30;
  background: rgba(253,248,238,.88); border-radius: 8px; padding: 2px 7px; white-space: nowrap; pointer-events: none; z-index: 3;
  box-shadow: 0 2px 6px -3px rgba(80,50,30,.6); }
.mlabel.dim { opacity: .38; }
.me { position: absolute; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%; z-index: 4; pointer-events: none;
  background: radial-gradient(circle at 35% 30%, #fff9ec, #ffd487 45%, var(--terra));
  box-shadow: 0 0 0 3px rgba(255,248,235,.85), 0 0 22px 4px rgba(255,196,110,.85); }
.me.idle { animation: bob 2.4s ease-in-out infinite; }
@keyframes bob { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
.mapmsg { text-align: center; font-size: 12.5px; color: var(--muted); margin-top: 10px; min-height: 20px; line-height: 1.6; }

/* ---------- 抓語病：詞塊 ---------- */
.chunks { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; justify-content: center; }
.chunk { border: 1px solid var(--line); background: var(--card); border-radius: 11px; padding: 10px 12px; font-size: 15.5px;
  font-family: 'Noto Serif TC', serif; color: var(--ink2); cursor: pointer; box-shadow: 0 3px 9px -7px rgba(90,60,40,.5);
  transition: transform .18s, opacity .25s; }
.chunk:active { transform: scale(.95); }
.chunk.no { animation: shake .42s cubic-bezier(.36,.07,.19,.97) both; border-color: #e0b9a4; }
@keyframes shake { 10%,90% { transform: translateX(-2px); } 20%,80% { transform: translateX(3px); } 30%,50%,70% { transform: translateX(-5px); } 40%,60% { transform: translateX(5px); } }
.chunk.gone { opacity: 0; pointer-events: none; }
.flyer { position: absolute; z-index: 30; pointer-events: none; border-radius: 11px; padding: 10px 12px; font-size: 15.5px;
  font-family: 'Noto Serif TC', serif; font-weight: 700; color: #fffaf2; background: linear-gradient(160deg, var(--terra-l), var(--terra-d));
  box-shadow: 0 10px 26px -8px rgba(181,86,47,.8); }
.book { display: flex; align-items: center; gap: 10px; margin-top: 14px; padding: 11px 13px; border-radius: 13px;
  border: 1px dashed #dcc2a2; background: rgba(253,248,238,.7); transition: .5s; }
.book .bi { width: 26px; height: 30px; border-radius: 3px 6px 6px 3px; background: linear-gradient(140deg,#c98b5c,#a4653c);
  box-shadow: inset 2px 0 0 rgba(255,255,255,.25); flex-shrink: 0; }
.book .bt { font-size: 12.5px; color: var(--muted); line-height: 1.65; }
.book.hit { border-color: var(--terra); border-style: solid; background: #fdf2e8; }
.book.hit .bt { color: #5b4b3e; }

/* 角落卡 */
.scard { border: 1px solid #e8d4b4; border-radius: 18px; padding: 18px; margin-top: 14px; background: linear-gradient(160deg,#fdf8ee,#f7ecd9); box-shadow: 0 10px 26px -16px rgba(90,60,40,.5); }
.scard .sname { font-family: 'Noto Serif TC'; font-weight: 700; font-size: 22px; color: var(--terra-d); }
.scard .sprod { font-size: 13px; color: var(--sage); margin-top: 5px; font-weight: 700; }
.scard .sline { font-size: 14px; color: var(--ink2); line-height: 1.85; margin-top: 10px; }
.cta { background: #fbf1e3; border: 1px dashed #e2b98d; border-radius: 12px; padding: 12px 14px; margin-top: 12px; font-size: 13px; color: #6b5b4e; line-height: 1.75; }

@media (max-width: 520px) {
  .stage { padding: 0; align-items: stretch; }
  .phone { max-width: 100%; width: 100%; height: 100vh; height: 100dvh; max-height: none; border-radius: 0; padding: 0; box-shadow: none; background: none; }
  .notch { display: none; }
  .screen { border-radius: 0; box-shadow: none; }
}
`;

/* ================= 劇本資料 ================= */

// 找碴：熱區已放大（手機手指用）
const FINDS = [
  { k: "milk", l: 2, t: 72, w: 34, h: 27, note: "牛奶打翻了，沒人扶起來。" },
  { k: "pot", l: 32, t: 74, w: 34, h: 25, note: "花盆摔碎了，土撒了一地。" },
  { k: "flower", l: 65, t: 31, w: 34, h: 34, note: "窗台的花，全枯了。" },
];

// 手電筒：熱區已放大
const SPRING_SPOTS = [
  { k: "post", l: 6, t: 28, w: 30, h: 32, note: "守泉人該站的位置——空的。" },
  { k: "water", l: 18, t: 50, w: 56, h: 38, note: "泉水還流著，半夜卻沒人看顧。" },
  { k: "steps", l: 0, t: 80, w: 48, h: 19, note: "地上一串腳印，往島的另一頭去了。" },
];

const SUS = ["守泉人", "伯爵夫人", "奇蹟先生", "綠色園丁"];
const HUNCH = {
  "守泉人": "守著幸運噴泉，話不多。",
  "伯爵夫人": "說過「沒有光，清靜多了」。",
  "奇蹟先生": "獨來獨往，沒人摸得透他。",
  "綠色園丁": "碰得到光點的人。",
};
const FACES = { "綠色園丁": imgGardener, "守泉人": imgKeeper, "伯爵夫人": imgCountess, "奇蹟先生": imgMiracle };

// 地圖中樞：三個要查的地方
const STOPS = [
  { id: "fountain", view: "spring", name: "幸運噴泉" },
  { id: "manor", view: "countess", name: "伯爵夫人宅邸" },
  { id: "cliffhut", view: "miracle", name: "奇蹟先生的小屋" },
];

// 抓語病：八個詞塊，只有一個她不該知道
const CHUNKS = [
  { t: "要我說啊", no: "只是口頭禪。" },
  { t: "準是", no: "她在猜——聽起來很合理。" },
  { t: "有人", no: "誰都可以這樣講。" },
  { t: "趁半夜", no: "光是一夜之間沒的，這件事大家都知道。" },
  { t: "把光", no: "沒問題，光確實不見了。" },
  { t: "一顆顆", no: "有點怪，但還算是形容。" },
  { t: "裝進罐子", slip: true },
  { t: "收走了", no: "光不見了，這句不算爆料。" },
];

const CARDS = [
  { q: "想要一個更透亮的早晨", name: "亮白之光", prod: "美麗園丁亮白系列", line: "像綠色園丁照顧的那盞——讓暗下來的地方，重新亮回來。" },
  { q: "最近覺得乾乾的、需要水", name: "清泉之光", prod: "草本清爽保濕水", line: "像守泉人守著的那口泉——安安靜靜，把你重新蓄滿。" },
  { q: "有點累，想被好好照顧", name: "貴氣之光", prod: "伯爵夫人精華液", line: "像伯爵夫人卸下盔甲後的柔軟——讓你也被好好寵一次。" },
  { q: "想要一點不一樣的驚喜", name: "奇蹟之光", prod: "奶油自然奇蹟乳霜", line: "像奇蹟先生那樣不按牌理——給你一點意想不到的好。" },
  { q: "想試試遠方帶來的東西", name: "旅人之光", prod: "Havlíkova Apotéka", line: "像旅人行囊裡的舶來品——帶你去沒去過的地方。" },
];

/* ================= 共用：拖曳（明確狀態 + pointer capture，不用 e.buttons） ================= */
function usePointerDrag(onPos) {
  const ref = useRef(null);
  const dragging = useRef(false);

  const read = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = e.touches && e.touches[0] ? e.touches[0] : e;
    onPos(((p.clientX - r.left) / r.width) * 100, ((p.clientY - r.top) / r.height) * 100);
  }, [onPos]);

  const handlers = {
    onPointerDown: (e) => {
      dragging.current = true;
      if (e.currentTarget.setPointerCapture && e.pointerId != null) {
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
      }
      read(e);
    },
    onPointerMove: (e) => { if (dragging.current) read(e); },
    onPointerUp: () => { dragging.current = false; },
    onPointerCancel: () => { dragging.current = false; },
  };
  return [ref, handlers];
}

/* ================= 找碴 ================= */
function FindWrong({ onNext }) {
  const [got, setGot] = useState([]);
  const [last, setLast] = useState(null);
  const done = got.length === FINDS.length;

  return (<>
    <div className="kicker enter">MORNING · 島上的早晨</div>
    <div className="htitle enter d2">今天的島，哪裡不太對？</div>
    <div className="narr enter d3">走出門，一切看起來都還好——可是又好像，有什麼小事全都不順了。<b>點出三個不對勁的地方。</b></div>

    <div className="scene enter d4">
      <img src={imgMorning} alt="清晨的島" />
      {FINDS.map((s) => {
        const hit = got.includes(s.k);
        return (
          <div key={s.k}
            className={"hot" + (hit ? " on" : "")}
            data-hot={s.k}
            style={{ left: s.l + "%", top: s.t + "%", width: s.w + "%", height: s.h + "%" }}
            onClick={() => { if (!hit) { setGot([...got, s.k]); setLast(s.note); } }} />
        );
      })}
    </div>

    <div className="toast">{last && <div key={last}>{last}</div>}</div>
    <div className="counter">{FINDS.map((s, i) => <i key={i} className={i < got.length ? "on" : ""} />)}</div>

    {done && (
      <div className="sheet">
        <div>
          <div className="kicker">3 / 3</div>
          <div className="htitle" style={{ fontSize: 20, marginTop: 6 }}>每一件都是小事。</div>
          <div className="narr">可是全部湊在一起——<b>今天的運氣，好像被誰拿走了。</b></div>
          <button className="btn" style={{ marginTop: 16 }} onClick={onNext}>開始查這座島 →</button>
        </div>
      </div>
    )}
  </>);
}

/* ================= 手電筒（平滑追隨、掃過永久亮） ================= */
function TorchScene({ onNext }) {
  const wrapRef = useRef(null);
  const cvsRef = useRef(null);
  const target = useRef({ x: 50, y: 55 });
  const cur = useRef({ x: 50, y: 55 });
  const trail = useRef([]);
  const touched = useRef(false);
  const gotRef = useRef([]);
  const [lit, setLit] = useState(false);
  const [got, setGot] = useState([]);
  const [last, setLast] = useState(null);
  const done = got.length === SPRING_SPOTS.length;

  const onPos = useCallback((x, y) => {
    target.current = { x, y };
    touched.current = true;
    setLit(true);
    SPRING_SPOTS.forEach((s) => {
      if (x >= s.l && x <= s.l + s.w && y >= s.t && y <= s.t + s.h) {
        if (!gotRef.current.includes(s.k)) {
          gotRef.current = [...gotRef.current, s.k];
          setGot(gotRef.current);
          setLast(s.note);
        }
      }
    });
  }, []);
  const [dragRef, handlers] = usePointerDrag(onPos);

  useEffect(() => {
    const wrap = wrapRef.current, c = cvsRef.current;
    if (!wrap || !c) return;
    const ctx = c.getContext("2d");
    let raf;

    function frame() {
      const W = wrap.clientWidth, H = wrap.clientHeight;
      if (W && H) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {
          c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // 慣性：光慢慢追上手指
        cur.current.x += (target.current.x - cur.current.x) * 0.13;
        cur.current.y += (target.current.y - cur.current.y) * 0.13;

        const px = cur.current.x / 100 * W, py = cur.current.y / 100 * H;
        if (touched.current) {
          const t = trail.current;
          const p = t[t.length - 1];
          if (!p || Math.hypot(p[0] - px, p[1] - py) > 9) t.push([px, py]);
          if (t.length > 1200) t.shift();
        }

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "rgba(6,10,22,.93)";
        ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = "destination-out";
        const R = Math.max(56, Math.min(W, H) * 0.2);

        // 掃過的地方：永久亮著（弱一點）
        for (const [x, y] of trail.current) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, R * 0.8);
          g.addColorStop(0, "rgba(0,0,0,.9)");
          g.addColorStop(.6, "rgba(0,0,0,.5)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, R * 0.8, 0, 7); ctx.fill();
        }
        // 手上那束光（亮一點）
        if (touched.current) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, R);
          g.addColorStop(0, "rgba(0,0,0,1)");
          g.addColorStop(.55, "rgba(0,0,0,.9)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(px, py, R, 0, 7); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }
      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (<>
    <div className="kicker enter">NIGHT · 幸運噴泉</div>
    <div className="htitle enter d2">那一夜，這裡發生了什麼？</div>
    <div className="narr enter d3">那一夜太暗了。<b>按住畫面，把手裡這束光慢慢掃過去</b>——照過的地方，就一直亮著。</div>

    <div
      ref={(el) => { wrapRef.current = el; dragRef.current = el; }}
      className="scene enter d4"
      data-torch="1"
      style={{ touchAction: "none", cursor: "crosshair" }}
      {...handlers}>
      <img src={imgFountain} alt="夜晚的幸運噴泉" draggable="false" />
      <canvas ref={cvsRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
    </div>

    <div className="toast">{last && <div key={last}>{last}</div>}</div>
    <div className="counter">{SPRING_SPOTS.map((s, i) => <i key={i} className={i < got.length ? "on" : ""} />)}</div>
    {!lit && <div className="hint">按住畫面，把光拖過去</div>}

    {done && (
      <div className="sheet">
        <div>
          <div className="kicker">FOUNTAIN</div>
          <div className="htitle" style={{ fontSize: 20, marginTop: 6 }}>守泉人整夜不在。</div>
          <div className="narr">泉水還流著，位置卻是空的。地上一串腳印，<b>往島的另一頭去了。</b></div>
          <button className="btn" style={{ marginTop: 16 }} onClick={onNext}>記下來，回地圖 →</button>
        </div>
      </div>
    )}
  </>);
}

/* ================= 伯爵夫人 ================= */
function CountessScene({ onNext }) {
  const [stage, setStage] = useState(0); // 0 暗 / 1 燈亮 / 2 有火
  const [said, setSaid] = useState(false);

  if (ROOM) {
    return (<>
      <div className="kicker enter">MANOR · 伯爵夫人</div>
      <div className="htitle enter d2">「沒有光，清靜多了。」</div>
      <div className="narr enter d3">
        {stage === 0 && <>她的房間，一盞燈也沒點。她坐在暗裡，說她很好。<b>把燈點亮。</b></>}
        {stage === 1 && <>燈亮了。她沒說什麼，只是把披肩往身上拉了拉——<b>壁爐還是冷的。</b></>}
        {stage === 2 && <>火燒起來了。她整個人鬆了下來。身體比嘴誠實。</>}
      </div>

      <div className="scene enter d4">
        <img src={ROOM.a} alt="伯爵夫人的房間" />
        <img src={ROOM.b} alt="" style={{ position: "absolute", inset: 0, opacity: stage >= 1 ? 1 : 0, transition: "opacity 1.1s ease" }} />
        <img src={ROOM.c} alt="" style={{ position: "absolute", inset: 0, opacity: stage >= 2 ? 1 : 0, transition: "opacity 1.3s ease" }} />
        {stage === 0 && (
          <div className="hot on" style={{ left: "6%", top: "42%", width: "88%", height: "30%", cursor: "pointer" }}
            onClick={() => setStage(1)} />
        )}
        {stage === 1 && (
          <div className="hot on" style={{ left: "28%", top: "56%", width: "44%", height: "32%", cursor: "pointer" }}
            onClick={() => { setStage(2); setTimeout(() => setSaid(true), 1300); }} />
        )}
      </div>

      <div className="hint">{stage === 0 ? "點燈" : stage === 1 ? "點壁爐，生一盆火" : ""}</div>

      {said && (<>
        <div className="who enter">
          <div className="face"><img src={imgCountess} alt="伯爵夫人" /></div>
          <div className="saybox">
            <div className="name">伯爵夫人</div>
            <div className="say">「……那一晚，守泉人在我這兒。我怕黑，一個人待不住，他過來陪我，到天快亮。」</div>
          </div>
        </div>
        <div className="foot"><button className="btn" onClick={onNext}>兩個人互相洗清了 →</button></div>
      </>)}
    </>);
  }

  // 對話版（房間圖到了會自動換掉）
  return (<>
    <div className="kicker enter">MANOR · 伯爵夫人</div>
    <div className="htitle enter d2">「沒有光，清靜多了。」</div>

    <div className="who enter d3" style={{ marginTop: 16 }}>
      <div className="face big"><img src={imgCountess} alt="伯爵夫人" /></div>
      <div className="saybox">
        <div className="name">伯爵夫人</div>
        <div className="say">她抬著下巴，一盞燈也沒點。<br />「光不見了？很好。清靜多了。」</div>
      </div>
    </div>

    <div className="narr enter d4">你沒接話，只是走過去，把她桌上的燈點亮。她沒有阻止你。</div>

    {!said
      ? <div className="foot"><button className="btn ghost" onClick={() => setSaid(true)}>……</button></div>
      : (<>
        <div className="found enter">「那一晚，守泉人在我這兒。我怕黑，一個人待不住，他過來陪我，到天快亮。我們是十幾年的老朋友。」</div>
        <div className="narr enter">她嘴上說不需要光。燈亮了，話卻多了起來。</div>
        <div className="foot"><button className="btn" onClick={onNext}>兩個人互相洗清了 →</button></div>
      </>)}
  </>);
}

/* ================= 奇蹟先生 ================= */
function MiracleScene({ onNext }) {
  return (<>
    <div className="kicker enter">CLIFF · 奇蹟先生</div>
    <div className="htitle enter d2">那一夜的目擊者。</div>
    <div className="narr enter d3">門開了。他沒問你是誰，也沒請你進去，就站在門口，望著海。</div>
    <div className="who enter d4">
      <div className="face big"><img src={imgMiracle} alt="奇蹟先生" /></div>
      <div className="saybox">
        <div className="name">奇蹟先生</div>
        <div className="say">「那一夜我睡不著，在窗邊看了很久。」</div>
      </div>
    </div>
    <div className="found enter d5">「我看見有個人，<b>抱著一整籃的光</b>，往公園那頭去。是誰我沒看清——我不想憑一個背影，冤枉誰。」</div>
    <div className="narr enter">夜裡抱著光往公園去、白天又總能「剛好」找到光的——會是同一個人嗎？</div>
    <div className="foot"><button className="btn" onClick={onNext}>記下來，回地圖 →</button></div>
  </>);
}

/* ================= 地圖中樞 ================= */
function polyMeta(pts) {
  const seg = [], cum = [0];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const L = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    seg.push(L); total += L; cum.push(total);
  }
  return { seg, cum, total };
}
function pointAt(pts, meta, s) {
  if (s <= 0) return pts[0];
  if (s >= meta.total) return pts[pts.length - 1];
  let i = 0;
  while (i < meta.seg.length - 1 && meta.cum[i + 1] < s) i++;
  const t = (s - meta.cum[i]) / (meta.seg[i] || 1);
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
}
function projectS(pts, meta, x, y) {
  let best = Infinity, bs = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const dx = x2 - x1, dy = y2 - y1;
    const L2 = dx * dx + dy * dy || 1;
    let t = ((x - x1) * dx + (y - y1) * dy) / L2;
    t = Math.max(0, Math.min(1, t));
    const d = Math.hypot(x1 + dx * t - x, y1 + dy * t - y);
    if (d < best) { best = d; bs = meta.cum[i] + t * meta.seg[i]; }
  }
  return { s: bs, d: best };
}

function MapHub({ from, doneIds, onArrive }) {
  const [sel, setSel] = useState(null);
  const [prog, setProg] = useState(0);
  const [msg, setMsg] = useState("");
  const progRef = useRef(0);
  const doneRef = useRef(false);
  const wrapRef = useRef(null);

  const allDone = STOPS.every((s) => doneIds.includes(s.id));
  const path = sel ? getPath(from, sel) : null;
  const meta = path ? polyMeta(path) : null;

  useEffect(() => { progRef.current = 0; doneRef.current = false; setProg(0); }, [sel]);

  const onPos = useCallback((x, y) => {
    if (!path || !meta || doneRef.current) return;
    const { s, d } = projectS(path, meta, x, y);
    if (d > 10) return;                                   // 手指離路徑太遠，不算
    if (s < progRef.current - 1) return;                  // 只能往前
    if (s > progRef.current + meta.total * 0.25) return;  // 不准跳關
    progRef.current = s;
    setProg(s);
    if (s >= meta.total - 0.8) {
      doneRef.current = true;
      const stop = STOPS.find((t) => t.id === sel);
      setTimeout(() => onArrive(sel, stop ? stop.view : "gardener"), 280);
    }
  }, [path, meta, sel, onArrive]);

  const [dragRef, handlers] = usePointerDrag(onPos);

  const mePos = path && meta ? pointAt(path, meta, prog) : [NODES[from].x, NODES[from].y];
  const pct = meta && meta.total ? prog / meta.total : 0;

  const pins = [
    ...STOPS.map((s) => ({ id: s.id, name: s.name, state: doneIds.includes(s.id) ? "done" : "lit" })),
    { id: "park", name: "公園 · 風車", state: allDone ? "lit" : "locked" },
  ];

  function tapPin(p) {
    if (sel) return;
    if (p.state === "done") { setMsg("這裡查過了。"); return; }
    if (p.state === "locked") { setMsg("三個地方都查完，才知道該往哪裡去。"); return; }
    if (p.id === from) return;
    setSel(p.id);
    setMsg("用手指，沿著虛線把光拖過去。");
  }

  return (<>
    <div className="kicker enter">MAP · 森芯島</div>
    <div className="htitle enter d2">{allDone ? "剩下最後一個地方。" : "先去哪裡，你決定。"}</div>
    <div className="narr enter d3" style={{ marginTop: 8 }}>
      {allDone
        ? <>夜裡抱著光往公園去、白天又總能「剛好」找到光的——<b>只剩一個人還亮著。</b></>
        : <>島上有三個地方要查，<b>順序隨你</b>。查完一個，那盞燈就會暗下來。</>}
    </div>

    <div
      ref={(el) => { wrapRef.current = el; dragRef.current = el; }}
      className="mapwrap enter d4"
      data-map="1"
      {...(sel ? handlers : {})}>
      <img src={imgMap} alt="島嶼地圖" draggable="false" />

      {path && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <polyline points={path.map((p) => p[0] + "," + p[1]).join(" ")}
            fill="none" stroke="rgba(80,55,35,.4)" strokeWidth="1.5"
            strokeDasharray="4 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <polyline points={path.map((p) => p[0] + "," + p[1]).join(" ")}
            fill="none" stroke="#cf6442" strokeWidth="2.2" strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength="1" strokeDasharray="1" strokeDashoffset={1 - pct} />
        </svg>
      )}

      {pins.map((p) => {
        const n = NODES[p.id];
        const cls = sel === p.id ? "sel" : p.state;
        return (
          <div key={p.id}>
            <div className={"mpin " + cls} data-pin={p.id}
              style={{ left: n.x + "%", top: n.y + "%" }}
              onClick={() => tapPin(p)} />
            <div className={"mlabel" + (p.state !== "lit" ? " dim" : "")}
              style={{ left: n.x + "%", top: n.y + "%" }}>{p.name}</div>
          </div>
        );
      })}

      <div className={"me" + (sel ? "" : " idle")} style={{ left: mePos[0] + "%", top: mePos[1] + "%" }} />
    </div>

    <div className="mapmsg">
      {sel
        ? (pct > 0.02 ? "還有 " + Math.max(1, Math.round((1 - pct) * 100)) + "%" : msg)
        : (msg || "點一個亮著的地方。")}
    </div>

    {sel && (
      <div className="foot">
        <button className="btn ghost" onClick={() => { setSel(null); setMsg(""); }}>換一個地方</button>
      </div>
    )}
  </>);
}

/* ================= 抓語病：八個詞塊 ================= */
function SlipChunks({ onNext }) {
  const [step, setStep] = useState(0);
  const [bad, setBad] = useState(null);
  const [why, setWhy] = useState(null);
  const [caught, setCaught] = useState(false);
  const [fly, setFly] = useState(null);
  const [flew, setFlew] = useState(false);
  const [inBook, setInBook] = useState(false);
  const boxRef = useRef(null);
  const bookRef = useRef(null);

  function tap(i, e) {
    const c = CHUNKS[i];
    if (c.slip) {
      const box = boxRef.current.getBoundingClientRect();
      const r = e.currentTarget.getBoundingClientRect();
      const b = bookRef.current.getBoundingClientRect();
      setCaught(true);
      setFly({
        t: c.t,
        x: r.left - box.left,
        y: r.top - box.top,
        dx: (b.left - box.left + 30) - (r.left - box.left),
        dy: (b.top - box.top + 4) - (r.top - box.top),
      });
      requestAnimationFrame(() => requestAnimationFrame(() => setFlew(true)));
      setTimeout(() => { setInBook(true); setFly(null); }, 850);
    } else {
      setBad(i); setWhy(c.no);
      setTimeout(() => setBad(null), 520);
    }
  }

  return (<div ref={boxRef} style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
    <div className="kicker enter">PARK · 綠色園丁</div>
    <div className="htitle enter d2">她講太多了。</div>

    {step === 0 && (
      <div className="scene enter d3">
        <img src={imgPark} alt="公園" />
      </div>
    )}

    <div className="who enter d3">
      <div className="face"><img src={imgGardener} alt="綠色園丁" /></div>
      <div className="saybox">
        <div className="name">綠色園丁</div>
        <div className="say">她滿頭大汗，正忙著把「找到的」光，一顆一顆分給大家。</div>
      </div>
    </div>

    {step === 0 && (<>
      <div className="narr enter d4">
        「我天一亮就四處找了，能找回多少算多少。」<br />
        「別急，這種事急不來，光會一點一點回來的。」
      </div>
      <div className="narr enter d5">然後她轉過頭，笑著補了一句——</div>
      <div className="foot"><button className="btn ghost" onClick={() => setStep(1)}>……</button></div>
    </>)}

    {step === 1 && (<>
      <div className="found enter">島上的人只知道一件事——<b>光，一夜之間全沒了</b>。沒有人知道是「怎麼」不見的。</div>
      <div className="narr enter d2" style={{ marginTop: 10, fontSize: 13.5 }}>
        {caught ? "就是這四個字。" : <>點出<b>那一個她不該知道的詞</b>。</>}
      </div>

      <div className="chunks">
        {CHUNKS.map((c, i) => (
          <button key={i}
            className={"chunk" + (bad === i ? " no" : "") + (caught && c.slip ? " gone" : "")}
            data-chunk={c.t}
            onClick={(e) => { if (!caught) tap(i, e); }}>
            {c.t}
          </button>
        ))}
      </div>

      {why && !caught && <div className="hint" key={why}>{why}</div>}

      <div ref={bookRef} className={"book" + (inBook ? " hit" : "")}>
        <div className="bi" />
        <div className="bt">
          {inBook
            ? <>筆記本 · <b>裝進罐子</b><br />只有親手把光收走的人，才講得出這四個字。</>
            : "旅人的筆記本（還是空的）"}
        </div>
      </div>

      {fly && (
        <div className="flyer"
          style={{
            left: fly.x, top: fly.y,
            transform: flew ? "translate(" + fly.dx + "px," + fly.dy + "px) scale(.55)" : "none",
            opacity: flew ? 0 : 1,
            transition: "transform .8s cubic-bezier(.3,.9,.3,1), opacity .8s ease .15s",
          }}>
          {fly.t}
        </div>
      )}

      {inBook && <div className="foot"><button className="btn" onClick={onNext}>攤牌 →</button></div>}
    </>)}
  </div>);
}

/* ================= 攤牌 ================= */
function Reveal({ onNext }) {
  const [step, setStep] = useState(0);
  return (<>
    <div className="kicker enter">TRUTH · 攤牌</div>
    <div className="htitle enter d2">我把那句話，輕輕還給她。</div>

    <div className="who enter d3" style={{ marginTop: 14 }}>
      <div className="face big"><img src={imgJarShut} alt="裝著光的罐子" /></div>
      <div className="saybox">
        <div className="name">罐子</div>
        <div className="say">「你剛才說——<span className="slip">裝進罐子</span>。」</div>
      </div>
    </div>

    <div className="narr enter d4">她笑不下去了。手裡那籃還沒放完的光，慢慢垂了下來。</div>

    {step >= 1 && (<>
      <div className="who enter">
        <div className="face"><img src={imgGardener} alt="綠色園丁" /></div>
        <div className="saybox">
          <div className="name">綠色園丁</div>
          <div className="say">「……我只是怕。怕有一天，大家都不需要我了。所以我想，只要光還得靠我找回來，我就還……」</div>
        </div>
      </div>
      <div className="narr enter">話沒說完，她整個人就軟了，把硬撐了一整天的力氣，全卸了下來。</div>
    </>)}

    {step >= 2 && (<>
      <div className="narr enter">奇怪的是，<b>沒有人罵她</b>。圍過來的島民看著她的慌、她的狼狽，幾乎同時就懂了——她不是壞，只是怕沒人需要她。</div>
      <div className="found enter" style={{ fontSize: 16, fontWeight: 700, color: "#b5562f", lineHeight: 1.8 }}>「你直接講一聲，不就好了。」</div>
      <div className="narr enter">這座島就是這樣——把話憋著的人，總會被看穿，然後被接住。</div>
    </>)}

    <div className="foot">
      {step < 2
        ? <button className="btn ghost" onClick={() => setStep(step + 1)}>……</button>
        : <button className="btn" onClick={onNext}>幫她把光放回去 →</button>}
    </div>
  </>);
}

/* ================= 放回光 ================= */
function Fireflies({ onNext }) {
  const cvs = useRef(null);
  const [n, setN] = useState(0);
  const done = n >= 24;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = c.clientWidth, H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);

    const motes = Array.from({ length: 30 }, () => ({
      x: Math.random() * W, y: H * 0.45 + Math.random() * H * 0.5,
      r: 1.6 + Math.random() * 2.2, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, up: false, a: 1
    }));
    let raf, ptr = null, caught = 0, dragging = false;

    const setPtr = (e) => {
      const r = c.getBoundingClientRect();
      const p = e.touches && e.touches[0] ? e.touches[0] : e;
      ptr = { x: p.clientX - r.left, y: p.clientY - r.top };
    };
    const onDown = (e) => {
      dragging = true;
      if (c.setPointerCapture && e.pointerId != null) { try { c.setPointerCapture(e.pointerId); } catch (_) { /* noop */ } }
      setPtr(e);
    };
    const onMove = (e) => { if (dragging) setPtr(e); };
    const onUp = () => { dragging = false; ptr = null; };
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp);
    c.addEventListener("pointercancel", onUp);

    function draw() {
      const prog = Math.min(1, caught / 24);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgb(" + Math.round(22 + 200 * prog) + "," + Math.round(30 + 170 * prog) + "," + Math.round(56 + 110 * prog) + ")");
      g.addColorStop(1, "rgb(" + Math.round(38 + 200 * prog) + "," + Math.round(46 + 160 * prog) + "," + Math.round(70 + 90 * prog) + ")");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      motes.forEach(m => {
        if (!m.up && ptr) {
          if (Math.hypot(m.x - ptr.x, m.y - ptr.y) < 34) { m.up = true; caught++; setN(caught); }
        }
        if (m.up) { m.y -= 1.15; m.a -= 0.008; }
        else { m.x += m.vx; m.y += m.vy; if (m.x < 0 || m.x > W) m.vx *= -1; if (m.y < H * .35 || m.y > H) m.vy *= -1; }
        if (m.a <= 0) return;
        const gg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
        gg.addColorStop(0, "rgba(255,232,170," + m.a + ")");
        gg.addColorStop(1, "rgba(255,220,140,0)");
        ctx.fillStyle = gg;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 5, 0, 7); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerup", onUp);
      c.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (<>
    <div className="kicker enter">DAWN · 把光放回去</div>
    <div className="htitle enter d2">大家一起動手。</div>

    <div className="who enter d3">
      <div className="face"><img src={imgJarOpen} alt="打開的罐子" /></div>
      <div className="saybox">
        <div className="name">罐子開了</div>
        <div className="say">光從罐口流出來，散進土裡、又慢慢浮起來。</div>
      </div>
    </div>

    <div className="narr enter d4" style={{ marginTop: 10 }}><b>用手把四散的光掃起來</b>，一點一點，放回天上。</div>

    <canvas ref={cvs} className="enter d5" data-fly="1"
      style={{ width: "100%", height: 230, borderRadius: 14, marginTop: 12, touchAction: "none", boxShadow: "0 10px 26px -14px rgba(70,50,32,.55)" }} />

    <div className="mapmsg">{done ? "天，一點一點亮了起來。" : "已收回 " + n + " 顆"}</div>
    {done && <div className="foot"><button className="btn" onClick={onNext}>看著天亮 →</button></div>}
  </>);
}

/* ================= 封面 ================= */
function Cover({ onEnter }) {
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      backgroundImage: "url(" + imgCover + ")", backgroundSize: "cover", backgroundPosition: "center",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(18,26,42,.42) 0%, rgba(18,26,42,.12) 32%, rgba(18,26,42,0) 55%, rgba(18,26,42,.35) 100%)" }} />
      <div style={{ position: "relative", padding: "62px 26px 0", textAlign: "center" }}>
        <div style={{ fontFamily: "'Noto Serif TC'", fontWeight: 700, fontSize: 40, color: "#fbf3e4", letterSpacing: ".08em", textShadow: "0 2px 18px rgba(10,18,30,.6)" }}>森芯島</div>
        <div style={{ fontSize: 14, color: "#e8c88c", letterSpacing: ".38em", marginTop: 10, textShadow: "0 2px 12px rgba(10,18,30,.7)" }}>光點失蹤事件</div>
      </div>
      <div style={{ position: "relative", marginTop: "auto", padding: "0 30px 44px" }}>
        <button className="btn" onClick={onEnter}>上島 →</button>
        <div style={{ fontSize: 12, color: "#e6dcc9", textAlign: "center", marginTop: 12, textShadow: "0 1px 8px rgba(10,18,30,.8)" }}>一座島的光，一夜之間全不見了。</div>
      </div>
    </div>
  );
}

/* ================= 流程 ================= */
const BACKMAP = {
  find: "cover", guess: "find", case: "guess",
  hub: "case", spring: "hub", countess: "hub", miracle: "hub",
  gardener: "hub", reveal: "gardener", restore: "reveal", ending: "restore",
  cardq: "ending", cardresult: "cardq",
};

export default function App() {
  const [view, setView] = useState("cover");
  const [hunch, setHunch] = useState(null);
  const [card, setCard] = useState(null);
  const [at, setAt] = useState("dock");
  const [doneIds, setDoneIds] = useState([]);
  const go = (v) => setView(v);

  // 全域：關掉雙指縮放、雙擊放大、長按選單
  useEffect(() => {
    const stop = (e) => e.preventDefault();
    document.addEventListener("gesturestart", stop);
    document.addEventListener("gesturechange", stop);
    document.addEventListener("contextmenu", stop);
    let lastTap = 0;
    const dbl = (e) => {
      const now = Date.now();
      if (now - lastTap < 300) e.preventDefault();
      lastTap = now;
    };
    document.addEventListener("touchend", dbl, { passive: false });
    return () => {
      document.removeEventListener("gesturestart", stop);
      document.removeEventListener("gesturechange", stop);
      document.removeEventListener("contextmenu", stop);
      document.removeEventListener("touchend", dbl);
    };
  }, []);

  const prog = (() => {
    const base = { cover: 0, find: .06, guess: .12, case: .18 }[view];
    if (base != null) return base;
    if (["hub", "spring", "countess", "miracle"].includes(view)) return .22 + doneIds.length * 0.16;
    return { gardener: .78, reveal: .86, restore: .93, ending: .97, cardq: .99, cardresult: 1 }[view] || 0;
  })();

  const arrive = useCallback((id, nextView) => { setAt(id); setView(nextView); }, []);
  const finishStop = (id) => {
    setDoneIds((d) => (d.includes(id) ? d : [...d, id]));
    go("hub");
  };

  return (
    <div className="stage">
      <style>{CSS}</style>
      <div className="phone">
        <div className="notch" />
        <div className="screen">
          {view === "cover" && <Cover onEnter={() => go("find")} />}

          {view !== "cover" && (<>
            <div className="topbar">
              <div className="tag">森芯島 · 光點失蹤事件</div>
              <button className="back" onClick={() => go(BACKMAP[view])}>‹ 上一步</button>
            </div>
            <div className="prog"><i style={{ width: prog * 100 + "%" }} /></div>

            <div className="body" key={view} data-view={view}>

              {view === "find" && <FindWrong onNext={() => go("guess")} />}

              {view === "guess" && (<>
                <div className="kicker enter">HUNCH · 先猜一個</div>
                <div className="htitle enter d2">還沒查——你覺得是誰？</div>
                <div className="narr enter d3">憑直覺先押一個。等你查完，再看看準不準。</div>
                <div className="g4 enter d4">
                  {SUS.map((s) => (
                    <div key={s} className="gcard" data-sus={s} onClick={() => { setHunch(s); go("case"); }}>
                      <img src={FACES[s]} alt={s} />
                      <div className="gn">{s}</div>
                      <div className="gd">{HUNCH[s]}</div>
                    </div>
                  ))}
                </div>
              </>)}

              {view === "case" && (<>
                <div className="kicker enter">CASE · 接案</div>
                <div className="htitle enter d2">光點，被誰拿走了？</div>
                <div className="narr enter d3">
                  你是一位來自捷克的旅人，在這座島待了三天。<br />
                  島民們說「光點」是每天發給大家的一點點小確幸。<br />
                  昨晚，它們一顆不剩地消失了，<br />
                  這也難怪，<br />
                  牛奶和花盆都倒了，花朵也枯萎了。
                </div>
                <div className="found enter d4">你心裡猜的是 <b>{hunch}</b>。那就跟著線索，一處一處查下去——看是不是這麼回事。</div>
                <div className="foot"><button className="btn" onClick={() => go("hub")}>打開地圖 →</button></div>
              </>)}

              {view === "hub" && <MapHub from={at} doneIds={doneIds} onArrive={arrive} />}

              {view === "spring" && <TorchScene onNext={() => finishStop("fountain")} />}
              {view === "countess" && <CountessScene onNext={() => finishStop("manor")} />}
              {view === "miracle" && <MiracleScene onNext={() => finishStop("cliffhut")} />}

              {view === "gardener" && <SlipChunks onNext={() => go("reveal")} />}
              {view === "reveal" && <Reveal onNext={() => go("restore")} />}
              {view === "restore" && <Fireflies onNext={() => go("ending")} />}

              {view === "ending" && (<>
                <div className="kicker enter">MORNING · 光回來了</div>
                <div className="htitle enter d2">島上的每件小事，又回到原本的樣子。</div>
                <div className="scene enter d3">
                  <img src={imgDawn} alt="黎明" />
                </div>
                <div className="narr enter d4">牛奶沒再打翻，花盆扶起來了，窗台的花也重新開了。</div>
                <div className="found enter d5">你一開始猜的是 <b>{hunch}</b>；查到最後，藏光的是<b>綠色園丁</b>。</div>
                <div className="narr enter">我合上筆記本，準備繼續旅行。離開前，島上的人想送你一盞光。</div>
                <div className="foot"><button className="btn" onClick={() => go("cardq")}>領一盞屬於你的光 →</button></div>
              </>)}

              {view === "cardq" && (<>
                <div className="kicker enter">GIFT · 角落卡</div>
                <div className="htitle enter d2">你最近，最需要哪一種光？</div>
                <div className="narr enter d3">憑直覺選一個就好。</div>
                {CARDS.map((c, i) => (
                  <button key={i} className="opt" data-card={i} onClick={() => { setCard(c); go("cardresult"); }}>{c.q}</button>
                ))}
              </>)}

              {view === "cardresult" && card && (<>
                <div className="kicker enter">YOUR CARD · 你的角落卡</div>
                <div className="scard enter d2">
                  <div style={{ fontSize: 11, letterSpacing: ".22em", color: "#a99883" }}>SH ISLAND · 角落卡</div>
                  <div className="sname">{card.name}</div>
                  <div className="sprod">{card.prod}</div>
                  <div className="sline">{card.line}</div>
                </div>
                <div className="cta enter d3">
                  把這張角落卡<b>截圖</b>，私訊 IG <b>@sh.island.tw</b>，就能領一份對應你的小光。<br />
                  到台中<b>金典綠園道</b>的櫃上，還有給你的島上小驚喜。
                </div>
                <div className="foot">
                  <button className="btn ghost" onClick={() => {
                    setHunch(null); setCard(null); setAt("dock"); setDoneIds([]); go("cover");
                  }}>再玩一次</button>
                </div>
              </>)}

            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
