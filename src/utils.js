export const range = (min, max) => Array(max - min + 1).fill().map((v,n) => n + min);

export const toRGBA = (colorStr, alpha) => {
  if (typeof colorStr !== 'string' || !colorStr.match(/^#[0-9a-f]{6}$/i)) return 'transparent'; 
  const color = colorStr.toLowerCase();
  
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}