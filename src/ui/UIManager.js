import confetti from 'canvas-confetti';
import { PHASES, NAV_LINKS, COMPANY_INFO } from './ContentData.js';
import { sound } from '../audio/SoundEffects.js';

export class UIManager {
  constructor(world) {
    this.world = world;
    this.currentPhaseId = 1;
    this.isPlaying = false;
    this.playInterval = null;

    this.initDOMElements();
    this.bindEvents();
    this.renderPhase(PHASES[0]);
  }

  initDOMElements() {
    this.phaseCard = document.getElementById('phase-card');
    this.phaseBadge = document.getElementById('phase-badge');
    this.phaseTitle = document.getElementById('phase-title');
    this.phaseDesc = document.getElementById('phase-desc');
    this.phaseSpecs = document.getElementById('phase-specs');
    this.phaseCta = document.getElementById('phase-cta');
    this.phaseSecBtn = document.getElementById('phase-sec-btn');

    this.progressFill = document.getElementById('timeline-progress-bar');
    this.progressPercent = document.getElementById('timeline-percent');
    this.timelineNodes = document.querySelectorAll('.timeline-node');

    this.btnOrbit = document.getElementById('btn-orbit-toggle');
    this.btnBlueprint = document.getElementById('btn-blueprint-toggle');
    this.btnLighting = document.getElementById('btn-lighting-toggle');
    this.btnAudio = document.getElementById('btn-audio-toggle');
    this.btnAutoPlay = document.getElementById('btn-autoplay');

    this.hotspotModal = document.getElementById('hotspot-modal');
    this.hotspotTitle = document.getElementById('hotspot-modal-title');
    this.hotspotCategory = document.getElementById('hotspot-modal-category');
    this.hotspotDesc = document.getElementById('hotspot-modal-desc');
    this.hotspotSpecs = document.getElementById('hotspot-modal-specs');
    this.hotspotClose = document.getElementById('hotspot-modal-close');

    this.quoteModal = document.getElementById('quote-modal');
    this.btnOpenQuote = document.getElementById('btn-open-quote');
    this.btnCloseQuote = document.getElementById('quote-modal-close');
    this.quoteForm = document.getElementById('quote-form');
    this.quoteResult = document.getElementById('quote-result');
  }

  bindEvents() {
    // Timeline node clicks
    this.timelineNodes.forEach((node) => {
      node.addEventListener('click', () => {
        sound.playClick(580, 0.04);
        const targetP = parseFloat(node.getAttribute('data-target'));
        this.scrollToProgress(targetP);
      });
    });

    // Primary CTA click
    if (this.phaseCta) {
      this.phaseCta.addEventListener('click', () => {
        sound.playClick(620, 0.05);
        const nextId = (this.currentPhaseId % PHASES.length) + 1;
        const nextPhase = PHASES.find(p => p.id === nextId);
        if (nextPhase) {
          this.scrollToProgress(nextPhase.range[0]);
        }
      });
    }

    if (this.phaseSecBtn) {
      this.phaseSecBtn.addEventListener('click', () => {
        sound.playClick();
        this.openQuoteModal();
      });
    }

    // Orbit Controls toggle
    if (this.btnOrbit) {
      this.btnOrbit.addEventListener('click', () => {
        const isFree = !this.world.isFreeOrbit;
        this.world.setFreeOrbit(isFree);
        this.btnOrbit.classList.toggle('active', isFree);
        this.btnOrbit.querySelector('.toggle-label').textContent = isFree ? 'Free 3D Orbit (Active)' : 'Guided Tour';
        sound.playClick(isFree ? 650 : 450);
      });
    }

    // Blueprint toggle
    if (this.btnBlueprint) {
      this.btnBlueprint.addEventListener('click', () => {
        const isBp = this.world.toggleBlueprintMode();
        this.btnBlueprint.classList.toggle('active', isBp);
        sound.playClick(isBp ? 700 : 500);
      });
    }

    // Lighting preset toggle
    if (this.btnLighting) {
      const presets = ['day', 'sunset', 'night'];
      let lightIdx = 0;
      this.btnLighting.addEventListener('click', () => {
        lightIdx = (lightIdx + 1) % presets.length;
        const mode = presets[lightIdx];
        this.world.setLightingPreset(mode);
        this.btnLighting.querySelector('.toggle-label').textContent = mode.toUpperCase();
        sound.playClick(600);
      });
    }

    // Audio toggle
    if (this.btnAudio) {
      this.btnAudio.addEventListener('click', () => {
        const enabled = sound.toggle();
        this.btnAudio.classList.toggle('active', enabled);
        this.btnAudio.querySelector('.toggle-label').textContent = enabled ? 'Sound: ON' : 'Sound: OFF';
      });
    }

    // Autoplay toggle
    if (this.btnAutoPlay) {
      this.btnAutoPlay.addEventListener('click', () => {
        this.toggleAutoplay();
      });
    }

    // Hotspot modal close
    if (this.hotspotClose) {
      this.hotspotClose.addEventListener('click', () => {
        this.hotspotModal.classList.remove('visible');
        sound.playClick(450);
      });
    }

    // Quote Modal
    if (this.btnOpenQuote) {
      this.btnOpenQuote.addEventListener('click', () => {
        this.openQuoteModal();
      });
    }

    if (this.btnCloseQuote) {
      this.btnCloseQuote.addEventListener('click', () => {
        this.quoteModal.classList.remove('visible');
        sound.playClick(450);
      });
    }

    if (this.quoteForm) {
      this.quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.calculateEstimate();
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        const nextP = Math.min(1, this.world.timeline.targetProgress + 0.166);
        this.scrollToProgress(nextP);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevP = Math.max(0, this.world.timeline.targetProgress - 0.166);
        this.scrollToProgress(prevP);
      }
    });
  }

  showHotspotDetails(hotspot) {
    if (!this.hotspotModal) return;
    this.hotspotTitle.textContent = hotspot.name;
    this.hotspotCategory.textContent = hotspot.category;
    this.hotspotDesc.textContent = hotspot.description;
    this.hotspotSpecs.textContent = hotspot.specs;
    this.hotspotModal.classList.add('visible');
  }

  openQuoteModal() {
    if (!this.quoteModal) return;
    sound.playClick(600);
    this.quoteModal.classList.add('visible');
  }

  calculateEstimate() {
    const area = parseFloat(document.getElementById('calc-area').value) || 15000;
    const type = document.getElementById('calc-type').value;

    const rateMap = {
      'warehouse': 1400,
      'office': 2600,
      'hybrid': 2100,
      'intermodal': 1850
    };

    const rate = rateMap[type] || 2000;
    const estTotal = (area * rate).toLocaleString();
    const estDuration = Math.round(12 + (area / 3000));
    const steelTons = Math.round(area * 0.12).toLocaleString();

    this.quoteResult.innerHTML = `
      <div class="result-box">
        <div class="result-stat">
          <span class="label">Estimated Budget Range</span>
          <span class="val">$${estTotal} USD</span>
        </div>
        <div class="result-stat">
          <span class="label">Turnkey Delivery Window</span>
          <span class="val">${estDuration} Months</span>
        </div>
        <div class="result-stat">
          <span class="label">Fabricated Structural Steel</span>
          <span class="val">${steelTons} Metric Tons</span>
        </div>
        <div class="result-stat">
          <span class="label">Target ESG Standard</span>
          <span class="val">LEED Platinum & Net-Zero Ready</span>
        </div>
      </div>
      <button class="btn-primary" style="margin-top: 14px; width: 100%;" id="btn-request-consult">Submit Engineering Consultation RFP</button>
    `;

    document.getElementById('btn-request-consult').addEventListener('click', () => {
      sound.playCelebration();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
      alert('Thank you! Our engineering directorship will contact you within 2 business hours.');
      this.quoteModal.classList.remove('visible');
    });
  }

  scrollToProgress(targetP) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = targetP * maxScroll;
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  toggleAutoplay() {
    this.isPlaying = !this.isPlaying;
    this.btnAutoPlay.classList.toggle('active', this.isPlaying);
    this.btnAutoPlay.querySelector('.toggle-label').textContent = this.isPlaying ? 'Auto: ON' : 'Auto: OFF';

    if (this.isPlaying) {
      sound.playClick(720);
      this.playInterval = setInterval(() => {
        let currentP = this.world.timeline.targetProgress;
        currentP += 0.003;
        if (currentP > 1.0) currentP = 0;
        this.scrollToProgress(currentP);
      }, 50);
    } else {
      clearInterval(this.playInterval);
      sound.playClick(480);
    }
  }

  onScrollUpdate(progress) {
    // 1. Update Timeline Scrubber
    const percent = Math.round(progress * 100);
    if (this.progressFill) {
      this.progressFill.style.width = `${percent}%`;
    }
    if (this.progressPercent) {
      this.progressPercent.textContent = `${percent}%`;
    }

    // 2. Identify Current Phase
    let activePhase = PHASES[0];
    for (let i = 0; i < PHASES.length; i++) {
      const p = PHASES[i];
      if (progress >= p.range[0] && progress <= p.range[1]) {
        activePhase = p;
        break;
      }
    }

    if (activePhase.id !== this.currentPhaseId) {
      this.currentPhaseId = activePhase.id;
      this.renderPhase(activePhase);

      // Trigger celebration confetti on reaching completed stage
      if (activePhase.id === 6 && percent >= 98) {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.65 }
        });
        sound.playCelebration();
      }
    }

    // 3. Highlight Timeline Nodes
    this.timelineNodes.forEach((node, idx) => {
      const nodePhaseId = idx + 1;
      if (nodePhaseId === this.currentPhaseId) {
        node.classList.add('active');
      } else if (nodePhaseId < this.currentPhaseId) {
        node.classList.add('completed');
        node.classList.remove('active');
      } else {
        node.classList.remove('active', 'completed');
      }
    });
  }

  renderPhase(phase) {
    if (!this.phaseCard) return;

    this.phaseBadge.textContent = phase.subInfo;
    this.phaseBadge.style.borderColor = phase.badgeColor;
    this.phaseTitle.textContent = phase.title;
    this.phaseDesc.textContent = phase.description;
    this.phaseCta.textContent = phase.ctaText;

    // Render Specs
    this.phaseSpecs.innerHTML = phase.specs.map(spec => `
      <div class="spec-item">
        <span class="spec-label">${spec.label}</span>
        <span class="spec-val">${spec.val}</span>
      </div>
    `).join('');

    // Micro animation on phase change
    this.phaseCard.classList.remove('pulse-enter');
    void this.phaseCard.offsetWidth; // Trigger reflow
    this.phaseCard.classList.add('pulse-enter');
  }
}
