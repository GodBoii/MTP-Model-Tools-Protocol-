export const eases = {
  out: "power4.out",
  inOut: "power4.inOut",
  expo: "expo.out"
};

export function splitWords(text: string) {
  return text.split(" ");
}

export function projectGradient(colors: [string, string, string]) {
  return {
    background:
      `radial-gradient(circle at 72% 24%, ${colors[1]} 0 7%, transparent 7.4%), ` +
      `linear-gradient(135deg, ${colors[0]} 0 36%, ${colors[2]} 36% 64%, ${colors[0]} 64% 100%)`
  };
}
