import { useState, useRef, useEffect } from "react";

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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&display=swap');
:root{
  --paper:#f5eede; --ink:#392e26; --ink2:#4a3c30; --muted:#8c7c6a;
  --terra:#cf6442; --terra-d:#b5562f; --terra-l:#e88161; --gold:#d6a05c;
  --sage:#6f8466; --sage-d:#5e6b4e; --line:#e4d6bf; --card:#fbf6ec;
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
.stage { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 12px;
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
.body { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 12px 22px 16px; z-index: 2; display: flex; flex-direction: column; }
.body::-webkit-scrollbar { width: 0; }
.kicker { font-family: 'Fraunces', serif; font-style: italic; color: var(--terra-d); letter-spacing: .16em; font-size: 12px; text-transform: uppercase; }
.htitle { font-family: 'Noto Serif TC'; font-weight: 700; color: var(--ink); font-size: 23px; margin-top: 8px; line-height: 1.4; }
.narr { color: var(--ink2); font-size: 14.5px; line-height: 1.9; margin-top: 11px; }
.narr b, .found b, .say b { color: var(--terra-d); font-weight: 700; }
.q { font-family: 'Noto Serif TC'; font-weight: 700; color: var(--ink); font-size: 18px; margin-top: 14px; }
.enter { animation: rise .55s cubic-bezier(.2,.7,.2,1) both; }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.d2{animation-delay:.1s}.d3{animation-delay:.2s}.d4{animation-delay:.3s}.d5{animation-delay:.4s}
.opt { width: 100%; text-align: left; border: 1px solid var(--line); background: var(--card); border-radius: 14px; padding: 13px 15px 13px 17px; margin-top: 10px; font-size: 14.5px; line-height: 1.7; color: var(--ink2); cursor: pointer; position: relative; box-shadow: 0 3px 9px -7px rgba(90,60,40,.4); }
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
.scene { position: relative; width: 100%; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -14px rgba(70,50,32,.55); flex-shrink: 1; min-height: 0; }
.scene img { display: block; width: 100%; height: auto; }
.hot { position: absolute; border-radius: 12px; cursor: pointer; transition: .25s; }
.hot.on { background: radial-gradient(closest-side, rgba(255,214,140,.55), rgba(255,214,140,0)); box-shadow: inset 0 0 0 2px rgba(230,170,90,.9); }
.pin { position: absolute; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; background: #fff8ea; border: 2px solid var(--terra); display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--terra-d); font-weight: 700; box-shadow: 0 3px 8px rgba(80,50,30,.35); animation: pop .3s cubic-bezier(.2,1.5,.4,1) both; }
@keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }

/* ---------- 角色 ---------- */
.who { display: flex; gap: 12px; align-items: flex-start; margin-top: 12px; }
.face { width: 92px; height: 92px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background: var(--paper); }
.face img { width: 100%; height: 100%; object-fit: cover; display: block; }
.face.big { width: 130px; height: 130px; }
.saybox { flex: 1; }
.name { font-size: 12.5px; color: var(--sage); font-weight: 700; letter-spacing: .04em; }
.say { font-size: 14.5px; color: var(--ink2); line-height: 1.8; margin-top: 4px; }
.slip { color: var(--terra-d); font-weight: 700; }

/* 逐一放下 */
.row3 { display: flex; gap: 8px; margin-top: 14px; }
.sus { flex: 1; text-align: center; cursor: pointer; padding: 8px 4px 10px; border-radius: 14px; border: 1px solid var(--line); background: var(--card); transition: .35s; }
.sus img { width: 100%; border-radius: 10px; display: block; transition: .5s; }
.sus .sn { font-size: 12px; color: var(--ink2); margin-top: 6px; font-weight: 700; }
.sus.lit { box-shadow: 0 0 0 2px #e8b877, 0 0 22px rgba(232,184,119,.55); }
.sus.lit img { filter: none; }
.sus.off { opacity: .42; }
.sus.off img { filter: grayscale(1) brightness(.85); }
.sus.culprit { box-shadow: 0 0 0 2px var(--terra), 0 0 26px rgba(207,100,66,.5); animation: breathe 1.9s ease-in-out infinite; }
@keyframes breathe { 0%,100% { box-shadow: 0 0 0 2px var(--terra), 0 0 14px rgba(207,100,66,.35); } 50% { box-shadow: 0 0 0 2px var(--terra), 0 0 30px rgba(207,100,66,.7); } }

/* ---------- 地圖 ---------- */
.mapwrap { position: relative; width: 100%; flex-shrink: 1; min-height: 0; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -14px rgba(70,50,32,.55); }
.mapwrap img { display: block; width: 100%; height: auto; }
.mnode { position: absolute; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: rgba(255,250,240,.55); box-shadow: 0 0 0 1px rgba(140,100,70,.35); }
.mnode.goal { width: 16px; height: 16px; margin: -8px 0 0 -8px; background: var(--gold); box-shadow: 0 0 0 2px #fff8ea, 0 0 14px rgba(214,160,92,.9); animation: breathe2 2s ease-in-out infinite; }
@keyframes breathe2 { 0%,100% { transform: scale(1); } 50% { transform: scale(1.18); } }
.me { position: absolute; width: 20px; height: 20px; margin: -10px 0 0 -10px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff6e2, var(--terra)); box-shadow: 0 0 0 3px rgba(255,248,235,.85), 0 0 18px rgba(207,100,66,.7); transition: left .35s cubic-bezier(.3,.8,.3,1), top .35s cubic-bezier(.3,.8,.3,1); z-index: 3; }
.dpad { display: grid; grid-template-columns: repeat(3,44px); grid-template-rows: repeat(3,44px); gap: 5px; justify-content: center; margin: 12px auto 0; }
.dbtn { border: 1px solid #dcc7a8; background: #fbf3e6; border-radius: 11px; font-size: 17px; color: var(--terra-d); cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 7px -4px rgba(90,60,40,.5); }
.dbtn:active { background: #f5e3cc; transform: translateY(1px); }
.mapmsg { text-align: center; font-size: 12.5px; color: var(--muted); margin-top: 8px; min-height: 18px; }

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

// 找碴：清晨的島（座標為圖片百分比）
const FINDS = [
  { k: "milk", l: 5, t: 77, w: 27, h: 21, note: "牛奶打翻了，沒人扶起來。" },
  { k: "pot", l: 35, t: 79, w: 28, h: 19, note: "花盆摔碎了，土撒了一地。" },
  { k: "flower", l: 69, t: 37, w: 29, h: 27, note: "窗台的花，全枯了。" },
];

// 手電筒：夜晚的噴泉
const SPRING_SPOTS = [
  { k: "post", l: 11, t: 35, w: 22, h: 24, note: "守泉人該站的位置——空的。" },
  { k: "water", l: 21, t: 55, w: 50, h: 32, note: "泉水還流著，半夜卻沒人看顧。" },
  { k: "steps", l: 2, t: 85, w: 42, h: 14, note: "地上一串腳印，往島的另一頭去了。" },
];

const HUNCH = {
  "守泉人": "守著幸運噴泉，話不多。",
  "伯爵夫人": "高高在上，說過「沒有光，清靜多了」。",
  "奇蹟先生": "獨來獨往，沒人摸得透他。",
  "綠色園丁": "天天照顧島上的花與光，碰得到光點的人。",
};

const FACES = { "綠色園丁": imgGardener, "守泉人": imgKeeper, "伯爵夫人": imgCountess, "奇蹟先生": imgMiracle };

const CLEARS = [
  { who: "守泉人", concl: "那晚有伯爵夫人作證，在她那兒" },
  { who: "伯爵夫人", concl: "和守泉人在一起，又怕黑，不可能" },
  { who: "奇蹟先生", concl: "是那晚的目擊者，主動指了方向" },
];

const GLINES = [
  { t: "我天一亮就四處找了，能找回多少算多少。", slip: false, no: "這只是她在表功，沒露餡。" },
  { t: "別急，這種事急不來，光會一點一點回來的。", slip: false, no: "場面話，聽不出破綻。" },
  { t: "要我說啊，準是有人趁半夜，把光一顆顆裝進罐子收走了。", slip: true },
  { t: "島上的光我最熟，交給我，錯不了。", slip: false, no: "逞強罷了，不算什麼。" },
];

const CARDS = [
  { q: "想要一個更透亮的早晨", name: "亮白之光", prod: "美麗園丁亮白系列", line: "像綠色園丁照顧的那盞——讓暗下來的地方，重新亮回來。" },
  { q: "最近覺得乾乾的、需要水", name: "清泉之光", prod: "草本清爽保濕水", line: "像守泉人守著的那口泉——安安靜靜，把你重新蓄滿。" },
  { q: "有點累，想被好好照顧", name: "貴氣之光", prod: "伯爵夫人精華液", line: "像伯爵夫人卸下盔甲後的柔軟——讓你也被好好寵一次。" },
  { q: "想要一點不一樣的驚喜", name: "奇蹟之光", prod: "奶油自然奇蹟乳霜", line: "像奇蹟先生那樣不按牌理——給你一點意想不到的好。" },
  { q: "想試試遠方帶來的東西", name: "旅人之光", prod: "Havlíkova Apotéka", line: "像旅人行囊裡的舶來品——帶你去沒去過的地方。" },
];

/* ================= 島嶼地圖 ================= */
const NODES = {
  dock: { x: 31, y: 88, n: "碼頭" },
  beach: { x: 40, y: 85, n: "" },
  boathouse: { x: 47, y: 83, n: "" },
  fountain: { x: 41, y: 76, n: "幸運噴泉" },
  westroad: { x: 30, y: 73, n: "" },
  manor: { x: 57, y: 70, n: "伯爵夫人宅邸" },
  cottages: { x: 23, y: 66, n: "民宅群" },
  lowcot: { x: 23, y: 56, n: "" },
  palemanor: { x: 56, y: 52, n: "大宅" },
  eastroad: { x: 62, y: 45, n: "" },
  windmill: { x: 41, y: 38, n: "小風車" },
  westhut: { x: 20, y: 36, n: "" },
  eastridge: { x: 64, y: 26, n: "" },
  cliffhut: { x: 76, y: 22, n: "懸崖小屋" },
  parkgate: { x: 33, y: 25, n: "" },
  village: { x: 49, y: 27, n: "村落" },
  park: { x: 44, y: 16, n: "公園 · 風車" },
};

const EDGES = [
  ["dock", "beach"], ["beach", "boathouse"], ["beach", "fountain"],
  ["boathouse", "manor"], ["fountain", "westroad"], ["fountain", "manor"],
  ["westroad", "cottages"], ["cottages", "lowcot"], ["lowcot", "westhut"],
  ["manor", "palemanor"], ["palemanor", "eastroad"], ["palemanor", "windmill"],
  ["westhut", "windmill"], ["westhut", "parkgate"],
  ["eastroad", "eastridge"], ["eastridge", "cliffhut"], ["eastridge", "village"],
  ["windmill", "village"], ["parkgate", "park"], ["village", "park"],
];

const ADJ = {};
Object.keys(NODES).forEach(k => { ADJ[k] = []; });
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });

const DIRS = { up: -90, down: 90, left: 180, right: 0 };

function IslandMap({ from, to, title, kicker, intro, nextLabel, onNext }) {
  const [at, setAt] = useState(from);
  const [msg, setMsg] = useState("");
  const arrived = at === to;

  function move(dir) {
    if (arrived) return;
    const want = DIRS[dir];
    const cur = NODES[at];
    let best = null, bestDiff = 999;
    ADJ[at].forEach(nb => {
      const t = NODES[nb];
      let deg = Math.atan2(t.y - cur.y, t.x - cur.x) * 180 / Math.PI;
      let diff = Math.abs(((deg - want + 540) % 360) - 180);
      if (diff < bestDiff) { bestDiff = diff; best = nb; }
    });
    if (best && bestDiff <= 70) {
      setAt(best);
      setMsg(NODES[best].n ? "來到　" + NODES[best].n : "");
    } else {
      setMsg("那邊沒有路。");
    }
  }

  const me = NODES[at];

  return (<>
    <div className="kicker enter">{kicker}</div>
    <div className="htitle enter d2">{title}</div>
    <div className="narr enter d3">{intro}</div>

    <div className="mapwrap enter d4" style={{ marginTop: 12 }}>
      <img src={imgMap} alt="島嶼地圖" />
      {Object.entries(NODES).map(([k, v]) => (
        <div key={k}
          className={"mnode" + (k === to ? " goal" : "")}
          style={{ left: v.x + "%", top: v.y + "%" }} />
      ))}
      <div className="me" style={{ left: me.x + "%", top: me.y + "%" }} />
    </div>

    <div className="mapmsg">{arrived ? "到了。" : msg}</div>

    {!arrived && (
      <div className="dpad">
        <span />
        <button className="dbtn" onClick={() => move("up")}>▲</button>
        <span />
        <button className="dbtn" onClick={() => move("left")}>◀</button>
        <span />
        <button className="dbtn" onClick={() => move("right")}>▶</button>
        <span />
        <button className="dbtn" onClick={() => move("down")}>▼</button>
        <span />
      </div>
    )}

    {arrived && <div className="foot"><button className="btn" onClick={onNext}>{nextLabel}</button></div>}
  </>);
}

/* ================= 找碴（真圖點擊） ================= */
function FindWrong({ onNext }) {
  const [got, setGot] = useState([]);
  const done = got.length === FINDS.length;

  return (<>
    <div className="kicker enter">MORNING · 島上的早晨</div>
    <div className="htitle enter d2">今天的島，哪裡不太對？</div>
    <div className="narr enter d3">走出門，一切看起來都還好——可是又好像，有什麼小事全都不順了。<b>點出三個不對勁的地方。</b></div>

    <div className="scene enter d4" style={{ marginTop: 12 }}>
      <img src={imgMorning} alt="清晨的島" />
      {FINDS.map((s, i) => {
        const hit = got.includes(s.k);
        return (
          <div key={s.k}
            className={"hot" + (hit ? " on" : "")}
            style={{ left: s.l + "%", top: s.t + "%", width: s.w + "%", height: s.h + "%" }}
            onClick={() => !hit && setGot([...got, s.k])} />
        );
      })}
      {FINDS.filter(s => got.includes(s.k)).map(s => (
        <div key={s.k} className="pin" style={{ left: (s.l + s.w / 2) + "%", top: (s.t + s.h / 2) + "%" }}>✓</div>
      ))}
    </div>

    {FINDS.filter(s => got.includes(s.k)).map(s => (
      <div className="found" key={s.k}>{s.note}</div>
    ))}

    {done && (
      <div className="foot">
        <div className="narr" style={{ marginTop: 0 }}>每一件都是小事。可是全部湊在一起——<b>今天的運氣，好像被誰拿走了。</b></div>
        <button className="btn" style={{ marginTop: 12 }} onClick={onNext}>開始查這座島 →</button>
      </div>
    )}
    {!done && <div className="hint">還有 {FINDS.length - got.length} 個地方不對勁</div>}
  </>);
}

/* ================= 手電筒（真圖夜景） ================= */
function TorchScene({ onNext }) {
  const wrapRef = useRef(null);
  const dragRef = useRef(false);
  const [pos, setPos] = useState({ x: 50, y: 55 });
  const [lit, setLit] = useState(false);
  const [got, setGot] = useState([]);
  const done = got.length === SPRING_SPOTS.length;

  function at(e) {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    const x = ((p.clientX - r.left) / r.width) * 100;
    const y = ((p.clientY - r.top) / r.height) * 100;
    setPos({ x, y });
    setLit(true);
    SPRING_SPOTS.forEach(s => {
      if (x >= s.l && x <= s.l + s.w && y >= s.t && y <= s.t + s.h) {
        setGot(g => (g.includes(s.k) ? g : [...g, s.k]));
      }
    });
  }

  function down(e) {
    dragRef.current = true;
    if (e.currentTarget.setPointerCapture && e.pointerId != null) {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { }
    }
    at(e);
  }
  function move(e) { if (dragRef.current) at(e); }
  function up() { dragRef.current = false; }

  const mask = "radial-gradient(circle 78px at " + pos.x + "% " + pos.y + "%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 72%, rgba(0,0,0,.9) 100%)";

  return (<>
    <div className="kicker enter">NIGHT · 幸運噴泉</div>
    <div className="htitle enter d2">那一夜，這裡發生了什麼？</div>
    <div className="narr enter d3">那一夜太暗了。<b>按住畫面，把手裡這束光慢慢掃過去</b>——被光照到的地方，才看得見。</div>

    <div ref={wrapRef} className="scene enter d4" style={{ marginTop: 12, touchAction: "none", cursor: "crosshair" }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      onTouchStart={at} onTouchMove={at}>
      <img src={imgFountain} alt="夜晚的幸運噴泉" draggable="false" />
      <div style={{ position: "absolute", inset: 0, background: lit ? mask : "rgba(0,0,0,.92)", transition: "background .05s linear", pointerEvents: "none" }} />
      {SPRING_SPOTS.filter(s => got.includes(s.k)).map(s => (
        <div key={s.k} className="pin" style={{ left: (s.l + s.w / 2) + "%", top: (s.t + s.h / 2) + "%" }}>!</div>
      ))}
    </div>

    {SPRING_SPOTS.filter(s => got.includes(s.k)).map(s => (
      <div className="found" key={s.k}>{s.note}</div>
    ))}

    {!lit && <div className="hint">按住畫面，把光拖過去</div>}
    {!done && lit && <div className="hint">還有 {SPRING_SPOTS.length - got.length} 個地方沒照到</div>}
    {done && <div className="foot"><button className="btn" onClick={onNext}>去問伯爵夫人 →</button></div>}
  </>);
}

/* ================= 伯爵夫人：四個旋鈕 ================= */
const D2R = Math.PI / 180;

// 統一的拖曳事件：不依賴 e.buttons（React 合成事件在 pointermove 上不可靠）
function dragProps(set) {
  let dragging = false;
  return {
    style: { touchAction: "none" },
    onPointerDown: (e) => {
      dragging = true;
      if (e.currentTarget.setPointerCapture && e.pointerId != null) {
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { }
      }
      set(e);
    },
    onPointerMove: (e) => { if (dragging) set(e); },
    onPointerUp: () => { dragging = false; },
    onPointerCancel: () => { dragging = false; },
    onTouchStart: set,
    onTouchMove: set,
  };
}
function polarPt(cx, cy, r, deg) { return [cx + Math.cos(deg * D2R) * r, cy + Math.sin(deg * D2R) * r]; }
function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = polarPt(cx, cy, r, a0), [x1, y1] = polarPt(cx, cy, r, a1);
  const large = (a1 - a0) > 180 ? 1 : 0;
  return "M" + x0 + " " + y0 + " A" + r + " " + r + " 0 " + large + " 1 " + x1 + " " + y1;
}
function pointerDeg(ref, cx, cy) {
  return (e) => {
    const el = ref.current; if (!el) return null;
    const r = el.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    const vb = el.viewBox.baseVal;
    const x = ((p.clientX - r.left) / r.width) * vb.width;
    const y = ((p.clientY - r.top) / r.height) * vb.height;
    return Math.atan2(y - cy, x - cx) * 180 / Math.PI;
  };
}

function Knob({ value, min, max, step, ok, onChange }) {
  const ref = useRef(null);
  const S = 74, C = S / 2, R = 26;
  const A0 = 135, A1 = 405;
  const frac = (value - min) / (max - min);
  const ang = A0 + frac * (A1 - A0);
  const [kx, ky] = polarPt(C, C, R, ang);
  const toDeg = pointerDeg(ref, C, C);
  function set(e) {
    const d = toDeg(e); if (d === null) return;
    let a = d < 0 ? d + 360 : d;
    if (a < A0 - 360 + 360 && a < 90) a += 360;
    if (a < A0) a += 360;
    let f = (a - A0) / (A1 - A0);
    f = Math.max(0, Math.min(1, f));
    onChange(Math.round((min + f * (max - min)) / step) * step);
  }
  return (
    <svg ref={ref} width={S} height={S} viewBox={"0 0 " + S + " " + S}
      {...dragProps(set)}>
      <path d={arcPath(C, C, R, A0, A1)} stroke="#e6d9c2" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={arcPath(C, C, R, A0, Math.max(A0 + 0.1, ang))} stroke={ok ? "#6f8466" : "#cf6442"} strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx={C} cy={C} r="16" fill="#fbf3e6" stroke="#e0cdb0" />
      <circle cx={kx} cy={ky} r="6" fill={ok ? "#6f8466" : "#cf6442"} stroke="#fff8ea" strokeWidth="2" />
    </svg>
  );
}

function VBar({ value, min, max, step, ok, onChange }) {
  const ref = useRef(null);
  const W = 26, H = 66;
  const frac = (value - min) / (max - min);
  function set(e) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    let f = 1 - (p.clientY - r.top) / r.height;
    f = Math.max(0, Math.min(1, f));
    onChange(Math.round((min + f * (max - min)) / step) * step);
  }
  return (
    <svg ref={ref} width={W} height={H} viewBox={"0 0 " + W + " " + H}
      {...dragProps(set)}>
      <rect x="7" y="2" width="12" height={H - 4} rx="6" fill="#e6d9c2" />
      <rect x="7" y={2 + (1 - frac) * (H - 4)} width="12" height={frac * (H - 4)} rx="6" fill={ok ? "#6f8466" : "#cf6442"} />
      <circle cx="13" cy={2 + (1 - frac) * (H - 4)} r="7" fill="#fbf3e6" stroke={ok ? "#6f8466" : "#cf6442"} strokeWidth="2" />
    </svg>
  );
}

function ClockDial({ value, min, max, step, ok, onChange }) {
  const ref = useRef(null);
  const S = 74, C = S / 2, R = 25;
  const frac = (value - min) / (max - min);
  const ang = -90 + frac * 360;
  const [hx, hy] = polarPt(C, C, R - 4, ang);
  const toDeg = pointerDeg(ref, C, C);
  function set(e) {
    const d = toDeg(e); if (d === null) return;
    let a = (d + 90 + 360) % 360;
    let f = a / 360;
    onChange(Math.round((min + f * (max - min)) / step) * step);
  }
  return (
    <svg ref={ref} width={S} height={S} viewBox={"0 0 " + S + " " + S}
      {...dragProps(set)}>
      <circle cx={C} cy={C} r={R} fill="#fbf3e6" stroke="#e0cdb0" strokeWidth="2" />
      {[0, 90, 180, 270].map(a => {
        const [x1, y1] = polarPt(C, C, R - 4, a - 90);
        const [x2, y2] = polarPt(C, C, R - 1, a - 90);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d3bfa2" strokeWidth="1.6" />;
      })}
      <line x1={C} y1={C} x2={hx} y2={hy} stroke={ok ? "#6f8466" : "#cf6442"} strokeWidth="3" strokeLinecap="round" />
      <circle cx={C} cy={C} r="3" fill={ok ? "#6f8466" : "#cf6442"} />
    </svg>
  );
}

function Ring({ value, min, max, step, ok, onChange }) {
  const ref = useRef(null);
  const S = 74, C = S / 2, R = 26;
  const frac = (value - min) / (max - min);
  const len = 2 * Math.PI * R;
  const toDeg = pointerDeg(ref, C, C);
  function set(e) {
    const d = toDeg(e); if (d === null) return;
    let a = (d + 90 + 360) % 360;
    onChange(Math.round((min + (a / 360) * (max - min)) / step) * step);
  }
  return (
    <svg ref={ref} width={S} height={S} viewBox={"0 0 " + S + " " + S}
      {...dragProps(set)}>
      <circle cx={C} cy={C} r={R} fill="none" stroke="#e6d9c2" strokeWidth="7" />
      <circle cx={C} cy={C} r={R} fill="none" stroke={ok ? "#6f8466" : "#cf6442"} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - frac)}
        transform={"rotate(-90 " + C + " " + C + ")"} />
      <text x={C} y={C + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={ok ? "#6f8466" : "#cf6442"}>{value}</text>
    </svg>
  );
}

function CountessDash({ onNext }) {
  const [temp, setTemp] = useState(19);
  const [hours, setHours] = useState(3);
  const [wake, setWake] = useState(600);
  const [qual, setQual] = useState(40);

  const okT = temp === 25, okH = hours === 8, okW = wake === 420, okQ = qual >= 85;
  const all = okT && okH && okW && okQ;
  const hh = Math.floor(wake / 60), mm = wake % 60;
  const wtxt = hh + ":" + String(mm).padStart(2, "0");

  const Card = ({ label, want, val, ok, children }) => (
    <div style={{
      border: "1px solid " + (ok ? "#b8c9a8" : "#e4d6bf"), background: ok ? "#f4f7ef" : "#fbf6ec",
      borderRadius: 14, padding: "10px 8px", textAlign: "center", transition: ".3s"
    }}>
      <div style={{ fontSize: 11.5, color: "#8c7c6a" }}>{label}</div>
      <div style={{ margin: "6px 0 4px", display: "flex", justifyContent: "center" }}>{children}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: ok ? "#5e6b4e" : "#b5562f" }}>{val}</div>
      <div style={{ fontSize: 10.5, color: "#a99883", marginTop: 2 }}>{ok ? "剛好 ✓" : "她要　" + want}</div>
    </div>
  );

  return (<>
    <div className="kicker enter">MANOR · 伯爵夫人</div>
    <div className="htitle enter d2">她龜毛得很，先把她伺候好。</div>

    <div className="who enter d3">
      <div className="face"><img src={imgCountess} alt="伯爵夫人" /></div>
      <div className="saybox">
        <div className="name">伯爵夫人</div>
        <div className="say">「要我開口？先把這幾樣，調到我能忍受的樣子。」</div>
      </div>
    </div>

    <div className="enter d4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 12 }}>
      <Card label="室溫" want="25°C" val={temp + "°C"} ok={okT}>
        <Knob value={temp} min={16} max={30} step={1} ok={okT} onChange={setTemp} />
      </Card>
      <Card label="睡眠" want="8 小時" val={hours + " 小時"} ok={okH}>
        <VBar value={hours} min={0} max={12} step={1} ok={okH} onChange={setHours} />
      </Card>
      <Card label="起床時間" want="7:00" val={wtxt} ok={okW}>
        <ClockDial value={wake} min={0} max={1440} step={30} ok={okW} onChange={setWake} />
      </Card>
      <Card label="空氣品質" want="85 以上" val={qual} ok={okQ}>
        <Ring value={qual} min={0} max={100} step={5} ok={okQ} onChange={setQual} />
      </Card>
    </div>

    {all && (
      <div className="foot">
        <div className="found">「那一晚，守泉人在我這兒。我怕黑，一個人待不住，他過來陪我，到天快亮。我們是十幾年的老朋友。」</div>
        <button className="btn" style={{ marginTop: 10 }} onClick={onNext}>兩個人互相洗清了 →</button>
      </div>
    )}
  </>);
}

/* ================= 放回光 ================= */
function Fireflies({ onNext }) {
  const cvs = useRef(null);
  const [n, setN] = useState(0);
  const done = n >= 24;

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth, H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);

    const motes = Array.from({ length: 30 }, () => ({
      x: Math.random() * W, y: H * 0.45 + Math.random() * H * 0.5,
      r: 1.6 + Math.random() * 2.2, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, up: false, a: 1
    }));
    let raf, ptr = null, caught = 0, dragging = false;

    const rect = () => c.getBoundingClientRect();
    const setPtr = (e) => {
      const r = rect(); const p = e.touches ? e.touches[0] : e;
      ptr = { x: p.clientX - r.left, y: p.clientY - r.top };
    };
    const onDown = (e) => { dragging = true; setPtr(e); };
    const onMove = (e) => { if (dragging) setPtr(e); };
    const onUp = () => { dragging = false; ptr = null; };
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp);
    c.addEventListener("pointerleave", onUp);
    c.addEventListener("touchstart", setPtr, { passive: true });
    c.addEventListener("touchmove", setPtr, { passive: true });
    c.addEventListener("touchend", onUp);

    function draw() {
      const prog = Math.min(1, caught / 24);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgb(" + Math.round(22 + 200 * prog) + "," + Math.round(30 + 170 * prog) + "," + Math.round(56 + 110 * prog) + ")");
      g.addColorStop(1, "rgb(" + Math.round(38 + 200 * prog) + "," + Math.round(46 + 160 * prog) + "," + Math.round(70 + 90 * prog) + ")");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      motes.forEach(m => {
        if (!m.up && ptr) {
          const d = Math.hypot(m.x - ptr.x, m.y - ptr.y);
          if (d < 34) { m.up = true; caught++; setN(caught); }
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
      c.removeEventListener("pointerleave", onUp);
      c.removeEventListener("touchstart", setPtr);
      c.removeEventListener("touchmove", setPtr);
      c.removeEventListener("touchend", onUp);
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

    <canvas ref={cvs} className="enter d5"
      style={{ width: "100%", height: 230, borderRadius: 14, marginTop: 12, touchAction: "none", boxShadow: "0 10px 26px -14px rgba(70,50,32,.55)" }} />

    <div className="mapmsg">{done ? "天，一點一點亮了起來。" : "已收回 " + n + " 顆"}</div>
    {done && <div className="foot"><button className="btn" onClick={onNext}>看著天亮 →</button></div>}
  </>);
}

/* ================= 逐一放下 ================= */
function Connect({ onNext }) {
  const [off, setOff] = useState([]);
  const done = off.length === CLEARS.length;
  return (<>
    <div className="kicker enter">DEDUCTION · 逐一放下</div>
    <div className="htitle enter d2">把站得住腳的人，放下。</div>
    <div className="narr enter d3">查到這裡，每個人那一夜的去向都對上了。<b>一個一個點開</b>——看著他的光，安靜熄掉。</div>

    <div className="row3 enter d4">
      {CLEARS.map(c => {
        const dim = off.includes(c.who);
        return (
          <div key={c.who} className={"sus " + (dim ? "off" : "lit")}
            onClick={() => !dim && setOff([...off, c.who])}>
            <img src={FACES[c.who]} alt={c.who} />
            <div className="sn">{c.who}</div>
          </div>
        );
      })}
    </div>

    {CLEARS.filter(c => off.includes(c.who)).map(c => (
      <div className="found" key={c.who}><b>{c.who}</b>：{c.concl}</div>
    ))}

    {done && (<>
      <div className="narr enter" style={{ marginTop: 14 }}>其他人的光，都安靜熄了、放下了。<br />夜裡藏光、白天又賣力「找光」的——只剩一個人，還亮著。</div>
      <div className="row3" style={{ width: "34%" }}>
        <div className="sus culprit">
          <img src={imgGardener} alt="綠色園丁" />
          <div className="sn">綠色園丁</div>
        </div>
      </div>
      <div className="foot"><button className="btn" onClick={onNext}>動身前往公園 →</button></div>
    </>)}
  </>);
}

/* ================= 抓語病 ================= */
function Gardener({ onNext }) {
  const [wrong, setWrong] = useState(null);
  const [caught, setCaught] = useState(false);
  return (<>
    <div className="kicker enter">PARK · 綠色園丁</div>
    <div className="htitle enter d2">她說的話裡，哪一句她不該知道？</div>

    <div className="scene enter d3" style={{ marginTop: 10 }}>
      <img src={imgPark} alt="公園" />
    </div>

    <div className="who enter d4">
      <div className="face"><img src={imgGardener} alt="綠色園丁" /></div>
      <div className="saybox">
        <div className="name">綠色園丁</div>
        <div className="say">她滿頭大汗，正忙著把「找到的」光分給大家。</div>
      </div>
    </div>

    <div className="found enter d5">島上的人只知道一件事——<b>光，一夜之間全沒了</b>。沒有人知道是「怎麼」不見的。</div>

    {!caught && GLINES.map((g, i) => (
      <button key={i} className="opt"
        onClick={() => (g.slip ? setCaught(true) : setWrong(i))}>
        「{g.t}」
        {wrong === i && <div style={{ fontSize: 12.5, color: "#a99883", marginTop: 6 }}>{g.no}</div>}
      </button>
    ))}

    {caught && (<>
      <div className="found enter"><b>「裝進罐子」</b>——可大家只知道光不見了，從沒人說過是「怎麼」不見的。這個細節，只有<b>親手收走光的人</b>，才講得出來。</div>
      <div className="foot"><button className="btn" onClick={onNext}>攤牌 →</button></div>
    </>)}
  </>);
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
  find: "cover", guess: "find", case: "guess", spring: "case", countess: "spring",
  map1: "countess", miracle: "map1", connect: "miracle", map2: "connect",
  gardener: "map2", reveal: "gardener", restore: "reveal", ending: "restore",
  cardq: "ending", cardresult: "cardq",
};
const PROG = {
  find: .05, guess: .11, case: .16, spring: .28, countess: .4,
  map1: .47, miracle: .55, connect: .64, map2: .71,
  gardener: .79, reveal: .87, restore: .93, ending: .97, cardq: .99, cardresult: 1,
};

export default function App() {
  const [view, setView] = useState("cover");
  const [hunch, setHunch] = useState(null);
  const [card, setCard] = useState(null);
  const go = v => setView(v);

  const SUS = ["守泉人", "伯爵夫人", "奇蹟先生", "綠色園丁"];

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
            <div className="prog"><i style={{ width: (PROG[view] || 0) * 100 + "%" }} /></div>

            <div className="body" key={view}>

              {view === "find" && <FindWrong onNext={() => go("guess")} />}

              {view === "guess" && (<>
                <div className="kicker enter">HUNCH · 先猜一個</div>
                <div className="htitle enter d2">還沒查——你覺得是誰？</div>
                <div className="narr enter d3">島上常被議論的，就這幾個。憑直覺先押一個；等你查完，再看看準不準。</div>
                {SUS.map(s => (
                  <button key={s} className="opt" onClick={() => { setHunch(s); go("case"); }}>
                    <b>{s}</b>　<span style={{ fontSize: 13, color: "#8c7c6a" }}>{HUNCH[s]}</span>
                  </button>
                ))}
              </>)}

              {view === "case" && (<>
                <div className="kicker enter">CASE · 接案</div>
                <div className="htitle enter d2">光點，被誰拿走了？</div>
                <div className="narr enter d3">我是來自捷克的<b>旅人</b>，在這座島待了三天。島上的人說，「光點」是每天發給大家的一點點小確幸。<b>昨晚，它們一顆不剩地消失了。</b></div>
                <div className="found enter d4">你心裡猜的是 <b>{hunch}</b>。那就跟著線索，一處一處查下去——看是不是這麼回事。</div>
                <div className="foot"><button className="btn" onClick={() => go("spring")}>第一站：先去幸運噴泉 →</button></div>
              </>)}

              {view === "spring" && <TorchScene onNext={() => go("countess")} />}
              {view === "countess" && <CountessDash onNext={() => go("map1")} />}

              {view === "map1" && (
                <IslandMap
                  from="manor" to="cliffhut"
                  kicker="MAP · 前往懸崖"
                  title="那晚還有誰在外頭？"
                  intro="還有一個人那晚沒睡——奇蹟先生。他住在島的另一頭，海邊懸崖上的小屋，很少下山。你得自己走過去。"
                  nextLabel="敲門 →"
                  onNext={() => go("miracle")}
                />
              )}

              {view === "miracle" && (<>
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
                <div className="foot"><button className="btn" onClick={() => go("connect")}>把線索兜起來 →</button></div>
              </>)}

              {view === "connect" && <Connect onNext={() => go("map2")} />}

              {view === "map2" && (
                <IslandMap
                  from="cliffhut" to="park"
                  kicker="MAP · 前往公園"
                  title="你認定是她。"
                  intro="從懸崖往回走，穿過村落，一路上山——公園在島的最高處，風車就在那裡。"
                  nextLabel="當面對質 →"
                  onNext={() => go("gardener")}
                />
              )}

              {view === "gardener" && <Gardener onNext={() => go("reveal")} />}
              {view === "reveal" && <Reveal onNext={() => go("restore")} />}
              {view === "restore" && <Fireflies onNext={() => go("ending")} />}

              {view === "ending" && (<>
                <div className="kicker enter">MORNING · 光回來了</div>
                <div className="htitle enter d2">島上的每件小事，又回到原本的樣子。</div>
                <div className="scene enter d3" style={{ marginTop: 12 }}>
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
                  <button key={i} className="opt" onClick={() => { setCard(c); go("cardresult"); }}>{c.q}</button>
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
                  <button className="btn ghost" onClick={() => { setHunch(null); setCard(null); go("cover"); }}>再玩一次</button>
                </div>
              </>)}

            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
