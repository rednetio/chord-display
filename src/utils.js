export const range = (min, max) => Array(max - min + 1).fill().map((v,n) => n + min);

export const parseRGB = (colorStr) => {
  if (typeof colorStr !== 'string' || !colorStr.match(/^#[0-9a-f]{6}$/i)) return null; 
  const color = colorStr.toLowerCase();
  
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);

  return { r, g, b };
}

export const toRGBA = (colorStr, alpha) => {
  const color = parseRGB(colorStr);
  if (!color) return 'transparent';

  return `rgba(${color.r},${color.g},${color.b},${alpha})`;
}

export const mixRGB = (colorStr, baseColorStr, mix) => {
  const color = parseRGB(colorStr);
  const baseColor = parseRGB(baseColorStr);
  
  if (!color) return baseColorStr;
  if (!baseColor) return `rgba(${color.r},${color.g},${color.b},${mix})`;
  
  return `rgb(${
    Math.floor(color.r * mix + baseColor.r * (1 - mix))
  },${
    Math.floor(color.g * mix + baseColor.g * (1 - mix))
  },${
    Math.floor(color.b * mix + baseColor.b * (1 - mix))
  })`;
}
