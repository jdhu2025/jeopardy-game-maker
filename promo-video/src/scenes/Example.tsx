import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { inOut, ramp, scene, type SceneName } from "../lib/anim";
import { C, FONT } from "../lib/theme";

const SCREEN_RATIO = 3024 / 1570;

const SectionTag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.orange }) => (
  <div style={{ color, fontFamily: FONT.body, fontSize: 22, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
    {children}
  </div>
);

const Footer: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: "absolute", left: 86, right: 86, bottom: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ color: C.dim, fontFamily: FONT.body, fontSize: 19 }}>QUIZBOARD MAKER</div>
    <div style={{ display: "flex", gap: 10 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ width: i === active ? 42 : 12, height: 8, borderRadius: 8, background: i === active ? C.orange : C.line, opacity: i === active ? 1 : 0.9 }} />
      ))}
    </div>
  </div>
);

const LogoMark: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <Img src={staticFile("img/logo.png")} style={{ width: size, height: size, objectFit: "contain" }} />
);

const Intro: React.FC<{ t: number }> = ({ t }) => {
  const s = scene("hook");
  const p = inOut(t, s.start, s.start + 0.7, s.end - 0.5, s.end);
  const lift = ramp(t, [s.start, s.start + 0.8], [38, 0]);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div style={{ position: "absolute", top: 74, left: 86, display: "flex", alignItems: "center", gap: 18 }}>
        <LogoMark size={62} />
        <div style={{ color: C.fg, fontFamily: FONT.body, fontSize: 26, fontWeight: 800 }}>Quizboard Maker</div>
      </div>
      <div style={{ position: "absolute", left: 86, top: 240, transform: `translateY(${lift}px)` }}>
        <SectionTag>Classroom review · team learning</SectionTag>
        <div style={{ marginTop: 26, color: C.fg, fontFamily: FONT.display, fontSize: 88, fontWeight: 800, lineHeight: 1.01, maxWidth: 1060 }}>
          Still building
          <br />
          quiz slides by hand?
        </div>
        <div style={{ marginTop: 28, color: C.dim, fontFamily: FONT.body, fontSize: 30 }}>Turn a topic into a board you can review, edit, and host.</div>
      </div>
      <div style={{ position: "absolute", right: 118, top: 240, width: 360, height: 360, borderRadius: 22, background: C.fg, transform: `rotate(${ramp(t, [s.start, s.end], [-4, 4])}deg)` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: 18, height: "100%", boxSizing: "border-box" }}>
          {["100", "200", "300", "400", "500", "EDIT", "HOST", "REVIEW", "PLAY"].map((label, i) => (
            <div key={label} style={{ borderRadius: 8, background: i === 8 ? C.orange : i === 5 ? C.accent : C.blue, color: i === 5 ? C.fg : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.body, fontSize: i > 4 ? 14 : 28, fontWeight: 800 }}>{label}</div>
          ))}
        </div>
      </div>
      <Footer active={0} />
    </AbsoluteFill>
  );
};

const ProductScene: React.FC<{ t: number; name: Exclude<SceneName, "hook" | "cta">; active: number; tag: string; title: string; body: string; image: string; url: string; color?: string }> = ({ t, name, active, tag, title, body, image, url, color = C.accent }) => {
  const s = scene(name);
  const p = inOut(t, s.start, s.start + 0.65, s.end - 0.45, s.end);
  const x = ramp(t, [s.start, s.start + 0.8], [58, 0]);
  const zoom = 1 + ramp(t, [s.start, s.end], [0, 0.035]);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div style={{ position: "absolute", left: 86, top: 148, width: 505, transform: `translateX(${x}px)` }}>
        <SectionTag>{tag}</SectionTag>
        <div style={{ marginTop: 24, color: C.fg, fontFamily: FONT.display, fontSize: 62, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 24, color: C.dim, fontFamily: FONT.body, fontSize: 27, lineHeight: 1.35 }}>{body}</div>
        <div style={{ marginTop: 30, display: "inline-flex", padding: "12px 18px", borderRadius: 10, background: color, color: C.fg, fontFamily: FONT.body, fontSize: 20, fontWeight: 800 }}>Review first. Host when ready.</div>
      </div>
      <BrowserFrame src={`screens/${image}.png`} ratio={SCREEN_RATIO} url={url} width={1080} height={650} zoom={zoom} style={{ position: "absolute", left: 720, top: 170 }} />
      <Footer active={active} />
    </AbsoluteFill>
  );
};

const OfflineScene: React.FC<{ t: number }> = ({ t }) => {
  const s = scene("offline");
  const p = inOut(t, s.start, s.start + 0.6, s.end - 0.4, s.end);
  const y = ramp(t, [s.start, s.start + 0.65], [45, 0]);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div style={{ position: "absolute", left: 86, top: 158, transform: `translateY(${y}px)` }}>
        <SectionTag>When the internet is uncertain</SectionTag>
        <div style={{ marginTop: 24, color: C.fg, fontFamily: FONT.display, fontSize: 74, fontWeight: 800, lineHeight: 1.04 }}>Download the board.</div>
        <div style={{ marginTop: 8, color: C.fg, fontFamily: FONT.display, fontSize: 74, fontWeight: 800, lineHeight: 1.04 }}>Keep hosting.</div>
        <div style={{ marginTop: 28, color: C.dim, fontFamily: FONT.body, fontSize: 29, maxWidth: 640, lineHeight: 1.35 }}>A reviewed board can become a self-contained HTML game for offline use.</div>
      </div>
      <div style={{ position: "absolute", right: 100, top: 128, width: 760, height: 590, borderRadius: 24, padding: 18, background: C.fg, transform: `rotate(${ramp(t, [s.start, s.end], [2, -2])}deg)`, boxShadow: "0 24px 70px rgba(16,42,67,0.22)" }}>
        <div style={{ height: "100%", borderRadius: 14, background: "#E9F5E7", padding: 44, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}><LogoMark size={58} /><div style={{ color: C.fg, fontFamily: FONT.body, fontSize: 28, fontWeight: 800 }}>Offline game</div></div>
          <div style={{ marginTop: 70, color: C.fg, fontFamily: FONT.display, fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>Your board,<br />ready to play.</div>
          <div style={{ marginTop: 42, height: 56, borderRadius: 10, background: C.orange, color: "#FFFFFF", fontFamily: FONT.body, fontSize: 21, fontWeight: 800, display: "flex", justifyContent: "center", alignItems: "center" }}>Download offline game</div>
        </div>
      </div>
      <Footer active={4} />
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{ t: number }> = ({ t }) => {
  const s = scene("cta");
  const p = inOut(t, s.start, s.start + 0.7, s.end - 0.45, s.end);
  const scale = 0.94 + ramp(t, [s.start, s.start + 0.8], [0, 0.06]);
  return (
    <AbsoluteFill style={{ opacity: p, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${scale})`, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <LogoMark size={92} />
        <div style={{ marginTop: 22, color: C.fg, fontFamily: FONT.display, fontSize: 86, fontWeight: 800 }}>Quizboard Maker</div>
        <div style={{ marginTop: 18, color: C.dim, fontFamily: FONT.body, fontSize: 31 }}>Build the board. Review the questions. Make it yours.</div>
        <div style={{ marginTop: 34, padding: "15px 26px", borderRadius: 10, background: C.orange, color: "#FFFFFF", fontFamily: FONT.body, fontSize: 30, fontWeight: 800 }}>www.quizboardly.xyz</div>
      </div>
      <Footer active={5} />
    </AbsoluteFill>
  );
};

export const Example: React.FC<{ t: number }> = ({ t }) => (
  <>
    <AbsoluteFill style={{ background: C.bg }} />
    <Intro t={t} />
    <ProductScene t={t} name="input" active={1} tag="01 · Start with a topic" title="From a topic to a playable board." body="Begin with a lesson, training goal, or event idea. No account is required to start building." image="landing" url="quizboardly.xyz/jeopardy-game-maker" />
    <ProductScene t={t} name="review" active={2} tag="02 · Review every question" title="Keep control of the content." body="Edit prompts, answers, explanations, and point values before anyone sees the board." image="review" url="quizboardly.xyz/jeopardy-game-maker/review" color="#D5EEA5" />
    <ProductScene t={t} name="host" active={3} tag="03 · Host on one screen" title="Make the room interactive." body="Reveal questions, reveal answers, and manage team totals from a shared screen." image="host" url="quizboardly.xyz/jeopardy-game-maker/host" color="#B9DCEB" />
    <OfflineScene t={t} />
    <CtaScene t={t} />
  </>
);
