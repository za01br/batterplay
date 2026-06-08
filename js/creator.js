// creator.js — Logic for BatterPlay Scenario Creator screen

document.addEventListener('DOMContentLoaded', () => {
  populateDropdowns();
  loadSavedList();
  
  // Set initial SVG state
  onRoleChanged();
  onRunnersChanged();
});

// Populate hit presets from presets.js
function populateDropdowns() {
  const hitSelect = document.getElementById('scenario-hit-preset');
  if (hitSelect) {
    hitSelect.innerHTML = '';
    HIT_PRESETS.forEach(preset => {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.textContent = `${preset.name} (${preset.type.toUpperCase()})`;
      hitSelect.appendChild(opt);
    });
  }
}

// Populate outcome presets based on role
function populateOutcomes(role) {
  const outcomeSelect = document.getElementById('scenario-outcome-preset');
  if (!outcomeSelect) return;
  
  const currentVal = outcomeSelect.value;
  outcomeSelect.innerHTML = '';
  
  const allowedIds = ROLE_ALLOWED_OUTCOMES[role] || [];
  const allowedPresets = OUTCOME_PRESETS.filter(p => allowedIds.includes(p.id));
  
  allowedPresets.forEach(preset => {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = preset.name;
    outcomeSelect.appendChild(opt);
  });
  
  // Try to restore previous value if still valid
  if (allowedIds.includes(currentVal)) {
    outcomeSelect.value = currentVal;
  }
}

// Update the "YOU" glow and text indicator in the SVG
function onRoleChanged() {
  const role = document.getElementById('scenario-role').value;
  populateOutcomes(role);
  
  const glow = document.getElementById('you-glow');
  const text = document.getElementById('you-text');
  
  if (!glow || !text) return;
  
  // Detach if already attached somewhere
  glow.remove();
  text.remove();
  
  let parentG = null;
  let textY = -68;
  
  if (role === 'hitter') {
    parentG = document.getElementById('player');
    textY = -68;
  } else if (role === 'catcher') {
    parentG = document.getElementById('catcher');
    textY = -52;
  } else {
    const info = POSITION_COORDS[role];
    if (info) {
      parentG = document.getElementById(info.id);
    }
  }
  
  if (parentG) {
    parentG.appendChild(glow);
    parentG.appendChild(text);
    glow.setAttribute('opacity', '1');
    text.setAttribute('opacity', '1');
    text.setAttribute('y', String(textY));
  } else {
    glow.setAttribute('opacity', '0');
    text.setAttribute('opacity', '0');
  }
}

// Show/hide runners in SVG preview based on checkboxes
function onRunnersChanged() {
  const bases = ['1b', '2b', '3b'];
  const activeRunners = [];
  
  bases.forEach(base => {
    const check = document.getElementById(`runner-${base}-check`);
    if (check && check.checked) {
      activeRunners.push(base);
    }
  });
  
  AnimationEngine.setupBaseRunners(activeRunners);
}

// Run full scenario preview animation on the SVG field
async function previewPlay() {
  const btn = document.getElementById('preview-btn');
  if (btn) btn.disabled = true;
  
  const role = document.getElementById('scenario-role').value;
  const hitPresetId = document.getElementById('scenario-hit-preset').value;
  const outcomePresetId = document.getElementById('scenario-outcome-preset').value;
  
  const hitPreset = HIT_PRESETS.find(h => h.id === hitPresetId);
  const outcomePreset = OUTCOME_PRESETS.find(o => o.id === outcomePresetId);
  
  const runners = [];
  ['1b', '2b', '3b'].forEach(base => {
    const check = document.getElementById(`runner-${base}-check`);
    if (check && check.checked) runners.push(base);
  });
  
  if (!hitPreset || !outcomePreset) {
    if (btn) btn.disabled = false;
    return;
  }

  const tempScenario = {
    role,
    hitPresetId,
    outcomePresetId,
    runners
  };

  try {
    // 1. Run Pitch + Hit + Field
    await AnimationEngine.triggerPitch(role, hitPreset, runners, async () => {
      // 2. Wait a small moment to simulate quiz transition
      await AnimationEngine.wait(1200);
      
      // 3. Run Correct Action Play
      if (role === 'hitter') {
        // Hitter swing & contact
        await AnimationEngine.playHitterCorrectHit(hitPreset, async () => {
          await AnimationEngine.playOutcomeSteps(outcomePreset.steps, tempScenario);
        });
      } else {
        // Fielder correct play execution
        await AnimationEngine.playOutcomeSteps(outcomePreset.steps, tempScenario);
      }
      
      // Re-enable button & reset runners
      if (btn) btn.disabled = false;
      onRoleChanged();
      onRunnersChanged();
    });
  } catch (e) {
    console.error('Preview error:', e);
    if (btn) btn.disabled = false;
  }
}

// Save Scenario to storage
function saveScenario() {
  const title = document.getElementById('scenario-title').value.trim();
  const situation = document.getElementById('scenario-situation').value.trim();
  const details = document.getElementById('scenario-details').value.trim();
  const role = document.getElementById('scenario-role').value;
  const hitPresetId = document.getElementById('scenario-hit-preset').value;
  const outcomePresetId = document.getElementById('scenario-outcome-preset').value;
  
  const question = document.getElementById('scenario-question').value.trim();
  const choices = [
    document.getElementById('scenario-choice-0').value.trim(),
    document.getElementById('scenario-choice-1').value.trim(),
    document.getElementById('scenario-choice-2').value.trim()
  ];
  const correctIndex = parseInt(document.getElementById('scenario-correct').value, 10);
  const why = document.getElementById('scenario-why').value.trim();
  
  const runners = [];
  ['1b', '2b', '3b'].forEach(base => {
    const check = document.getElementById(`runner-${base}-check`);
    if (check && check.checked) runners.push(base);
  });

  if (!title || !situation || !details || !question || choices.some(c => !c) || !why) {
    alert('Please fill out all required fields.');
    return;
  }

  const id = document.getElementById('scenario-id').value || null;

  const scenario = {
    id,
    title,
    situation,
    details,
    role,
    runners,
    hitPresetId,
    outcomePresetId,
    question,
    choices,
    correctIndex,
    why
  };

  const saved = ScenarioStorage.save(scenario);
  if (saved) {
    alert('Drill saved successfully!');
    resetForm();
    loadSavedList();
  }
}

// Reset form to default states
function resetForm() {
  document.getElementById('scenario-id').value = '';
  document.getElementById('scenario-title').value = '';
  document.getElementById('scenario-situation').value = '';
  document.getElementById('scenario-details').value = '';
  document.getElementById('scenario-role').value = '3b';
  
  ['1b', '2b', '3b'].forEach(base => {
    const check = document.getElementById(`runner-${base}-check`);
    if (check) check.checked = false;
  });
  
  document.getElementById('scenario-hit-preset').selectedIndex = 0;
  document.getElementById('scenario-outcome-preset').selectedIndex = 0;
  
  document.getElementById('scenario-question').value = '';
  document.getElementById('scenario-choice-0').value = '';
  document.getElementById('scenario-choice-1').value = '';
  document.getElementById('scenario-choice-2').value = '';
  document.getElementById('scenario-correct').value = '0';
  document.getElementById('scenario-why').value = '';
  
  onRoleChanged();
  onRunnersChanged();
}

// Load and render saved custom list
function loadSavedList() {
  const container = document.getElementById('saved-scenarios-list');
  if (!container) return;
  
  const scenarios = ScenarioStorage.getAll();
  container.innerHTML = '';
  
  if (scenarios.length === 0) {
    container.innerHTML = '<div style="font-size: 8px; color: #777; text-align: center; padding: 10px;">NO SAVED DRILLS YET.</div>';
    return;
  }

  scenarios.forEach(s => {
    const div = document.createElement('div');
    div.className = 'saved-item';
    
    div.innerHTML = `
      <div class="saved-item-title">${s.title.toUpperCase()}: ${s.situation.toUpperCase()}</div>
      <div class="saved-item-actions">
        <button class="saved-btn saved-btn-green" onclick="editScenario('${s.id}')">EDIT</button>
        <button class="saved-btn saved-btn-red" onclick="deleteScenario('${s.id}')">DELETE</button>
      </div>
    `;
    
    container.appendChild(div);
  });
}

// Edit a saved scenario
function editScenario(id) {
  const s = ScenarioStorage.get(id);
  if (!s) return;
  
  const role = s.role === '3rd_base' ? '3b' : s.role;

  document.getElementById('scenario-id').value = s.id;
  document.getElementById('scenario-title').value = s.title;
  document.getElementById('scenario-situation').value = s.situation;
  document.getElementById('scenario-details').value = s.details;
  document.getElementById('scenario-role').value = role;
  
  // Update role dropdown & allowed outcomes before setting values
  onRoleChanged();
  
  ['1b', '2b', '3b'].forEach(base => {
    const check = document.getElementById(`runner-${base}-check`);
    if (check) {
      check.checked = s.runners.includes(base);
    }
  });
  
  document.getElementById('scenario-hit-preset').value = s.hitPresetId;
  document.getElementById('scenario-outcome-preset').value = s.outcomePresetId;
  
  document.getElementById('scenario-question').value = s.question;
  document.getElementById('scenario-choice-0').value = s.choices[0] || '';
  document.getElementById('scenario-choice-1').value = s.choices[1] || '';
  document.getElementById('scenario-choice-2').value = s.choices[2] || '';
  document.getElementById('scenario-correct').value = String(s.correctIndex);
  document.getElementById('scenario-why').value = s.why;
  
  // Sync preview field runners
  onRunnersChanged();
  
  // Scroll to form top on mobile/tablet
  document.getElementById('scenario-form').scrollIntoView({ behavior: 'smooth' });
}

// Delete scenario
function deleteScenario(id) {
  if (confirm('Are you sure you want to delete this custom drill?')) {
    if (ScenarioStorage.delete(id)) {
      loadSavedList();
      resetForm();
    }
  }
}

// Export custom drills to JSON
function exportDrills() {
  const jsonString = ScenarioStorage.exportJSON();
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'batterplay_drills.json';
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import custom drills from JSON
function importDrills(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    if (ScenarioStorage.importJSON(content)) {
      alert('Custom drills imported successfully!');
      loadSavedList();
      resetForm();
    }
  };
  reader.readAsText(file);
}
