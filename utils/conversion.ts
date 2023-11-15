export function getSimpleDateObjectFromIsoString(date: string) {
  const [yearString, monthString, dayString] = date.split("T")[0].split("-");

  return {
    year: +yearString,
    month: +monthString,
    day: +dayString,
  };
}

export function getNumberOfDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getColorFromGradient(
  percent: number,
  color1: string,
  color2: string
) {
  const rgbColor1 = hexToRgb(color1);
  const rgbColor2 = hexToRgb(color2);

  if (!rgbColor1 || !rgbColor2) {
    return rgbColor1 || rgbColor2;
  }

  var w1 = (100 - percent) / 100;
  var w2 = 1 - w1;

  var rgb = {
    r: Math.round(rgbColor1.r * w1 + rgbColor2.r * w2),
    g: Math.round(rgbColor1.g * w1 + rgbColor2.g * w2),
    b: Math.round(rgbColor1.b * w1 + rgbColor2.b * w2),
  };

  return rgb;
}
