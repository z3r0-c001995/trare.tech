(function () {
  function initThreatMap() {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const canvas = document.getElementById('threat-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    const nodes = [
      { x: 185, y: 100, label: 'CORE', type: 'core' },
      { x: 58, y: 38, label: 'FW', type: 'fw' },
      { x: 312, y: 38, label: 'DMZ', type: 'dmz' },
      { x: 58, y: 162, label: 'LAN', type: 'lan' },
      { x: 312, y: 162, label: 'WEB', type: 'web' },
      { x: 185, y: 22, label: 'IDS', type: 'ids' },
      { x: 108, y: 100, label: 'VPN', type: 'vpn' },
      { x: 262, y: 100, label: 'DB', type: 'db' },
      { x: 22, y: 100, label: 'EXT', type: 'threat' },
      { x: 348, y: 100, label: 'EXT', type: 'threat' },
      { x: 185, y: 178, label: 'EDR', type: 'ids' },
    ];

    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [0, 10],
      [1, 8],
      [2, 9],
      [6, 1],
      [7, 2],
    ];

    const packets = [];
    const TYPE_COLORS = {
      core: '#00ff88',
      fw: '#00d4ff',
      dmz: '#00cc6a',
      lan: '#00cc6a',
      web: '#00cc6a',
      ids: '#00d4ff',
      vpn: '#00ff88',
      db: '#00ff88',
      threat: '#ff2d55',
    };

    function getNodeColor(type) {
      return TYPE_COLORS[type] || '#00ff88';
    }

    function drawNodeIcon(type, x, y, radius, color) {
      const s = Math.max(3, radius * 0.65);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (type === 'core') {
        ctx.beginPath();
        ctx.arc(x, y, s * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - s, y);
        ctx.lineTo(x + s, y);
        ctx.moveTo(x, y - s);
        ctx.lineTo(x, y + s);
        ctx.stroke();
      } else if (type === 'fw') {
        ctx.beginPath();
        ctx.moveTo(x, y - s * 1.05);
        ctx.lineTo(x + s * 0.78, y - s * 0.3);
        ctx.lineTo(x + s * 0.56, y + s * 0.74);
        ctx.lineTo(x, y + s * 1.05);
        ctx.lineTo(x - s * 0.56, y + s * 0.74);
        ctx.lineTo(x - s * 0.78, y - s * 0.3);
        ctx.closePath();
        ctx.stroke();
      } else if (type === 'ids') {
        ctx.beginPath();
        ctx.arc(x, y, s * 0.95, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, s * 0.55, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + s * 0.62, y - s * 0.22);
        ctx.stroke();
      } else if (type === 'dmz') {
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x, y + s);
        ctx.lineTo(x - s, y);
        ctx.closePath();
        ctx.stroke();
      } else if (type === 'vpn') {
        ctx.beginPath();
        ctx.arc(x, y - s * 0.18, s * 0.45, Math.PI, 0);
        ctx.stroke();
        ctx.strokeRect(x - s * 0.65, y - s * 0.18, s * 1.3, s * 0.95);
      } else if (type === 'db') {
        ctx.beginPath();
        ctx.ellipse(x, y - s * 0.45, s * 0.75, s * 0.34, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - s * 0.75, y - s * 0.45);
        ctx.lineTo(x - s * 0.75, y + s * 0.55);
        ctx.moveTo(x + s * 0.75, y - s * 0.45);
        ctx.lineTo(x + s * 0.75, y + s * 0.55);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x, y + s * 0.55, s * 0.75, s * 0.34, 0, 0, Math.PI);
        ctx.stroke();
      } else if (type === 'web') {
        ctx.beginPath();
        ctx.arc(x, y, s * 0.95, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - s * 0.95, y);
        ctx.lineTo(x + s * 0.95, y);
        ctx.moveTo(x, y - s * 0.95);
        ctx.lineTo(x, y + s * 0.95);
        ctx.stroke();
      } else if (type === 'lan') {
        ctx.strokeRect(x - s * 0.82, y - s * 0.58, s * 1.64, s * 1.16);
        ctx.beginPath();
        ctx.moveTo(x - s * 0.5, y + s * 0.75);
        ctx.lineTo(x + s * 0.5, y + s * 0.75);
        ctx.stroke();
      } else if (type === 'threat') {
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s * 0.92, y + s * 0.85);
        ctx.lineTo(x - s * 0.92, y + s * 0.85);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y - s * 0.42);
        ctx.lineTo(x, y + s * 0.28);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y + s * 0.5, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function spawn() {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const isThreat = Math.random() < 0.2;
      packets.push({
        from: edge[0],
        to: edge[1],
        t: 0,
        speed: 0.009 + Math.random() * 0.012,
        color: isThreat ? '#ff2d55' : Math.random() < 0.5 ? '#00ff88' : '#00d4ff',
        blocked: isThreat && Math.random() < 0.65,
      });
    }

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'rgba(2,10,16,.6)');
      bgGradient.addColorStop(1, 'rgba(3,12,19,.25)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = 'rgba(0,212,255,.09)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(0,212,255,.2)';
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      edges.forEach(([a, b]) => {
        const na = nodes[a];
        const nb = nodes[b];
        ctx.save();
        ctx.strokeStyle = 'rgba(0,255,136,.16)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 7]);
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
        ctx.restore();
      });

      for (let i = packets.length - 1; i >= 0; i -= 1) {
        const packet = packets[i];
        packet.t += packet.speed;

        if (packet.t >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const fromNode = nodes[packet.from];
        const toNode = nodes[packet.to];
        const stop = packet.blocked ? 0.55 : 1;
        const t = Math.min(packet.t, stop);
        const x = fromNode.x + (toNode.x - fromNode.x) * t;
        const y = fromNode.y + (toNode.y - fromNode.y) * t;

        if (packet.blocked && packet.t >= 0.55) {
          ctx.save();
          ctx.strokeStyle = '#ff2d55';
          ctx.lineWidth = 1.5;
          const size = 4;
          ctx.beginPath();
          ctx.moveTo(x - size, y - size);
          ctx.lineTo(x + size, y + size);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + size, y - size);
          ctx.lineTo(x - size, y + size);
          ctx.stroke();
          ctx.restore();
          continue;
        }

        ctx.save();
        ctx.globalAlpha = 1 - packet.t * 0.3;
        ctx.fillStyle = packet.color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        const trailT = Math.max(0, t - 0.1);
        const tx = fromNode.x + (toNode.x - fromNode.x) * trailT;
        const ty = fromNode.y + (toNode.y - fromNode.y) * trailT;
        const gradient = ctx.createLinearGradient(tx, ty, x, y);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, packet.color + '99');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
      }

      nodes.forEach((node) => {
        const isCore = node.type === 'core';
        const isThreat = node.type === 'threat';
        const color = getNodeColor(node.type);
        const radius = isCore ? 10 : 6;

        if (isCore) {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.18 + 0.12 * Math.sin(frame * 0.04);
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 10 + 4 * Math.sin(frame * 0.04), 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2.5);
        glow.addColorStop(0, color + '44');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isThreat ? 'rgba(255,45,85,.12)' : color + '22';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        drawNodeIcon(node.type, node.x, node.y, radius, color);

        ctx.fillStyle = isThreat ? '#ff5a7a' : '#c8dde6';
        ctx.font = `${isCore ? '700' : '400'} 6.8px Share Tech Mono`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(3,10,15,.85)';
        ctx.shadowBlur = 4;
        ctx.fillText(node.label, node.x, node.y + radius + 9);
        ctx.shadowBlur = 0;
        ctx.restore();
      });

      frame += 1;
      window.requestAnimationFrame(draw);
    }

    window.setInterval(spawn, 500);
    draw();
  }

  function initLiveMetrics() {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let threats = 247;

    window.setInterval(() => {
      if (Math.random() < 0.3) {
        threats += 1;

        const totalThreats = document.getElementById('m1');
        if (totalThreats) {
          totalThreats.textContent = String(threats);
          totalThreats.style.color = '#fff';
          window.setTimeout(() => {
            totalThreats.style.color = 'var(--green)';
          }, 300);
        }

        const badgeThreats = document.getElementById('threat-count');
        if (badgeThreats) {
          badgeThreats.textContent = String(threats);
        }
      }

      const activeIncidents = document.getElementById('m3');
      if (activeIncidents) {
        activeIncidents.textContent = String(Math.floor(Math.random() * 5 + 1));
      }
    }, 2800);
  }

  function initAlertTicker() {
    const stream = document.getElementById('ticker-stream');
    if (!stream) {
      return;
    }

    const alerts = [
      { time: '14:32:01', msg: 'Port scan blocked · 41.x.x.x', col: '#ff2d55' },
      { time: '14:31:48', msg: 'SSL handshake OK · client_42', col: '#00ff88' },
      { time: '14:31:22', msg: 'Brute force attempt · LAN', col: '#ff9500' },
      { time: '14:30:59', msg: 'VPN tunnel established', col: '#00d4ff' },
      { time: '14:30:31', msg: 'Malware signature detected', col: '#ff2d55' },
      { time: '14:29:44', msg: 'Patch applied · CVE-2024-xx', col: '#00ff88' },
      { time: '14:28:17', msg: 'SQL injection blocked', col: '#ff2d55' },
      { time: '14:27:50', msg: 'Backup completed · 4.2GB', col: '#00ff88' },
      { time: '14:27:03', msg: 'Anomaly detected · DB svr', col: '#ff9500' },
      { time: '14:26:41', msg: 'Firewall rule updated', col: '#00d4ff' },
    ];

    const markup = [...alerts, ...alerts]
      .map(
        (item) =>
          `<div class="ticker-item"><span class="ticker-time">${item.time}</span><span class="ticker-msg" style="color:${item.col}">${item.msg}</span></div>`
      )
      .join('');

    stream.innerHTML = markup;
  }

  function init() {
    initThreatMap();
    initLiveMetrics();
    initAlertTicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
