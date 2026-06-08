// engine.js — Modular animation engine for BatterPlay

const PLAYER_SCALE = 0.75;
const BATTER_HOME = { x: 148, y: 258 };

const BASE_POSITIONS = {
  'home': { x: 148, y: 258 },
  '1b': { x: 262, y: 152 },
  '2b': { x: 160, y: 50 },
  '3b': { x: 58, y: 152 }
};

const AnimationEngine = {
  isAnimating: false,
  lastBallPosition: { x: 148, y: 258 },

  // Helper curves
  lerp(a, b, t) { return a + (b - a) * t; },
  easeOut(t) { return 1 - Math.pow(1 - t, 3); },
  easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  easeOutBounce(t) {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
    if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
    t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375;
  },

  getScaleForY(y) {
    return PLAYER_SCALE;
  },

  wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },

  animate(duration, cb) {
    return new Promise(resolve => {
      const t0 = performance.now();
      function step(now) {
        const raw = Math.min((now - t0) / duration, 1);
        cb(raw);
        if (raw < 1) requestAnimationFrame(step); else resolve();
      }
      requestAnimationFrame(step);
    });
  },

  spawnDust(svgX, svgY, count = 8) {
    const svg = document.getElementById('field-svg');
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const sx = r.width / 320, sy = r.height / 360;
    const px = r.left + svgX * sx, py = r.top + (svgY + 60) * sy;
    const colors = ['#f0e040', '#fff', '#c8873a', '#2ecc71', '#e74c3c', '#f5c5a3'];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 'pixel-dust';
      const a = Math.random() * Math.PI * 2, dist = 15 + Math.random() * 30;
      d.style.setProperty('--dx', `${Math.cos(a) * dist}px`);
      d.style.setProperty('--dy', `${Math.sin(a) * dist}px`);
      d.style.left = px + 'px';
      d.style.top = py + 'px';
      d.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 600);
    }
  },

  flashBase(base) {
    const hiId = 'hi-' + base;
    const el = document.getElementById(hiId);
    if (!el) return;
    let n = 0;
    const iv = setInterval(() => {
      n++;
      el.setAttribute('opacity', n % 2 === 0 ? '0.85' : '0');
      if (n >= 8) {
        clearInterval(iv);
        el.setAttribute('opacity', '0');
      }
    }, 85);
  },

  clearHighlights() {
    ['home', '1b', '2b', '3b'].forEach(base => {
      const el = document.getElementById('hi-' + base);
      if (el) el.setAttribute('opacity', '0');
    });
  },

  showFloatingTag(element, text, color) {
    if (!element) return;
    const parent = element.parentNode || document.getElementById('field-svg');
    if (!parent) return;

    let x = 160;
    let y = 150;
    const trans = element.getAttribute('transform');
    if (trans) {
      const match = trans.match(/translate\(([^,\s)]+)[,\s]([^)\s]+)\)/);
      if (match) {
        x = parseFloat(match[1]);
        y = parseFloat(match[2]);
      }
    }

    const tag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tag.setAttribute('x', String(x));
    tag.setAttribute('y', String(y - 45));
    tag.setAttribute('font-family', "'Press Start 2P', monospace");
    tag.setAttribute('font-size', '9.5');
    tag.setAttribute('font-weight', 'bold');
    tag.setAttribute('text-anchor', 'middle');
    tag.setAttribute('fill', color);
    tag.setAttribute('stroke', '#000');
    tag.setAttribute('stroke-width', '2.5');
    tag.setAttribute('paint-order', 'stroke fill');
    tag.textContent = text;

    parent.appendChild(tag);

    const duration = 1200;
    const startTime = performance.now();
    const startY = y - 45;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentY = startY - progress * 30;
      const opacity = 1 - progress;

      tag.setAttribute('y', String(currentY));
      tag.setAttribute('opacity', String(opacity));

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        tag.remove();
      }
    }
    requestAnimationFrame(frame);
  },

  // 2.5D base running helper
  runElementToBases(el, baseList) {
    return new Promise(async resolve => {
      let currentPos = { x: 148, y: 258 };
      const trans = el.getAttribute('transform');
      if (trans) {
        const match = trans.match(/translate\(([^,\s)]+)[,\s]([^)\s]+)\)/);
        if (match) {
          currentPos.x = parseFloat(match[1]);
          currentPos.y = parseFloat(match[2]);
        }
      }
      
      for (let i = 0; i < baseList.length; i++) {
        const targetBase = baseList[i];
        const target = BASE_POSITIONS[targetBase];
        const startX = currentPos.x, startY = currentPos.y;
        const dx = target.x - startX, dy = target.y - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) continue;
        
        const duration = Math.max(380, dist * 2.5);
        
        await this.animate(duration, t => {
          const easeT = this.easeInOut(t);
          const x = startX + dx * easeT;
          const y = startY + dy * easeT;
          const bobAmp = Math.min((dist / duration) * 140, 6);
          const bob = Math.sin(t * dist * 0.38) * bobAmp;
          const lean = (dx > 0 ? 1 : dx < 0 ? -1 : 0) * 4 * Math.sin(t * dist * 0.22);
          
          const scale = this.getScaleForY(y);
          el.setAttribute('transform', `translate(${x},${y + bob}) scale(${scale}) rotate(${lean}, 0, -20)`);
          currentPos.x = x;
          currentPos.y = y;
        });
        
        currentPos.x = target.x;
        currentPos.y = target.y;
        const scale = this.getScaleForY(target.y);
        el.setAttribute('transform', `translate(${target.x},${target.y}) scale(${scale})`);
        
        this.flashBase(targetBase);
        this.spawnDust(target.x, target.y - 20, 8);
        
        // Small bounce at base
        await new Promise(res => {
          const bx = currentPos.x, by = currentPos.y, t0 = performance.now();
          const b = (now) => {
            const t = (now - t0) / 300;
            if (t > 1) { 
              el.setAttribute('transform', `translate(${bx},${by}) scale(${scale})`); 
              res(); 
              return; 
            }
            const scaleNow = this.getScaleForY(by + Math.sin(t * Math.PI) * -8);
            el.setAttribute('transform', `translate(${bx},${by + Math.sin(t * Math.PI) * -8}) scale(${scaleNow})`);
            requestAnimationFrame(b);
          };
          requestAnimationFrame(b);
        });
      }
      resolve();
    });
  },

  // Setup standard scenario base runners
  setupBaseRunners(runners) {
    // Clone logic if runners elements aren't present
    const svg = document.getElementById('field-svg');
    const player = document.getElementById('player');
    if (!player || !svg) return;
    
    ['runner-1b', 'runner-2b', 'runner-3b'].forEach(id => {
      let runner = document.getElementById(id);
      if (!runner) {
        runner = player.cloneNode(true);
        runner.id = id;
        const bat = runner.querySelector('#bat-group') || runner.querySelector('[id*="bat"]');
        if (bat) bat.remove();
        runner.setAttribute('opacity', '0');
        svg.insertBefore(runner, document.getElementById('ball'));
      }
    });

    // Reset visibility
    ['runner-1b', 'runner-2b', 'runner-3b'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('opacity', '0');
    });

    // Position active runners
    runners.forEach(base => {
      const el = document.getElementById('runner-' + base);
      if (el) {
        const pos = BASE_POSITIONS[base];
        const scale = this.getScaleForY(pos.y);
        el.setAttribute('transform', `translate(${pos.x},${pos.y}) scale(${scale})`);
        el.setAttribute('opacity', '1');
      }
    });
  },

  // Pitch + Ball travel + Hit (if fielding role)
  async triggerPitch(role, hitPreset, runners, onCompleted) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Grab elements
    const pitcherArm = document.getElementById('pitcher-arm');
    const pitcherG = document.getElementById('pitcher');
    const pitcherBallHand = document.getElementById('pitcher-ball-hand');
    const ballG = document.getElementById('ball');
    const popflyBall = document.getElementById('popfly-ball');
    const batGroup = document.getElementById('bat-group');
    const playerG = document.getElementById('player');
    const statusText = document.getElementById('status-text');

    // Closeup panels
    const crackText = document.getElementById('crack-text');
    const flashEl = document.getElementById('flash');
    const cuBatter = document.getElementById('cu-batter');
    const cuBatGroup = document.getElementById('cu-bat-group');
    const cuBall = document.getElementById('cu-ball');
    const cuImpact = document.getElementById('cu-impact');

    // Reset positions of all fielders
    for (const key in POSITION_COORDS) {
      const info = POSITION_COORDS[key];
      const el = document.getElementById(info.id);
      if (el) {
        const scale = this.getScaleForY(info.y);
        el.setAttribute('transform', `translate(${info.x},${info.y}) scale(${scale})`);
        el.setAttribute('opacity', '1');
      }
    }
    batGroup.setAttribute('transform', '');
    popflyBall.setAttribute('opacity', '0');
    ballG.setAttribute('opacity', '0');
    pitcherArm.setAttribute('transform', '');
    pitcherBallHand.setAttribute('opacity', '1');
    playerG.setAttribute('transform', `translate(${BATTER_HOME.x},${BATTER_HOME.y}) scale(${PLAYER_SCALE})`);
    playerG.setAttribute('opacity', '1');

    this.clearHighlights();
    this.setupBaseRunners(runners);

    // 1. WIND-UP
    await this.animate(400, t => {
      pitcherArm.setAttribute('transform', `rotate(${this.easeInOut(t) * -110}, 8, -22)`);
      pitcherG.setAttribute('transform', `translate(160,152) scale(${PLAYER_SCALE}) rotate(${this.easeInOut(t) * -5}, 0, -20)`);
    });
    await this.wait(120);

    // 2. THROW
    pitcherBallHand.setAttribute('opacity', '0');
    ballG.setAttribute('opacity', '1');
    ballG.setAttribute('transform', 'translate(160,145)');

    // Prep closeup view
    if (cuBall) {
      cuBall.setAttribute('opacity', '1');
      cuBall.setAttribute('transform', 'translate(260, 40)');
      cuImpact.setAttribute('opacity', '0');
      crackText.style.opacity = '0';
      crackText.style.transform = 'translate(-50%,-50%) scale(0)';
      flashEl.style.opacity = '0';
    }

    const throwP = this.animate(220, t => {
      const angle = -110 + this.easeOut(t) * 140;
      pitcherArm.setAttribute('transform', `rotate(${angle}, 8, -22)`);
      pitcherG.setAttribute('transform', `translate(160,152) scale(${PLAYER_SCALE}) rotate(${(1 - this.easeOut(t)) * -5}, 0, -20)`);
    });

    const ballTravelP = this.animate(280, t => {
      const e = this.easeOut(t);
      ballG.setAttribute('transform', `translate(${this.lerp(160, 148, e)},${this.lerp(145, 248, e) + Math.sin(t * Math.PI) * -8})`);
      
      if (cuBall) {
        const bx = this.lerp(260, 80, t);
        const by = this.lerp(40, 88, t);
        cuBall.setAttribute('transform', `translate(${bx},${by})`);
        
        const batAngle = t * 20;
        cuBatGroup.setAttribute('transform', `rotate(${batAngle}, -38, -60)`);
        const bodyRotate = t * 6;
        cuBatter.setAttribute('transform', `translate(130,158) rotate(${bodyRotate}, 0, -80)`);
      }
    });

    await Promise.all([throwP, ballTravelP]);

    if (role === 'hitter') {
      // Hitter stops when ball arrives
      await this.wait(300);
      this.isAnimating = false;
      if (onCompleted) onCompleted();
    } else {
      // Fielder (pitcher, catcher, infield, outfield): Ball gets hit automatically
      this.spawnDust(148, 240, 12);
      if (typeof playBatCrack === 'function') playBatCrack();

      const hitLabel = {
        'grounder': 'GROUNDER',
        'popup': 'POP FLY',
        'fly': 'FLY BALL',
        'liner': 'LINE DRIVE',
        'bunt': 'BUNT'
      }[hitPreset.type] || 'HIT';
      this.showFloatingTag(playerG, hitLabel, '#f0e040');

      // Show impact overlay
      if (cuImpact) {
        cuImpact.setAttribute('opacity', '1');
        cuImpact.setAttribute('transform', 'translate(130,158)');
        crackText.style.opacity = '1';
        crackText.style.transform = 'translate(-50%,-50%) scale(1)';
        flashEl.style.opacity = '0.95';
      }

      const flashFadeP = this.animate(120, t => {
        if (flashEl) flashEl.style.opacity = String(0.95 * (1 - t));
      });

      const swingP = this.animate(200, t => {
        const e = this.easeOut(t);
        batGroup.setAttribute('transform', `rotate(${-30 + e * 180}, 8, -24)`);
        playerG.setAttribute('transform', `translate(${BATTER_HOME.x},${BATTER_HOME.y}) scale(${PLAYER_SCALE}) rotate(${e * 25}, 0, -20)`);
      });

      const hitP = this.animate(200, t => {
        ballG.setAttribute('opacity', String(1 - t));
      });

      const cuRicochetP = this.animate(300, t => {
        if (cuBall) {
          const e = this.easeInOut(t);
          const batAngle = 20 + e * 40;
          cuBatGroup.setAttribute('transform', `rotate(${batAngle}, -38, -60)`);
          const bodyRotate = 6 + e * 12;
          cuBatter.setAttribute('transform', `translate(130,158) rotate(${bodyRotate}, 0, -80)`);
          
          const bx = this.lerp(80, -30, e);
          const by = this.lerp(88, -20, e) - Math.sin(e * Math.PI) * 50;
          cuBall.setAttribute('transform', `translate(${bx},${by})`);
        }
      });

      await Promise.all([flashFadeP, swingP, hitP, cuRicochetP]);

      // Cleanup closeup
      if (flashEl) {
        flashEl.style.opacity = '0';
        crackText.style.opacity = '0';
        cuImpact.setAttribute('opacity', '0');
        cuBall.setAttribute('opacity', '0');
      }
      ballG.setAttribute('opacity', '0');
      pitcherBallHand.setAttribute('opacity', '1');

      // 4. Ball flies to target & fielder runs to it
      if (statusText) statusText.textContent = hitPreset.details.toUpperCase();

      const targetCoords = hitPreset.coords;
      const isPopUp = (hitPreset.type === 'popup' || hitPreset.type === 'fly');

      popflyBall.setAttribute('opacity', '1');
      popflyBall.setAttribute('transform', 'translate(148,248)');

      const dx = targetCoords.x - 148;
      const dy = targetCoords.y - 248;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let ballDuration = Math.round(dist / 0.16);
      ballDuration = Math.max(700, Math.min(1300, ballDuration));

      this.lastBallPosition = { ...targetCoords };

      // Get fielder element
      const fielderId = hitPreset.fielderId || POSITION_COORDS[role]?.id || 'fielder-3b';
      const fielderG = document.getElementById(fielderId);
      
      let fielderStart = { x: 160, y: 152 }; // Safe default (mound)
      for (const key in POSITION_COORDS) {
        if (POSITION_COORDS[key].id === fielderId || key === fielderId) {
          fielderStart = { x: POSITION_COORDS[key].x, y: POSITION_COORDS[key].y };
          break;
        }
      }

      // Ball path flight
      const ballFlightP = this.animate(ballDuration, t => {
        const bx = this.lerp(148, targetCoords.x, t);
        const by = this.lerp(248, targetCoords.y, t);
        
        let arc = 0;
        let scale = 1.0;
        if (isPopUp) {
          arc = Math.sin(t * Math.PI) * -80;
          scale = 1.0 + Math.sin(t * Math.PI) * 0.4;
        } else {
          arc = Math.abs(Math.sin(t * Math.PI * 4)) * -4;
          scale = 1.0 - t * 0.2;
        }
        popflyBall.setAttribute('transform', `translate(${bx},${by + arc}) scale(${scale})`);
      });

      // Fielder move to ball
      const fielderMoveP = this.animate(ballDuration, t => {
        if (fielderG) {
          const x = this.lerp(fielderStart.x, targetCoords.x, t);
          const y = this.lerp(fielderStart.y, targetCoords.y, t);
          const bob = Math.sin(t * 12) * 2;
          const scale = this.getScaleForY(y);
          fielderG.setAttribute('transform', `translate(${x},${y + bob}) scale(${scale})`);
        }
      });

      // Runners move halfway
      const runnersHalfwayP = [];
      runners.forEach(base => {
        const runnerEl = document.getElementById('runner-' + base);
        if (runnerEl) {
          const start = BASE_POSITIONS[base];
          let targetBase = '1b';
          if (base === '1b') targetBase = '2b';
          else if (base === '2b') targetBase = '3b';
          else if (base === '3b') targetBase = 'home';
          
          const target = BASE_POSITIONS[targetBase];
          
          // halfway
          const hx = this.lerp(start.x, target.x, 0.5);
          const hy = this.lerp(start.y, target.y, 0.5);

          runnersHalfwayP.push(this.animate(ballDuration * 0.8, t => {
            const x = this.lerp(start.x, hx, t);
            const y = this.lerp(start.y, hy, t);
            const bob = Math.sin(t * 10) * 2;
            const scale = this.getScaleForY(y);
            runnerEl.setAttribute('transform', `translate(${x},${y + bob}) scale(${scale})`);
          }));
        }
      });

      // Batter runs halfway to 1B
      const batterRunP = this.animate(ballDuration * 0.6, t => {
        const bx = this.lerp(BATTER_HOME.x, this.lerp(BATTER_HOME.x, BASE_POSITIONS['1b'].x, 0.5), t);
        const by = this.lerp(BATTER_HOME.y, this.lerp(BATTER_HOME.y, BASE_POSITIONS['1b'].y, 0.5), t);
        const bScale = this.getScaleForY(by);
        playerG.setAttribute('transform', `translate(${bx},${by}) scale(${bScale})`);
      });

      await Promise.all([ballFlightP, fielderMoveP, ...runnersHalfwayP, batterRunP]);

      // catch
      if (typeof playGloveCatch === 'function') playGloveCatch();
      this.spawnDust(targetCoords.x, targetCoords.y, 8);
      popflyBall.setAttribute('opacity', '0');

      if (statusText) statusText.textContent = isPopUp ? "CAUGHT! PLAY CONTINUES..." : "FIELDED! PLAY CONTINUES...";
      await this.wait(600);
      
      this.isAnimating = false;
      if (onCompleted) onCompleted();
    }
  },

  // Perform swing and hit on correct Hitter answer
  async playHitterCorrectHit(hitPreset, onFinished) {
    // CONTACT SWING
    this.spawnDust(148, 240, 12);
    if (typeof playBatCrack === 'function') playBatCrack();
    if (typeof playCrowdCheer === 'function') playCrowdCheer(2.5, 0.22);

    const batGroup = document.getElementById('bat-group');
    const playerG = document.getElementById('player');
    const ballG = document.getElementById('ball');
    const popflyBall = document.getElementById('popfly-ball');

    const hitLabel = {
      'grounder': 'GROUNDER',
      'popup': 'POP FLY',
      'fly': 'FLY BALL',
      'liner': 'LINE DRIVE',
      'bunt': 'BUNT'
    }[hitPreset.type] || 'HIT';
    this.showFloatingTag(playerG, hitLabel, '#f0e040');
    
    const crackText = document.getElementById('crack-text');
    const flashEl = document.getElementById('flash');
    const cuBatter = document.getElementById('cu-batter');
    const cuBatGroup = document.getElementById('cu-bat-group');
    const cuBall = document.getElementById('cu-ball');
    const cuImpact = document.getElementById('cu-impact');

    if (cuImpact) {
      cuImpact.setAttribute('opacity', '1');
      cuImpact.setAttribute('transform', 'translate(130,158)');
      crackText.style.opacity = '1';
      crackText.style.transform = 'translate(-50%,-50%) scale(1)';
      flashEl.style.opacity = '0.95';
    }

    const flashFadeP = this.animate(120, t => {
      if (flashEl) flashEl.style.opacity = String(0.95 * (1 - t));
    });

    const swingP = this.animate(200, t => {
      const e = this.easeOut(t);
      batGroup.setAttribute('transform', `rotate(${-30 + e * 180}, 8, -24)`);
      playerG.setAttribute('transform', `translate(${BATTER_HOME.x},${BATTER_HOME.y}) scale(${PLAYER_SCALE}) rotate(${e * 25}, 0, -20)`);
    });

    const hitP = this.animate(200, t => {
      ballG.setAttribute('opacity', String(1 - t));
    });

    const cuRicochetP = this.animate(300, t => {
      if (cuBall) {
        const e = this.easeInOut(t);
        const batAngle = 20 + e * 40;
        cuBatGroup.setAttribute('transform', `rotate(${batAngle}, -38, -60)`);
        const bodyRotate = 6 + e * 12;
        cuBatter.setAttribute('transform', `translate(130,158) rotate(${bodyRotate}, 0, -80)`);
        
        const bx = this.lerp(80, -30, e);
        const by = this.lerp(88, -20, e) - Math.sin(e * Math.PI) * 50;
        cuBall.setAttribute('transform', `translate(${bx},${by})`);
      }
    });

    await Promise.all([flashFadeP, swingP, hitP, cuRicochetP]);

    // Reset batter cam
    if (flashEl) {
      flashEl.style.opacity = '0';
      cuImpact.setAttribute('opacity', '0');
      cuBall.setAttribute('opacity', '0');
    }

    // ball flies to target
    popflyBall.setAttribute('opacity', '1');
    popflyBall.setAttribute('transform', 'translate(148,248)');
    
    const isPopUp = (hitPreset.type === 'popup' || hitPreset.type === 'fly');
    await this.animate(500, t => {
      const e = this.easeOut(t);
      const bx = this.lerp(148, hitPreset.coords.x, e);
      const by = this.lerp(248, hitPreset.coords.y, e);
      let arc = 0;
      if (isPopUp) {
        arc = Math.sin(t * Math.PI) * -80;
      }
      popflyBall.setAttribute('transform', `translate(${bx},${by + arc})`);
    });

    // Cleanup crack text
    if (crackText) {
      crackText.style.opacity = '0';
    }

    // Reset swing stance
    batGroup.setAttribute('transform', '');
    playerG.setAttribute('transform', `translate(${BATTER_HOME.x},${BATTER_HOME.y}) scale(${PLAYER_SCALE})`);

    if (onFinished) onFinished();
  },

  // Perform swing and miss on wrong Hitter answer
  async playHitterSwingMiss() {
    const batGroup = document.getElementById('bat-group');
    const playerG = document.getElementById('player');
    const ballG = document.getElementById('ball');
    
    const cuBatter = document.getElementById('cu-batter');
    const cuBatGroup = document.getElementById('cu-bat-group');
    const cuBall = document.getElementById('cu-ball');

    const swingP = this.animate(200, t => {
      const e = this.easeOut(t);
      batGroup.setAttribute('transform', `rotate(${-30 + e * 180}, 8, -24)`);
      playerG.setAttribute('transform', `translate(${BATTER_HOME.x},${BATTER_HOME.y}) scale(${PLAYER_SCALE}) rotate(${e * 25}, 0, -20)`);
    });

    const ballP = this.animate(150, t => {
      const e = this.easeInOut(t);
      ballG.setAttribute('transform', `translate(${this.lerp(148, 160, e)},${this.lerp(248, 282, e)}) scale(0.8)`);
    });

    const cuSwingP = this.animate(250, t => {
      if (cuBall) {
        const e = this.easeInOut(t);
        const batAngle = 20 + e * 40;
        cuBatGroup.setAttribute('transform', `rotate(${batAngle}, -38, -60)`);
        const bodyRotate = 6 + e * 12;
        cuBatter.setAttribute('transform', `translate(130,158) rotate(${bodyRotate}, 0, -80)`);
        
        const bx = this.lerp(80, 20, e);
        const by = this.lerp(88, 110, e);
        cuBall.setAttribute('transform', `translate(${bx},${by})`);
      }
    });

    await Promise.all([swingP, ballP, cuSwingP]);

    ballG.setAttribute('opacity', '0');
    if (cuBall) cuBall.setAttribute('opacity', '0');

    await this.wait(300);
    batGroup.setAttribute('transform', '');
    playerG.setAttribute('transform', `translate(${BATTER_HOME.x},${BATTER_HOME.y}) scale(${PLAYER_SCALE})`);
  },

  // Dynamic outcomes parser
  async playOutcomeSteps(steps, scenario) {
    this.isAnimating = true;
    const popflyBall = document.getElementById('popfly-ball');
    const playerG = document.getElementById('player');
    const statusText = document.getElementById('status-text');

    // Collect elements active at start
    const activeElements = [];
    if (playerG && playerG.getAttribute('opacity') !== '0') {
      activeElements.push(playerG);
    }
    ['runner-1b', 'runner-2b', 'runner-3b'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getAttribute('opacity') !== '0') {
        activeElements.push(el);
      }
    });

    // Normalize role
    const normalizedRole = scenario.role === '3rd_base' ? '3b' : scenario.role;

    // Determine who is fielding the ball
    const hitPreset = HIT_PRESETS.find(h => h.id === scenario.hitPresetId) || HIT_PRESETS[0];
    const roleCoords = POSITION_COORDS[normalizedRole] || POSITION_COORDS['3b'];
    
    // We assume the active fielder is currently at the ball contact location (since they ran there to field it)
    const activeFielderId = hitPreset.fielderId || roleCoords.id;
    const activeFielderG = document.getElementById(activeFielderId);
    let currentFielderPos = { ...hitPreset.coords };

    // Standard run pathways
    const runners = scenario.runners || [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      switch (step.type) {
        case 'status':
          if (statusText) statusText.textContent = step.text;
          break;

        case 'catch_sound':
          if (typeof playGloveCatch === 'function') playGloveCatch();
          break;

        case 'tag_sound':
          if (typeof playTagSound === 'function') playTagSound();
          break;

        case 'cheer_sound':
          if (typeof playCrowdCheer === 'function') playCrowdCheer(step.duration, step.volume);
          break;

        case 'flash_base':
          this.flashBase(step.base);
          break;

        case 'wait':
          await this.wait(step.duration);
          break;

        case 'dust':
          const basePos = BASE_POSITIONS[step.base];
          if (basePos) this.spawnDust(basePos.x, basePos.y, step.count || 8);
          break;

        case 'dust_runner':
          const runnerEl = document.getElementById(step.runnerId);
          if (runnerEl) {
            const trans = runnerEl.getAttribute('transform');
            if (trans) {
              const match = trans.match(/translate\(([^,\s)]+)[,\s]([^)\s]+)\)/);
              if (match) {
                this.spawnDust(parseFloat(match[1]), parseFloat(match[2]), step.count || 8);
              }
            }
          }
          break;

        case 'runner_out':
          const outEl = document.getElementById(step.runnerId);
          if (outEl) {
            this.showFloatingTag(outEl, 'OUT', '#e74c3c');
            // Out indicator (fade opacity)
            await this.animate(200, t => {
              outEl.setAttribute('opacity', String(1 - t));
            });
            outEl.setAttribute('opacity', '0');
          }
          break;

        case 'ball_throw':
          // Throws from last ball position (where the fielder fielded it) to a base
          popflyBall.setAttribute('opacity', '1');
          popflyBall.setAttribute('transform', `translate(${currentFielderPos.x},${currentFielderPos.y})`);
          
          const targetBasePos = BASE_POSITIONS[step.targetBase] || BASE_POSITIONS['1b'];
          
          // Fielder arm/throw visual cue
          if (activeFielderG) {
            // small forward rotate for throw
            activeFielderG.setAttribute('transform', `translate(${currentFielderPos.x},${currentFielderPos.y}) scale(${PLAYER_SCALE}) rotate(10)`);
          }

          // Throw ball
          await this.animate(step.duration || 400, t => {
            const bx = this.lerp(currentFielderPos.x, targetBasePos.x, t);
            const by = this.lerp(currentFielderPos.y, targetBasePos.y, t);
            popflyBall.setAttribute('transform', `translate(${bx},${by}) scale(0.6)`);
          });
          
          popflyBall.setAttribute('opacity', '0');
          
          // Reset fielder rotation
          if (activeFielderG) {
            activeFielderG.setAttribute('transform', `translate(${currentFielderPos.x},${currentFielderPos.y}) scale(${PLAYER_SCALE})`);
          }
          break;

        case 'ball_throw_from_base':
          // Throws from one base to another
          popflyBall.setAttribute('opacity', '1');
          
          const startBasePos = BASE_POSITIONS[step.fromBase];
          const endBasePos = BASE_POSITIONS[step.targetBase];
          
          if (startBasePos && endBasePos) {
            popflyBall.setAttribute('transform', `translate(${startBasePos.x},${startBasePos.y})`);
            await this.animate(step.duration || 300, t => {
              const bx = this.lerp(startBasePos.x, endBasePos.x, t);
              const by = this.lerp(startBasePos.y, endBasePos.y, t);
              popflyBall.setAttribute('transform', `translate(${bx},${by}) scale(0.6)`);
            });
          }
          popflyBall.setAttribute('opacity', '0');
          break;

        case 'fielder_move':
          // Moves active fielder to a base
          if (activeFielderG) {
            const targetBaseCoords = BASE_POSITIONS[step.targetBase];
            const startFielderX = currentFielderPos.x;
            const startFielderY = currentFielderPos.y;
            
            await this.animate(step.duration || 400, t => {
              const x = this.lerp(startFielderX, targetBaseCoords.x, t);
              const y = this.lerp(startFielderY, targetBaseCoords.y, t);
              const bob = Math.sin(t * 10) * 1.5;
              const scale = this.getScaleForY(y);
              activeFielderG.setAttribute('transform', `translate(${x},${y + bob}) scale(${scale})`);
            });
            currentFielderPos = { ...targetBaseCoords };
          }
          break;

        case 'fielder_move_role':
          // Moves a specific fielder position to a base
          const targetFielderId = POSITION_COORDS[step.role]?.id || 'fielder-3b';
          const targetFielderEl = document.getElementById(targetFielderId);
          if (targetFielderEl) {
            const targetBaseCoords = BASE_POSITIONS[step.targetBase];
            let startFielderX = POSITION_COORDS[step.role]?.x || 160;
            let startFielderY = POSITION_COORDS[step.role]?.y || 282;

            await this.animate(step.duration || 400, t => {
              const x = this.lerp(startFielderX, targetBaseCoords.x, t);
              const y = this.lerp(startFielderY, targetBaseCoords.y, t);
              const bob = Math.sin(t * 10) * 1.5;
              const scale = this.getScaleForY(y);
              targetFielderEl.setAttribute('transform', `translate(${x},${y + bob}) scale(${scale})`);
            });
          }
          break;

        case 'fielder_tag_runner':
          // Fielder runs to tag a specific runner near a base
          if (activeFielderG) {
            const runnerEl = document.getElementById(step.runnerId);
            const targetBaseCoords = BASE_POSITIONS[step.base];
            const startFielderX = currentFielderPos.x;
            const startFielderY = currentFielderPos.y;

            // Fielder runs and runner slides
            await this.animate(step.duration || 500, t => {
              const fx = this.lerp(startFielderX, targetBaseCoords.x, t);
              const fy = this.lerp(startFielderY, targetBaseCoords.y, t);
              const scale = this.getScaleForY(fy);
              activeFielderG.setAttribute('transform', `translate(${fx},${fy}) scale(${scale})`);

              if (runnerEl) {
                // Runner slides in from halfway
                const rx = this.lerp(this.lerp(BASE_POSITIONS['2b'].x, targetBaseCoords.x, 0.5), targetBaseCoords.x, t);
                const ry = this.lerp(this.lerp(BASE_POSITIONS['2b'].y, targetBaseCoords.y, 0.5), targetBaseCoords.y, t);
                const rBob = Math.sin(t * Math.PI) * -6; // slide curve
                const rScale = this.getScaleForY(ry);
                runnerEl.setAttribute('transform', `translate(${rx},${ry + rBob}) scale(${rScale})`);
              }
            });
            currentFielderPos = { ...targetBaseCoords };
          }
          break;

        case 'runners_advance':
          // Runs the specified runners to their next base, and the batter to 1B
          const advancePromises = [];

          // Batter runs home -> 1B
          const bxStart = this.lerp(BATTER_HOME.x, BASE_POSITIONS['1b'].x, 0.5);
          const byStart = this.lerp(BATTER_HOME.y, BASE_POSITIONS['1b'].y, 0.5);
          advancePromises.push(this.animate(step.duration || 600, t => {
            const x = this.lerp(bxStart, BASE_POSITIONS['1b'].x, t);
            const y = this.lerp(byStart, BASE_POSITIONS['1b'].y, t);
            const scale = this.getScaleForY(y);
            playerG.setAttribute('transform', `translate(${x},${y}) scale(${scale})`);
          }));

          // Active runners
          step.runnerList.forEach(runnerId => {
            const runnerEl = document.getElementById(runnerId);
            if (runnerEl && runnerEl.getAttribute('opacity') === '1') {
              const baseFrom = runnerId.replace('runner-', '');
              let baseTo = 'home';
              if (baseFrom === '1b') baseTo = '2b';
              else if (baseFrom === '2b') baseTo = '3b';
              else if (baseFrom === '3b') baseTo = 'home';

              const startCoords = BASE_POSITIONS[baseFrom];
              const halfwayCoords = {
                x: this.lerp(startCoords.x, BASE_POSITIONS[baseTo].x, 0.5),
                y: this.lerp(startCoords.y, BASE_POSITIONS[baseTo].y, 0.5)
              };

              advancePromises.push(this.animate(step.duration || 600, t => {
                const x = this.lerp(halfwayCoords.x, BASE_POSITIONS[baseTo].x, t);
                const y = this.lerp(halfwayCoords.y, BASE_POSITIONS[baseTo].y, t);
                const bob = Math.sin(t * 10) * 1.5;
                const scale = this.getScaleForY(y);
                runnerEl.setAttribute('transform', `translate(${x},${y + bob}) scale(${scale})`);
              }));
            }
          });

          await Promise.all(advancePromises);
          break;
      }
    }
    
    // Show green SAFE tag on any player/runner that was active and is still visible
    activeElements.forEach(el => {
      if (el && el.getAttribute('opacity') !== '0') {
        this.showFloatingTag(el, 'SAFE', '#2ecc71');
      }
    });

    this.isAnimating = false;
  }
};

window.showFloatingTag = AnimationEngine.showFloatingTag.bind(AnimationEngine);
