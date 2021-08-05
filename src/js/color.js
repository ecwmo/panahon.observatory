const rainGradient = [
  [0, [245, 245, 245]],
  [0.2, [199, 234, 229]],
  [0.4, [128, 205, 193]],
  [0.6, [53, 151, 143]],
  [0.8, [1, 102, 94]],
  [1, [0, 60, 48]],
];

const tempGradient = [
  [0, [247, 247, 247]],
  [0.2, [253, 219, 199]],
  [0.4, [244, 165, 130]],
  [0.6, [214, 96, 77]],
  [0.8, [178, 24, 43]],
  [1, [103, 0, 31]],
];

const getGradient = (varName) => {
  if (varName === "temp") return tempGradient;
  else if (varName === "rain") return rainGradient;
  else return [];
};

const componentToHex = (c) => {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (rgb) => "#" + rgb.map(componentToHex).join("");

const getColor = (val, varName) => {
  const gradient = getGradient(varName);
  let rgb = gradient[gradient.length - 1][1];

  if (val === null) return null;

  gradient.every((g) => {
    if (val <= g[0]) {
      rgb = g[1];
      return false;
    }

    return true;
  });

  return rgbToHex(rgb);
};

const getSwatch = (varName, minVal, maxVal) => {
  const gradient = getGradient(varName);

  return gradient.map((g) => {
    const label = minVal + +((maxVal - minVal) * g[0]).toFixed();
    return {
      color: rgbToHex(g[1]),
      label,
    };
  });
};

export { getColor, getSwatch };
