/* 2021 Niels Sonnich Poulsen
 * https://nielssp.dk/2021/06/animated-chevrons
 * Any copyright is dedicated to the Public Domain.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */


var indicators = [];


// Start point
let x0 = 375;
let y0 = 120;
// End point
let x1 = 200;
let y1 = 120;

// The width of the line in pixels
let lineWidth = 5;

// Angle between our line and the x-axis in radians
let angle = Math.atan2(y1 - y0, x1 - x0);
// Length of our line (Euclidean distance)
let length = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));

// Distance between individual chevrons
let chevronSpace = 12;
// Angle between our main line and the leg of a chevron
let chevronAngle = 0.7 * Math.PI;
// Length of a chevron leg
let chevronLength = 20;

// Offset of the first point of a chevron relative to its center point
// calculated by subtracting the chevron angle from the line angle
let startX = Math.cos(angle - chevronAngle) * chevronLength;
let startY = Math.sin(angle - chevronAngle) * chevronLength;

// Offset of the third point of a chevron relative to its center point
// calculated by adding the chevron angle to the line angle
let endX = Math.cos(angle + chevronAngle) * chevronLength;
let endY = Math.sin(angle + chevronAngle) * chevronLength;

// Number of pixels to move the chevrons each second
let pixelsPerSecond = 20;

// Number of pixels it takes for a chevron to fade in at the start of the line
// and fade out at the end
let fadeLength = 20;

// The fourth and last example creates a smoother animation by fading the
// chevrons in and out at the start and end of the line.
function example4() {
  const canvas = document.getElementById('canvas4');
  const ctx = canvas.getContext('2d');

  let prevTimestamp;
  let offset = 0;

  function render(timestamp) {
    const delta = prevTimestamp ? timestamp - prevTimestamp : 0;
    prevTimestamp = timestamp;

    const n = Math.floor(length / chevronSpace);

    const offsetX = offset * Math.cos(angle);
    const offsetY = offset * Math.sin(angle);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = lineWidth;

    for (let i = 0; i < n; i++) {
      const x = x0 + (x1 - x0) * i / n + offsetX;
      const y = y0 + (y1 - y0) * i / n + offsetY;
      // The opacity depends on how close we are to the start (0) or end
      // (n * chevronSpace) of the line
      const dist = Math.min(i * chevronSpace + offset,
        n * chevronSpace - (i * chevronSpace + offset));
      const opacity = Math.min(1, dist / fadeLength);
      ctx.strokeStyle = 'rgba(0, 200, 0, ' + opacity + ')';
      ctx.beginPath();
      ctx.moveTo(x + startX, y + startY);
      ctx.lineTo(x, y);
      ctx.lineTo(x + endX, y + endY);
      ctx.stroke();
    }

    offset += pixelsPerSecond * delta / 1000;

    if (offset >= chevronSpace) {
      offset %= chevronSpace;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

example4();