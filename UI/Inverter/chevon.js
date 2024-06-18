/* 2021 Niels Sonnich Poulsen
 * https://nielssp.dk/2021/06/animated-chevrons
 * Any copyright is dedicated to the Public Domain.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

// Start point
let x0 = 50;
let y0 = 50;
// End point
let x1 = 250;
let y1 = 50;

// The width of the line in pixels
let lineWidth = 2;

// The first example just draws a boring old line on the canvas using the above
// parameters
function example1() {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // The color of the line
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

example1();

// Angle between our line and the x-axis in radians
let angle = Math.atan2(y1 - y0, x1 - x0);
// Length of our line (Euclidean distance)
let length = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));

// Distance between individual chevrons
let chevronSpace = 7;
// Angle between our main line and the leg of a chevron
let chevronAngle = 0.7 * Math.PI;
// Length of a chevron leg
let chevronLength = 10;

// Offset of the first point of a chevron relative to its center point
// calculated by subtracting the chevron angle from the line angle
let startX = Math.cos(angle - chevronAngle) * chevronLength;
let startY = Math.sin(angle - chevronAngle) * chevronLength;

// Offset of the third point of a chevron relative to its center point
// calculated by adding the chevron angle to the line angle
let endX = Math.cos(angle + chevronAngle) * chevronLength;
let endY = Math.sin(angle + chevronAngle) * chevronLength;

// The second example draws chevrons instead of line using the above parameters
function example2() {
  const canvas = document.getElementById('canvas2');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = lineWidth;

  // Number of chevrons to draw based on length of line
  const n = Math.floor(length / chevronSpace);
  for (let i = 0; i < n; i++) {
    // The position of the center point of the i'th chevron
    const x = x0 + (x1 - x0) * i / n;
    const y = y0 + (y1 - y0) * i / n;
    ctx.beginPath();
    ctx.moveTo(x + startX, y + startY); // First point
    ctx.lineTo(x, y);                   // Second point
    ctx.lineTo(x + endX, y + endY);     // Third point
    ctx.stroke();
  }
}

example2();

// Number of pixels to move the chevrons each second
let pixelsPerSecond = 20;

// The third example animates the chevrons by moving them along the line
function example3() {
  const canvas = document.getElementById('canvas3');
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#000000';

  // Previous timestamp for calculating delta
  let prevTimestamp;
  // Animation offset of chevrons in pixels
  let offset = 0;

  function render(timestamp) {
    // Calculate elapsed time (delta) since previous frame
    const delta = prevTimestamp ? timestamp - prevTimestamp : 0;
    prevTimestamp = timestamp;

    const n = Math.floor(length / chevronSpace);

    // Calculate coordinate offset using the line angle
    const offsetX = offset * Math.cos(angle);
    const offsetY = offset * Math.sin(angle);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = lineWidth;

    for (let i = 0; i < n; i++) {
      // Apply previously calculated offset to chevron
      const x = x0 + (x1 - x0) * i / n + offsetX;
      const y = y0 + (y1 - y0) * i / n + offsetY;
      ctx.beginPath();
      ctx.moveTo(x + startX, y + startY);
      ctx.lineTo(x, y);
      ctx.lineTo(x + endX, y + endY);
      ctx.stroke();
    }

    // Add offset based on elapsed time
    offset += pixelsPerSecond * delta / 1000;
    // Roll over to the start
    if (offset >= chevronSpace) {
      offset %= chevronSpace;
    }

    // Render the next frame when the browser is ready for it
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

example3();

// Number of pixels it takes for a chevron to fade in at the start of the line
// and fade out at the end
let fadeLength = 30;

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
      ctx.strokeStyle = 'rgba(0, 0, 0, ' + opacity + ')';
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

// This function updates the various parameters using the values entered in the
// text fields on the page.
function updateChevrons(e) {
  e.preventDefault();

  x0 = parseInt(document.forms.chevron.x0.value);
  y0 = parseInt(document.forms.chevron.y0.value);
  x1 = parseInt(document.forms.chevron.x1.value);
  y1 = parseInt(document.forms.chevron.y1.value);
  lineWidth = parseInt(document.forms.chevron.lineWidth.value);

  angle = Math.atan2(y1 - y0, x1 - x0);
  length = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));

  chevronSpace = parseInt(document.forms.chevron.chevronSpace.value);
  // The angle is entered in degrees and converted to radians
  chevronAngle = parseInt(document.forms.chevron.chevronAngle.value)
    * (Math.PI / 180);
  chevronLength = parseInt(document.forms.chevron.chevronLength.value);

  startX = Math.cos(angle - chevronAngle) * chevronLength;
  startY = Math.sin(angle - chevronAngle) * chevronLength;
  endX = Math.cos(angle + chevronAngle) * chevronLength;
  endY = Math.sin(angle + chevronAngle) * chevronLength;

  pixelsPerSecond = parseInt(document.forms.chevron.pixelsPerSecond.value);

  fadeLength = parseInt(document.forms.chevron.fadeLength.value);

  example1();
  example2();
}

// The demo in the introduction has three distinct lines with different
// parameters
function introDemo() {
  const canvas = document.getElementById('canvas0');
  const ctx = canvas.getContext('2d');

  let run = false;

  const lines = [
    {
      x0: 50,
      y0: 50,
      x1: 250,
      y1: 150,
      lineWidth: 3,
      chevronSpace: 7,
      chevronAngle: 0.7 * Math.PI,
      chevronLength: 10,
      pixelsPerSecond: 20,
      fadeLength: 30,
      offset: 0,
      color: '255, 0, 0',
    },
    {
      x0: 450,
      y0: 50,
      x1: 200,
      y1: 200,
      lineWidth: 4,
      chevronSpace: 10,
      chevronAngle: 0.65 * Math.PI,
      chevronLength: 10,
      pixelsPerSecond: 10,
      fadeLength: 30,
      offset: 0,
      color: '0, 255, 0',
    },
    {
      x0: 100,
      y0: 250,
      x1: 450,
      y1: 200,
      lineWidth: 2,
      chevronSpace: 6,
      chevronAngle: 0.8 * Math.PI,
      chevronLength: 5,
      pixelsPerSecond: 30,
      fadeLength: 30,
      offset: 0,
      color: '0, 0, 255',
    },
  ];

  for (let l of lines) {
      l.angle = Math.atan2(l.y1 - l.y0, l.x1 - l.x0);
      l.length = Math.sqrt((l.x0 - l.x1) * (l.x0 - l.x1) + (l.y0 - l.y1)
          * (l.y0 - l.y1));
      l.startX = Math.cos(l.angle - l.chevronAngle) * l.chevronLength;
      l.startY = Math.sin(l.angle - l.chevronAngle) * l.chevronLength;
      l.endX = Math.cos(l.angle + l.chevronAngle) * l.chevronLength;
      l.endY = Math.sin(l.angle + l.chevronAngle) * l.chevronLength;
  }

  let prevTimestamp;

  function render(timestamp) {
    const delta = prevTimestamp ? timestamp - prevTimestamp : 0;
    prevTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let l of lines) {
      const n = Math.floor(l.length / l.chevronSpace);

      const offsetX = l.offset * Math.cos(l.angle);
      const offsetY = l.offset * Math.sin(l.angle);

      ctx.lineWidth = l.lineWidth;

      for (let i = 0; i < n; i++) {
        const x = l.x0 + (l.x1 - l.x0) * i / n + offsetX;
        const y = l.y0 + (l.y1 - l.y0) * i / n + offsetY;
        const dist = Math.min(i * l.chevronSpace + l.offset,
          n * l.chevronSpace - (i * l.chevronSpace + l.offset));
        const opacity = Math.min(1, dist / l.fadeLength);
        ctx.strokeStyle = 'rgba(' + l.color + ', ' + opacity + ')';
        ctx.beginPath();
        ctx.moveTo(x + l.startX, y + l.startY);
        ctx.lineTo(x, y);
        ctx.lineTo(x + l.endX, y + l.endY);
        ctx.stroke();
      }

      l.offset += l.pixelsPerSecond * delta / 1000;
      if (l.offset >= l.chevronSpace) {
        l.offset %= l.chevronSpace;
      }
    }

    if (run) {
      requestAnimationFrame(render);
    }
  }

  canvas.onclick = function () {
    if (run) {
      run = false;
    } else {
      run = true;
      prevTimestamp = undefined;
      requestAnimationFrame(render);
    }
  };

  requestAnimationFrame(render);
}

introDemo();