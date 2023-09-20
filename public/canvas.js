const draw = () => {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);

  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;

  context.translate(camX, camY);

  players.forEach((p) => {
    if (!p.playerData) {
      return;
    }

    context.beginPath();
    context.fillStyle = p.playerData.color;
    context.arc(p.playerData.locX, p.playerData.locY, 10, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'rgb(0, 255, 0)';
    context.stroke();
  });

  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw);
};

canvas.addEventListener('mousemove', (e) => {
  const mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };

  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;

  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
    console.log('Mouse is in lower right');
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
    console.log('Mouse is in lower left');
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
    console.log('Mouse is in top left');
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
    console.log('Mouse is in top right');
  }

  player.xVector = xVector ? xVector : 0.1;
  player.yVector = yVector ? yVector : 0.1;
});
