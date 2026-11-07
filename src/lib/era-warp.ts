/**
 * The look of each chapter's "fly into the era" opening. Times match each
 * chapter's own "When" line. The flight itself is an artist's impression, and
 * it says so on screen.
 */
export type EraShape = "spark" | "rock" | "bubble" | "shard" | "leaf" | "ember" | "sand" | "star" | "block" | "beam";

export type Era = {
  when: string; // short time label, from the chapter's own "When" line
  name: string; // the big words: "Fly into" + name
  colors: [string, string, string]; // main, second, highlight
  sky: string; // background
  shape: EraShape;
};

export const eras: Record<string, Era> = {
  "before-everything": { when: "13.8 billion years ago", name: "the Big Bang", colors: ["#c49bff", "#6aa8ff", "#ffffff"], sky: "#07051a", shape: "spark" },
  "planet-earth": { when: "4.6 billion years ago", name: "a baby planet", colors: ["#ff7a45", "#ffb347", "#ffe08a"], sky: "#140604", shape: "rock" },
  "first-life": { when: "3.5 billion years ago", name: "the first life", colors: ["#2ff0d0", "#3ea8ff", "#c8fff4"], sky: "#011214", shape: "bubble" },
  diversification: { when: "540 million years ago", name: "a sea of new animals", colors: ["#7dff5a", "#2ff0d0", "#eaffd0"], sky: "#03120a", shape: "shard" },
  "age-of-giants": { when: "252 to 66 million years ago", name: "the age of dinosaurs", colors: ["#7dff5a", "#ffd23f", "#fff3b0"], sky: "#071206", shape: "leaf" },
  "human-story": { when: "7 million years ago", name: "the first humans", colors: ["#ff8f5a", "#ffd23f", "#fff0d0"], sky: "#120804", shape: "ember" },
  civilisation: { when: "12,000 years ago", name: "the first cities", colors: ["#ffb347", "#ffd23f", "#fff6dc"], sky: "#120c04", shape: "sand" },
  "age-of-ideas": { when: "3,000 to 500 years ago", name: "the age of big ideas", colors: ["#6aa8ff", "#c49bff", "#e6f0ff"], sky: "#040818", shape: "star" },
  "world-we-built": { when: "The last 500 years", name: "the world we built", colors: ["#3ee0ff", "#ff8ad8", "#e0fbff"], sky: "#020b12", shape: "block" },
  you: { when: "Right now", name: "you", colors: ["#ff8ad8", "#6aa8ff", "#fff0fa"], sky: "#0e0414", shape: "beam" },
};
