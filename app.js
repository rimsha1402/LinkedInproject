// app.js — core UI logic: feed rendering, graph, query engine, modals

document.addEventListener('DOMContentLoaded', () => {
  renderFeed();
  renderGraph();
  renderDefaultResults();
  setupQueryHandler();
  setupModal();
});

// ============ FEED OBSERVER ============

function renderFeed() {
  const container = document.getElementById('feed-list');
  container.innerHTML = '';
  MOCK_FEED_ITEMS.forEach(item => {
    const fromProfile = MOCK_PROFILES[item.yourConnection];
    const toProfile = MOCK_PROFILES[item.theirConnection];
    const strengthClass = getStrengthClass(item.detectedStrength);
    const strengthPct = Math.round(item.detectedStrength * 100);

    const el = document.createElement('div');
    el.className = `feed-item${item.isNew ? ' is-new' : ''}`;
    el.innerHTML = `
      <div class="feed-actors">
        <span class="feed-actor-name">${fromProfile.name}</span>
        <span class="feed-action">${item.action}</span>
        <span class="feed-actor-name">${toProfile.name}</span>
      </div>
      <div class="feed-snippet">"${item.snippet}"</div>
      <div class="feed-meta">
        <span class="feed-timestamp">${item.timestamp}</span>
        <span class="feed-strength-badge">
          <span class="type-badge type-${item.detectedType}">${formatType(item.detectedType)}</span>
          <span class="strength-bar-mini">
            <span class="fill fill-${strengthClass}" style="width: ${strengthPct}%"></span>
          </span>
          <span class="${'strength-' + strengthClass}">${strengthPct}%</span>
        </span>
      </div>
    `;
    el.addEventListener('click', () => {
      openDetailModal(item.yourConnection, item.theirConnection);
    });
    container.appendChild(el);
  });
  document.getElementById('feed-count').textContent = MOCK_FEED_ITEMS.length;
}

// ============ NETWORK GRAPH (Canvas-based) ============

let graphCanvas, graphCtx;
let graphNodes = [];
let graphEdges = [];
let hoveredNode = null;
let animFrame = null;

function renderGraph() {
  graphCanvas = document.getElementById('network-graph');
  graphCtx = graphCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  graphCanvas.addEventListener('mousemove', handleGraphHover);
  graphCanvas.addEventListener('click', handleGraphClick);

  buildGraphData();
  animateGraph();
}

function resizeCanvas() {
  const rect = graphCanvas.parentElement.getBoundingClientRect();
  const w = rect.width || graphCanvas.parentElement.offsetWidth || 600;
  const h = rect.height || graphCanvas.parentElement.offsetHeight || 460;
  graphCanvas.width = w;
  graphCanvas.height = h;
  if (graphNodes.length > 0) positionNodes();
}

function buildGraphData() {
  graphNodes = [];
  graphEdges = [];

  // Center node = You
  graphNodes.push({
    id: 'you', label: 'You', degree: 0,
    x: 0, y: 0, radius: 22,
    color: '#818cf8', borderColor: '#a78bfa'
  });

  // 1st degree connections
  const first = Object.values(MOCK_PROFILES).filter(p => p.degree === 1);
  first.forEach((p, i) => {
    graphNodes.push({
      id: p.id, label: p.name.split(' ')[0], degree: 1,
      x: 0, y: 0, radius: 16,
      color: '#60a5fa', borderColor: '#93c5fd'
    });
    graphEdges.push({ from: 'you', to: p.id, strength: 1, color: 'rgba(96, 165, 250, 0.25)' });
  });

  // 2nd degree connections
  const second = Object.values(MOCK_PROFILES).filter(p => p.degree === 2);
  second.forEach(p => {
    graphNodes.push({
      id: p.id, label: p.name.split(' ')[0], degree: 2,
      x: 0, y: 0, radius: 13,
      color: '#a78bfa', borderColor: '#c4b5fd'
    });
  });

  // Relationship edges (1st <-> 2nd)
  MOCK_RELATIONSHIPS.forEach(r => {
    const strengthClass = getStrengthClass(r.strength);
    let color = 'rgba(148, 163, 184, 0.2)';
    if (strengthClass === 'high') color = 'rgba(52, 211, 153, 0.4)';
    else if (strengthClass === 'medium') color = 'rgba(251, 191, 36, 0.35)';
    graphEdges.push({ from: r.source, to: r.target, strength: r.strength, color });
  });

  positionNodes();
}

function positionNodes() {
  const cx = graphCanvas.width / 2;
  const cy = graphCanvas.height / 2;
  const r1 = Math.min(cx, cy) * 0.42;
  const r2 = Math.min(cx, cy) * 0.78;

  graphNodes.forEach(n => {
    if (n.degree === 0) {
      n.x = cx;
      n.y = cy;
    }
  });

  const firstDeg = graphNodes.filter(n => n.degree === 1);
  firstDeg.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / firstDeg.length - Math.PI / 2;
    n.x = cx + r1 * Math.cos(angle);
    n.y = cy + r1 * Math.sin(angle);
  });

  const secondDeg = graphNodes.filter(n => n.degree === 2);
  secondDeg.forEach((n, i) => {
    // Position near connected 1st-degree nodes
    const connected = MOCK_RELATIONSHIPS.filter(r => r.target === n.id || r.source === n.id);
    if (connected.length > 0) {
      const firstConn = connected[0];
      const partnerId = firstConn.source === n.id ? firstConn.target : firstConn.source;
      const partner = graphNodes.find(gn => gn.id === partnerId);
      if (partner && partner.degree === 1) {
        const angle = Math.atan2(partner.y - cy, partner.x - cx);
        const spread = (i % 3 - 1) * 0.5;
        n.x = cx + r2 * Math.cos(angle + spread);
        n.y = cy + r2 * Math.sin(angle + spread);
        return;
      }
    }
    const angle = (2 * Math.PI * i) / secondDeg.length - Math.PI / 2;
    n.x = cx + r2 * Math.cos(angle);
    n.y = cy + r2 * Math.sin(angle);
  });
}

function animateGraph() {
  drawGraph();
  animFrame = requestAnimationFrame(animateGraph);
}

function drawGraph() {
  const ctx = graphCtx;
  const w = graphCanvas.width;
  const h = graphCanvas.height;
  ctx.clearRect(0, 0, w, h);

  // Draw edges
  graphEdges.forEach(e => {
    const from = graphNodes.find(n => n.id === e.from);
    const to = graphNodes.find(n => n.id === e.to);
    if (!from || !to) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = e.color;
    ctx.lineWidth = e.from === 'you' ? 1 : Math.max(1, e.strength * 3);
    ctx.stroke();
  });

  // Draw nodes
  graphNodes.forEach(n => {
    const isHovered = hoveredNode && hoveredNode.id === n.id;
    const r = isHovered ? n.radius + 4 : n.radius;

    // Glow for hovered
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 8, 0, 2 * Math.PI);
      const glow = ctx.createRadialGradient(n.x, n.y, r, n.x, n.y, r + 8);
      glow.addColorStop(0, n.color + '40');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = n.color;
    ctx.fill();
    ctx.strokeStyle = isHovered ? '#fff' : n.borderColor;
    ctx.lineWidth = isHovered ? 2.5 : 1.5;
    ctx.stroke();

    // Label
    ctx.font = `${isHovered ? '600' : '500'} ${isHovered ? 12 : 10}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = isHovered ? '#fff' : '#cbd5e1';
    ctx.fillText(n.label, n.x, n.y + r + 15);
  });
}

function handleGraphHover(e) {
  const rect = graphCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  hoveredNode = null;
  graphNodes.forEach(n => {
    const dist = Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2);
    if (dist < n.radius + 5) hoveredNode = n;
  });
  graphCanvas.style.cursor = hoveredNode ? 'pointer' : 'default';
}

function handleGraphClick(e) {
  if (!hoveredNode || hoveredNode.degree === 0) return;
  const profile = MOCK_PROFILES[hoveredNode.id];
  if (!profile) return;

  if (profile.degree === 2) {
    // Find who knows this person
    const query = profile.name;
    document.getElementById('query-input').value = `Who knows ${query}?`;
    runQuery(query);
  } else if (profile.degree === 1) {
    // Show all relationships for this 1st-degree
    showConnectionRelationships(hoveredNode.id);
  }
}

// ============ QUERY ENGINE ============

function setupQueryHandler() {
  const input = document.getElementById('query-input');
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      runQuery(input.value);
    }
  });

  // Suggestion chips
  document.querySelectorAll('.query-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.query;
      runQuery(chip.dataset.query);
    });
  });
}

function runQuery(raw) {
  const query = raw.toLowerCase().trim();
  const container = document.getElementById('results-list');
  container.innerHTML = '';

  // Extract name/company mentions
  let matches = [];

  MOCK_RELATIONSHIPS.forEach(rel => {
    const targetProfile = MOCK_PROFILES[rel.target];
    const sourceProfile = MOCK_PROFILES[rel.source];
    if (!targetProfile || !sourceProfile) return;

    // Check if query mentions the 2nd degree person or their company
    const targetName = targetProfile.name.toLowerCase();
    const targetCompany = targetProfile.company.toLowerCase();
    const sourceName = sourceProfile.name.toLowerCase();
    const sourceCompany = sourceProfile.company.toLowerCase();

    let matched = false;
    let matchedPerson = null;
    let pathPerson = null;

    // Check 2nd degree target
    if (targetProfile.degree === 2) {
      if (query.includes(targetName.split(' ')[0]) ||
          query.includes(targetName) ||
          query.includes(targetCompany)) {
        matched = true;
        matchedPerson = targetProfile;
        pathPerson = sourceProfile;
      }
    }

    // Check 2nd degree source
    if (sourceProfile.degree === 2) {
      if (query.includes(sourceName.split(' ')[0]) ||
          query.includes(sourceName) ||
          query.includes(sourceCompany)) {
        matched = true;
        matchedPerson = sourceProfile;
        pathPerson = targetProfile;
      }
    }

    if (matched) {
      matches.push({
        targetPerson: matchedPerson,
        viaPerson: pathPerson,
        relationship: rel
      });
    }
  });

  // Deduplicate by via person, keep strongest
  const byVia = {};
  matches.forEach(m => {
    const key = m.viaPerson.id + '-' + m.targetPerson.id;
    if (!byVia[key] || byVia[key].relationship.strength < m.relationship.strength) {
      byVia[key] = m;
    }
  });
  matches = Object.values(byVia);

  // Sort by strength
  matches.sort((a, b) => b.relationship.strength - a.relationship.strength);

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">&#x2205;</div>
        <p>No paths found in your observed network. Try searching for a name or company from the graph.</p>
      </div>
    `;
    return;
  }

  document.getElementById('results-title').textContent = `PATHS FOUND`;
  document.getElementById('results-count').textContent = matches.length;

  matches.forEach((m, i) => {
    const rel = m.relationship;
    const strengthClass = getStrengthClass(rel.strength);
    const strengthPct = Math.round(rel.strength * 100);

    // Find evidence
    const interactions = MOCK_INTERACTIONS.filter(
      int => (int.from === rel.source && int.to === rel.target) ||
             (int.from === rel.target && int.to === rel.source)
    );
    const bestEvidence = interactions[0];

    const card = document.createElement('div');
    card.className = `result-card${i === 0 ? ' highlighted' : ''}`;
    card.innerHTML = `
      <div class="result-header">
        <span class="result-rank rank-${Math.min(i + 1, 3)}">${i + 1}</span>
        <span class="result-name">${m.targetPerson.name}</span>
      </div>
      <div class="result-path">
        via <span class="via">${m.viaPerson.name}</span> · ${m.viaPerson.headline}
      </div>
      <div class="result-strength-row">
        <span class="type-badge type-${rel.type}">${formatType(rel.type)}</span>
        <div class="strength-bar">
          <div class="fill fill-${strengthClass}" style="width: ${strengthPct}%"></div>
        </div>
        <span class="strength-label strength-${strengthClass}">${strengthPct}%</span>
      </div>
      ${bestEvidence ? `
        <div class="result-evidence">
          <div class="evidence-quote">"${bestEvidence.comment}"</div>
        </div>
      ` : ''}
      <div class="result-tags">
        ${rel.tags.slice(0, 4).map(t => `<span class="tag tag-signal">${t.replace(/_/g, ' ')}</span>`).join('')}
      </div>
    `;
    card.addEventListener('click', () => openDetailModal(rel.source, rel.target));
    container.appendChild(card);
  });

  // Animate strength bars
  setTimeout(() => {
    container.querySelectorAll('.strength-bar .fill').forEach(fill => {
      fill.style.width = fill.style.width;
    });
  }, 50);
}

function showConnectionRelationships(personId) {
  const rels = MOCK_RELATIONSHIPS.filter(r => r.source === personId || r.target === personId);
  const profile = MOCK_PROFILES[personId];
  const container = document.getElementById('results-list');
  container.innerHTML = '';

  document.getElementById('results-title').textContent = `${profile.name.split(' ')[0]}'s CONNECTIONS`;
  document.getElementById('results-count').textContent = rels.length;

  rels.sort((a, b) => b.strength - a.strength);
  rels.forEach((rel, i) => {
    const otherId = rel.source === personId ? rel.target : rel.source;
    const other = MOCK_PROFILES[otherId];
    if (!other) return;
    const strengthClass = getStrengthClass(rel.strength);
    const strengthPct = Math.round(rel.strength * 100);

    const card = document.createElement('div');
    card.className = `result-card${i === 0 ? ' highlighted' : ''}`;
    card.innerHTML = `
      <div class="result-header">
        <span class="result-rank rank-${Math.min(i + 1, 3)}">${i + 1}</span>
        <span class="result-name">${other.name}</span>
      </div>
      <div class="result-path">${other.headline}</div>
      <div class="result-strength-row">
        <span class="type-badge type-${rel.type}">${formatType(rel.type)}</span>
        <div class="strength-bar">
          <div class="fill fill-${strengthClass}" style="width: ${strengthPct}%"></div>
        </div>
        <span class="strength-label strength-${strengthClass}">${strengthPct}%</span>
      </div>
      <div class="result-tags">
        ${rel.tags.slice(0, 3).map(t => `<span class="tag tag-signal">${t.replace(/_/g, ' ')}</span>`).join('')}
      </div>
    `;
    card.addEventListener('click', () => openDetailModal(rel.source, rel.target));
    container.appendChild(card);
  });
}

function renderDefaultResults() {
  // Show top relationships by default
  const container = document.getElementById('results-list');
  const sorted = [...MOCK_RELATIONSHIPS].sort((a, b) => b.strength - a.strength).slice(0, 5);

  sorted.forEach((rel, i) => {
    const source = MOCK_PROFILES[rel.source];
    const target = MOCK_PROFILES[rel.target];
    const strengthClass = getStrengthClass(rel.strength);
    const strengthPct = Math.round(rel.strength * 100);

    const card = document.createElement('div');
    card.className = `result-card${i === 0 ? ' highlighted' : ''}`;
    card.innerHTML = `
      <div class="result-header">
        <span class="result-rank rank-${Math.min(i + 1, 3)}">${i + 1}</span>
        <span class="result-name">${source.name} → ${target.name}</span>
      </div>
      <div class="result-path">${rel.summary}</div>
      <div class="result-strength-row">
        <span class="type-badge type-${rel.type}">${formatType(rel.type)}</span>
        <div class="strength-bar">
          <div class="fill fill-${strengthClass}" style="width: ${strengthPct}%"></div>
        </div>
        <span class="strength-label strength-${strengthClass}">${strengthPct}%</span>
      </div>
    `;
    card.addEventListener('click', () => openDetailModal(rel.source, rel.target));
    container.appendChild(card);
  });
}

// ============ DETAIL MODAL ============

function setupModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openDetailModal(sourceId, targetId) {
  const rel = MOCK_RELATIONSHIPS.find(
    r => (r.source === sourceId && r.target === targetId) ||
         (r.source === targetId && r.target === sourceId)
  );
  if (!rel) return;

  const source = MOCK_PROFILES[rel.source];
  const target = MOCK_PROFILES[rel.target];
  const interactions = MOCK_INTERACTIONS.filter(
    int => (int.from === rel.source && int.to === rel.target) ||
           (int.from === rel.target && int.to === rel.source)
  );
  const strengthClass = getStrengthClass(rel.strength);
  const strengthPct = Math.round(rel.strength * 100);

  document.getElementById('modal-title-text').textContent =
    `${source.name} ↔ ${target.name}`;
  document.getElementById('modal-subtitle-text').textContent =
    `${source.headline} · ${target.headline}`;

  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">Relationship Assessment</div>
      <div class="result-strength-row" style="margin-bottom: 12px;">
        <span class="type-badge type-${rel.type}">${formatType(rel.type)}</span>
        <div class="strength-bar">
          <div class="fill fill-${strengthClass}" style="width: ${strengthPct}%"></div>
        </div>
        <span class="strength-label strength-${strengthClass}">${strengthPct}%</span>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6;">
        ${rel.summary}
      </p>
      <div class="result-tags" style="margin-top: 10px;">
        ${rel.tags.map(t => `<span class="tag tag-signal">${t.replace(/_/g, ' ')}</span>`).join('')}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Evidence (${interactions.length} interactions observed)</div>
      ${interactions.map(int => `
        <div class="modal-interaction">
          <div class="interaction-date">${int.date} · ${int.postType.replace(/_/g, ' ')}</div>
          <div class="interaction-post">Post: "${int.postContent}"</div>
          <div class="interaction-comment">Comment: "${int.comment}"</div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// ============ HELPERS ============

function getStrengthClass(strength) {
  if (strength >= 0.65) return 'high';
  if (strength >= 0.35) return 'medium';
  return 'low';
}

function formatType(type) {
  return type.replace(/_/g, ' ');
}
