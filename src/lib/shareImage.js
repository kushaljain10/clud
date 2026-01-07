function wrapText(ctx, text, maxWidth) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    const wdt = ctx.measureText(test).width;
    if (wdt > maxWidth && line) {
      lines.push(line);
      line = w;
    } else if (wdt > maxWidth) {
      // single long word, hard break
      lines.push(test);
      line = "";
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateShareImage(thread, options = {}) {
  const width = options.width || 900;
  const padding = 24;
  const bubbleMax = Math.min(options.bubbleWidth || 640, width - padding * 2);
  const gap = 14;
  const lineHeight = 26;
  const headerHeight = 72;
  const footerHeight = 44;
  const bubblePadTop = 30;
  const bubblePadBottom = 0;
  const avatarSize = 36;
  const avatarRadius = avatarSize / 2;
  const avatarGap = 10;
  const scale = options.scale ?? 2;

  const layoutCanvas = document.createElement("canvas");
  const lctx = layoutCanvas.getContext("2d");
  lctx.font =
    "18px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";

  // compute height
  let total = padding + headerHeight + gap;
  const all = (thread?.messages || []).map((m) => ({
    role: m.role,
    text: String(m.text || ""),
  }));
  const messages = all.slice(Math.max(0, all.length - 10));
  for (const m of messages) {
    const lines = wrapText(lctx, m.text, bubbleMax - 24);
    const bubbleH = lines.length * lineHeight + bubblePadTop + bubblePadBottom;
    total += bubbleH + gap;
  }
  total += padding + footerHeight;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const canvasCssHeight = Math.max(300, total);
  canvas.width = width * scale;
  canvas.height = canvasCssHeight * scale;
  ctx.scale(scale, scale);

  // background
  ctx.fillStyle = "#0b0e11";
  ctx.fillRect(0, 0, width, canvasCssHeight);

  // header with centered logo
  try {
    const img = new Image();
    img.src = "/logo.png";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const logoH = 40;
    const logoW = Math.max(1, logoH * (img.width / img.height || 1));
    const lx = (width - logoW) / 2;
    const ly = padding + (headerHeight - logoH) / 2;
    ctx.drawImage(img, lx, ly, logoW, logoH);
  } catch (e) {
    // fallback to centered text if logo fails
    ctx.fillStyle = "#ffffff";
    ctx.font =
      "bold 18px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("clod", width / 2, padding + headerHeight / 2 + 6);
    ctx.textAlign = "left";
  }

  // preload assistant avatar (favicon)
  let assistantAvatar = null;
  try {
    const fav = new Image();
    fav.src = "/favicon.png";
    await new Promise((resolve, reject) => {
      fav.onload = resolve;
      fav.onerror = reject;
    });
    assistantAvatar = fav;
  } catch (e) {
    assistantAvatar = null;
  }

  // messages
  let y = padding + headerHeight;
  for (const m of messages) {
    const lines = wrapText(lctx, m.text, bubbleMax - 24);
    const bubbleH = lines.length * lineHeight + bubblePadTop + bubblePadBottom;
    const user = m.role === "user";
    const x = user
      ? width - padding - avatarSize - avatarGap - bubbleMax
      : padding + avatarSize + avatarGap;

    // bubble
    ctx.fillStyle = user ? "#182032" : "#12161d";
    // rounded rect
    const r = 14;
    const w = bubbleMax;
    const h = bubbleH;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    // text
    ctx.fillStyle = "#eaeef5";
    ctx.font =
      "18px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";
    let ty = y + bubblePadTop;
    for (const ln of lines) {
      ctx.fillText(ln, x + 12, ty);
      ty += lineHeight;
    }

    // avatars (circular)
    const ay = y + avatarRadius;
    if (user) {
      // placeholder user avatar on right
      const cx = width - padding - avatarRadius;
      ctx.beginPath();
      ctx.arc(cx, ay, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "#263147";
      ctx.fill();
      // optional initial
      ctx.fillStyle = "#eaeef5";
      ctx.font =
        "bold 14px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("U", cx, ay + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    } else {
      // assistant avatar (favicon.png) on left
      const cx = padding + avatarRadius;
      if (assistantAvatar) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, ay, avatarRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          assistantAvatar,
          cx - avatarRadius,
          ay - avatarRadius,
          avatarSize,
          avatarSize
        );
        ctx.restore();
      } else {
        // fallback circle
        ctx.beginPath();
        ctx.arc(cx, ay, avatarRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "#1f2430";
        ctx.fill();
        ctx.fillStyle = "#eaeef5";
        ctx.font =
          "bold 12px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("C", cx, ay + 1);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
      }
    }

    y += bubbleH + gap;
  }

  // footer bar with tagline
  const fy = canvasCssHeight - footerHeight;
  ctx.fillStyle = "#1a202b";
  ctx.fillRect(0, fy, width, footerHeight);
  ctx.fillStyle = "#eaeef5";
  ctx.font =
    "14px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";
  const prevAlign = ctx.textAlign;
  const prevBaseline = ctx.textBaseline;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "chat with clod at clodai.xyz",
    width / 2,
    fy + footerHeight / 2
  );
  ctx.textAlign = prevAlign;
  ctx.textBaseline = prevBaseline;

  return canvas.toDataURL("image/png");
}
