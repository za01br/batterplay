// storage.js — localStorage CRUD for custom BatterPlay scenarios

const ScenarioStorage = {
  KEY: 'batterplay_custom_scenarios',

  getAll() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading scenarios from localStorage:', e);
      return [];
    }
  },

  save(scenario) {
    const scenarios = this.getAll();
    if (!scenario.id) {
      scenario.id = 'custom_' + Date.now();
      scenario.createdAt = Date.now();
      scenarios.push(scenario);
    } else {
      const index = scenarios.findIndex(s => s.id === scenario.id);
      if (index !== -1) {
        scenarios[index] = scenario;
      } else {
        scenarios.push(scenario);
      }
    }
    try {
      localStorage.setItem(this.KEY, JSON.stringify(scenarios));
      return scenario;
    } catch (e) {
      console.error('Error saving scenario to localStorage:', e);
      return null;
    }
  },

  delete(id) {
    let scenarios = this.getAll();
    scenarios = scenarios.filter(s => s.id !== id);
    try {
      localStorage.setItem(this.KEY, JSON.stringify(scenarios));
      return true;
    } catch (e) {
      console.error('Error deleting scenario from localStorage:', e);
      return false;
    }
  },

  get(id) {
    const scenarios = this.getAll();
    return scenarios.find(s => s.id === id) || null;
  },

  exportJSON() {
    const scenarios = this.getAll();
    return JSON.stringify(scenarios, null, 2);
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        throw new Error('Import data must be an array of scenarios');
      }
      
      // Basic validation and merge
      const currentScenarios = this.getAll();
      const mergedMap = new Map();
      currentScenarios.forEach(s => mergedMap.set(s.id, s));
      
      parsed.forEach(scenario => {
        if (scenario.id && scenario.title && scenario.question) {
          mergedMap.set(scenario.id, scenario);
        }
      });
      
      const merged = Array.from(mergedMap.values());
      localStorage.setItem(this.KEY, JSON.stringify(merged));
      return true;
    } catch (e) {
      console.error('Error importing scenarios:', e);
      alert('Failed to import scenarios: ' + e.message);
      return false;
    }
  }
};
