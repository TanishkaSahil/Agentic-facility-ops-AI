// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  // Elements Selection
  const searchInput = document.getElementById('search-input');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const agentCards = document.querySelectorAll('.agent-card');
  const listViewBtn = document.getElementById('list-view-btn');
  const gridViewBtn = document.getElementById('grid-view-btn');
  const modulesContainer = document.getElementById('modules-container');
  const locationDd = document.getElementById('location-dd');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const askAiBtn = document.getElementById('ask-ai-btn');

  // Modals Selection
  const detailModal = document.getElementById('detail-modal');
  const detailModalClose = document.getElementById('detail-modal-close');
  const modalOkBtn = document.getElementById('modal-ok-btn');
  const pauseAgentBtn = document.getElementById('pause-agent-btn');
  const modalTitle = document.getElementById('modal-agent-title');
  const modalDesc = document.getElementById('modal-agent-desc');
  const consoleLogs = document.getElementById('console-logs');

  const addModuleBtn = document.getElementById('add-module-btn');
  const addModal = document.getElementById('add-modal');
  const addModalClose = document.getElementById('add-modal-close');
  const addModalCancel = document.getElementById('add-modal-cancel');
  const newAgentForm = document.getElementById('new-agent-form');

  // Counters
  const valModules = document.getElementById('val-modules');

  // 1. Entrance animation sequence for agent cards
  setTimeout(() => {
    animateCards();
  }, 100);

  function animateCards() {
    const visibleCards = document.querySelectorAll('.agent-card:not(.hidden-by-filter)');
    visibleCards.forEach((card, index) => {
      card.classList.remove('loaded');
      setTimeout(() => {
        card.classList.add('loaded');
      }, index * 100);
    });
  }

  // 2. Search filtering logic
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterModules();
    });

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // 3. Tab switching & filtering logic
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterModules();
    });
  });

  function filterModules() {
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeTab = document.querySelector('.tab-btn.active');
    const filterValue = activeTab ? activeTab.getAttribute('data-filter') : 'all';

    const cards = document.querySelectorAll('.agent-card');
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('h3').textContent.toLowerCase();
      const cardDesc = card.querySelector('.description').textContent.toLowerCase();
      
      const categoryMatch = (filterValue === 'all' || cardCategory === filterValue);
      const searchMatch = (cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery));

      if (categoryMatch && searchMatch) {
        card.style.display = '';
        card.classList.remove('hidden-by-filter');
      } else {
        card.style.display = 'none';
        card.classList.add('hidden-by-filter');
        card.classList.remove('loaded');
      }
    });

    animateCards();
  }

  // 4. Grid vs List toggling view
  if (listViewBtn && gridViewBtn && modulesContainer) {
    listViewBtn.addEventListener('click', () => {
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      modulesContainer.classList.remove('grid-layout');
      modulesContainer.classList.add('list-layout');
      
      // Re-trigger layout load animation
      animateCards();
    });

    gridViewBtn.addEventListener('click', () => {
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      modulesContainer.classList.remove('list-layout');
      modulesContainer.classList.add('grid-layout');
      
      // Re-trigger layout load animation
      animateCards();
    });
  }

  // 5. Location dropdown toggle click
  if (locationDd) {
    const trigger = locationDd.querySelector('.dropdown-trigger');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      locationDd.classList.toggle('active');
    });

    // Close on clicking outside
    document.addEventListener('click', () => {
      locationDd.classList.remove('active');
    });
  }

  // 6. Hamburger Menu toggle on Mobile
  if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
  }

  // 7. Interactive Diagnostics Details Modal Logic
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-detail')) {
      const agentName = e.target.getAttribute('data-agent');
      const card = e.target.closest('.agent-card');
      const agentDesc = card.querySelector('.description').textContent;
      
      openDiagnosticsModal(agentName, agentDesc);
    }
  });

  let diagnosticInterval;
  
  function openDiagnosticsModal(name, desc) {
    modalTitle.textContent = `${name} Subsystem`;
    modalDesc.textContent = desc;
    pauseAgentBtn.textContent = 'Pause Agent';
    pauseAgentBtn.className = 'btn btn-secondary btn-modal-action';
    
    // Clear old console logs
    consoleLogs.textContent = '';
    detailModal.classList.add('active');

    // Simulate real-time streaming log data
    const logs = [
      `[INFO] Initializing handshake with agent interface...`,
      `[INFO] Connected to telemetry sensors (V1.42.0)`,
      `[OK] Diagnostics handshake succeeded. System state: GREEN`,
      `[TELEMETRY] Scanning facility zones for anomalies...`,
      `[OPTIMIZER] Executing deep neural network recommendation pipeline...`,
      `[LOG] CPU temperature: 48°C | GPU utilization: 12.8%`,
      `[OK] Applying operational setpoint recommendations...`,
      `[OK] Savings coefficients recalculated. Yield optimized by +1.4%`
    ];

    let logIdx = 0;
    
    const writeLog = () => {
      if (logIdx < logs.length) {
        consoleLogs.textContent += logs[logIdx] + '\n';
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
        logIdx++;
      } else {
        // Continuous mock log output
        const randomTelemetry = [
          `[OK] Heartbeat ping ok (12ms)`,
          `[LOG] Buffer state: Nominal (11% capacity)`,
          `[OPTIMIZER] Re-weighting node variables based on building load...`,
          `[TELEMETRY] Ambient heat load check: 24.2°C`,
          `[INFO] Sensor stream calibration complete.`
        ];
        const randomLog = randomTelemetry[Math.floor(Math.random() * randomTelemetry.length)];
        consoleLogs.textContent += `${new Date().toLocaleTimeString()} ${randomLog}\n`;
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
      }
    };

    // Fast initial print
    writeLog();
    diagnosticInterval = setInterval(writeLog, 800);
  }

  function closeDiagnosticsModal() {
    detailModal.classList.remove('active');
    clearInterval(diagnosticInterval);
  }

  if (detailModalClose) detailModalClose.addEventListener('click', closeDiagnosticsModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeDiagnosticsModal);

  // Close modals on clicking outside of dialog card
  window.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDiagnosticsModal();
    if (e.target === addModal) closeAddModal();
  });

  // Pause/Resume agent simulation
  if (pauseAgentBtn) {
    pauseAgentBtn.addEventListener('click', () => {
      if (pauseAgentBtn.textContent === 'Pause Agent') {
        pauseAgentBtn.textContent = 'Resume Agent';
        pauseAgentBtn.className = 'btn btn-primary btn-modal-action';
        consoleLogs.textContent += `\n[WARNING] SYSTEM SUSPENDED BY MANAGER\n[TELEMETRY] Streaming paused.`;
        clearInterval(diagnosticInterval);
      } else {
        pauseAgentBtn.textContent = 'Pause Agent';
        pauseAgentBtn.className = 'btn btn-secondary btn-modal-action';
        consoleLogs.textContent += `\n[INFO] SYSTEM RESUMED BY MANAGER\n`;
        diagnosticInterval = setInterval(() => {
          consoleLogs.textContent += `${new Date().toLocaleTimeString()} [OK] Resumed streaming sensors...\n`;
          consoleLogs.scrollTop = consoleLogs.scrollHeight;
        }, 800);
      }
    });
  }

  // 8. Add New Module Modal Logic
  if (addModuleBtn) {
    addModuleBtn.addEventListener('click', () => {
      addModal.classList.add('active');
    });
  }

  function closeAddModal() {
    addModal.classList.remove('active');
    if (newAgentForm) newAgentForm.reset();
  }

  if (addModalClose) addModalClose.addEventListener('click', closeAddModal);
  if (addModalCancel) addModalCancel.addEventListener('click', closeAddModal);

  // Deploy New Agent Form Submit
  if (newAgentForm) {
    newAgentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('new-agent-name').value;
      const desc = document.getElementById('new-agent-desc').value;
      const category = document.getElementById('new-agent-cat').value;

      // Create new agent card element
      const newCard = document.createElement('div');
      newCard.className = 'agent-card active-card';
      newCard.setAttribute('data-category', category);
      
      // Determine colors & details based on category
      let categoryColor = 'purple';
      let avatarSVG = `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`;
      
      if (category === 'operations') {
        categoryColor = 'orange';
        avatarSVG = `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`;
      } else if (category === 'maintenance') {
        categoryColor = 'blue';
        avatarSVG = `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`;
      } else if (category === 'sustainability') {
        categoryColor = 'green';
        avatarSVG = `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`;
      }

      const activeCount = parseInt(valModules.textContent) + 1;

      newCard.innerHTML = `
        <div class="agent-summary flex align-center">
          <div class="agent-icon-col">
            <div class="agent-avatar-circle ${categoryColor}-glow">
              <svg class="text-${categoryColor}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${avatarSVG}</svg>
            </div>
            <span class="status-badge active-badge">Active</span>
          </div>
          
          <div class="agent-info-col">
            <div class="title-row flex align-center justify-between">
              <h3>5. ${name}</h3>
              <span class="card-status-dot flex align-center gap-1">
                <span class="running-pulse green-pulse"></span>
                Running
              </span>
            </div>
            <p class="description">${desc}</p>
            <ul class="features-list grid">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-${categoryColor}"><polyline points="20 6 9 17 4 12"/></svg> Automated Analysis</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-${categoryColor}"><polyline points="20 6 9 17 4 12"/></svg> AI Decision Pipeline</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-${categoryColor}"><polyline points="20 6 9 17 4 12"/></svg> Real-time Alerts</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-${categoryColor}"><polyline points="20 6 9 17 4 12"/></svg> Operations Log</li>
            </ul>
          </div>

          <div class="agent-metrics-col">
            <span class="metrics-heading">This Month</span>
            <div class="metric-row flex justify-between">
              <span class="metric-value text-${categoryColor}">Active</span>
              <span class="metric-desc">Operational Health</span>
            </div>
            <div class="metric-row flex justify-between">
              <span class="metric-value font-dark">100%</span>
              <span class="metric-desc">Accuracy Gain</span>
            </div>
            <div class="metric-row flex justify-between">
              <span class="metric-value font-dark">Normal</span>
              <span class="metric-desc">Load Level</span>
            </div>
          </div>

          <div class="agent-chart-col">
            <svg class="sparkline-chart" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="chart-grad-${categoryColor}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--secondary-color)" stop-opacity="0.3" />
                  <stop offset="100%" stop-color="var(--secondary-color)" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 35 Q 20 28, 40 32 T 70 12 T 100 20 L 100 40 L 0 40 Z" fill="url(#chart-grad-${categoryColor})" />
              <path d="M 0 35 Q 20 28, 40 32 T 70 12 T 100 20" fill="none" stroke="var(--primary-color)" stroke-width="2" />
              <circle cx="100" cy="20" r="3" fill="var(--primary-color)" />
            </svg>
          </div>

          <div class="agent-actions-col flex align-center gap-2">
            <button class="btn btn-secondary btn-detail" data-agent="${name}">View Details</button>
            <button class="icon-menu-btn" aria-label="More Options">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </div>
        </div>
      `;

      // Append to list and play anim
      modulesContainer.appendChild(newCard);
      
      // Update header Active count
      valModules.textContent = activeCount;

      closeAddModal();
      
      // Filter list again to keep active tab consistent
      filterModules();
      
      // Smooth scroll to the newly created module
      setTimeout(() => {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Create pulse effect border highlight
        newCard.style.outline = `2px solid var(--primary-color)`;
        newCard.style.outlineOffset = `4px`;
        setTimeout(() => {
          newCard.style.outline = 'none';
        }, 1500);
      }, 500);
    });
  }

  // 9. AI Assistant simulation
  if (askAiBtn) {
    askAiBtn.addEventListener('click', () => {
      const questions = [
        "How is the Energy Agent performing today?",
        "Are there any open work orders for Maintenance?",
        "What is the current space utilization in the Head Office?",
        "Has the Security Agent raised any alerts in the last hour?"
      ];
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      
      const query = prompt("OpsAgent Assistant. Ask a question about facility operations:\n\nSample suggestions:\n- " + questions.join("\n- "), randomQ);
      
      if (query) {
        let answer = `Analyzing prompt "${query}"...\n\n`;
        if (query.toLowerCase().includes('energy')) {
          answer += `The Energy Agent reports 12.4% savings this month (on track to exceed target of 10%). Peak demand occurs around 2 PM; optimization algorithms are actively adjusting chiller variables.`;
        } else if (query.toLowerCase().includes('maintenance') || query.toLowerCase().includes('work order')) {
          answer += `The Maintenance Agent closed 156 work orders this month. Preventive maintenance task PM-309 is scheduled for HVAC unit 4 at 10 AM tomorrow.`;
        } else if (query.toLowerCase().includes('space') || query.toLowerCase().includes('utilization') || query.toLowerCase().includes('occupancy')) {
          answer += `Occupancy levels average 65% utilization. High density detected in Room 204. Recommending cooling flow adjustment to Zone B.`;
        } else if (query.toLowerCase().includes('security') || query.toLowerCase().includes('alert')) {
          answer += `Security Agent reports zero active anomalies. All camera streams and access nodes are scanning normally. System health is 99.8%.`;
        } else {
          answer += `Handled via LLM pipeline:\n\nAll agents are running smoothly. Active count is ${valModules.textContent}. Efficiency gains are averaging 12.4% month-to-date.`;
        }
        alert(answer);
      }
    });
  }
});
