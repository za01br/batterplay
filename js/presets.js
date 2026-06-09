// presets.js — Baseball hit and outcome presets for BatterPlay

// Defensive positions coordinate mapping
const POSITION_COORDS = {
  'pitcher': { x: 160, y: 152, id: 'pitcher' },
  'catcher': { x: 160, y: 282, id: 'catcher' },
  '1b': { x: 240, y: 172, id: 'fielder-1b' },
  '2b': { x: 218, y: 108, id: 'fielder-2b' },
  '3b': { x: 78, y: 172, id: 'fielder-3b' },
  'ss': { x: 105, y: 85, id: 'fielder-ss' },
  'lf': { x: 45, y: 25, id: 'fielder-lf' },
  'cf': { x: 160, y: -15, id: 'fielder-cf' },
  'rf': { x: 275, y: 25, id: 'fielder-rf' }
};

const BASE_COORDS = {
  'home': { x: 148, y: 258 },
  '1b': { x: 262, y: 152 },
  '2b': { x: 160, y: 50 },
  '3b': { x: 58, y: 152 }
};

const ROLE_ALLOWED_OUTCOMES = {
  'hitter': ['runner_scores_3b', 'runner_advances_3b', 'runners_advance_all', 'batter_safe_1b', 'runner_scores_2b', 'throw_1b_out_runners_advance', 'throw_1b_out_runners_hold'],
  'pitcher': ['throw_1b_out', 'throw_2b_out', 'throw_3b_out', 'throw_home_out', 'tag_runner_between_bases', 'double_play_163', 'throw_1b_out_runners_hold', 'throw_1b_out_runners_advance'],
  'catcher': ['throw_1b_out', 'throw_2b_out', 'throw_3b_out', 'step_on_home', 'tag_runner_at_home', 'throw_1b_out_runners_hold'],
  '1b': ['step_on_1b', 'tag_runner_at_1b', 'throw_2b_out', 'throw_3b_out', 'throw_home_out', 'double_play_363', 'throw_1b_out_runners_hold'],
  '2b': ['step_on_2b', 'tag_runner_at_2b', 'throw_1b_out', 'throw_3b_out', 'throw_home_out', 'double_play_463', 'throw_1b_out_runners_hold', 'throw_1b_out_runners_advance'],
  'ss': ['step_on_2b', 'tag_runner_at_2b', 'throw_1b_out', 'throw_3b_out', 'throw_home_out', 'double_play_643', 'throw_1b_out_runners_hold', 'throw_1b_out_runners_advance'],
  '3b': ['step_on_3b', 'tag_runner_at_3b', 'throw_1b_out', 'throw_2b_out', 'throw_home_out', 'double_play_543', 'throw_1b_out_runners_hold'],
  'lf': ['catch_fly_ball', 'throw_2b_out', 'throw_3b_out', 'throw_home_out', 'runners_advance_all', 'outfielder_throw_cutoff'],
  'cf': ['catch_fly_ball', 'throw_2b_out', 'throw_3b_out', 'throw_home_out', 'runners_advance_all', 'outfielder_throw_cutoff'],
  'rf': ['catch_fly_ball', 'throw_1b_out', 'throw_2b_out', 'throw_home_out', 'runners_advance_all', 'outfielder_throw_cutoff']
};

const HIT_PRESETS = [
  // Grounders
  { id: 'grounder_p', name: 'Grounder to Pitcher', type: 'grounder', coords: { x: 160, y: 152 }, fielderId: 'pitcher', details: 'Grounder right back to the mound!' },
  { id: 'grounder_1b', name: 'Grounder to 1B', type: 'grounder', coords: { x: 240, y: 172 }, fielderId: 'fielder-1b', details: 'Sharp grounder down the 1st base line!' },
  { id: 'grounder_2b', name: 'Grounder to 2B', type: 'grounder', coords: { x: 218, y: 108 }, fielderId: 'fielder-2b', details: 'Grounder to the right side of the infield!' },
  { id: 'grounder_ss', name: 'Grounder to SS', type: 'grounder', coords: { x: 105, y: 85 }, fielderId: 'fielder-ss', details: 'Grounder deep in the hole at shortstop!' },
  { id: 'grounder_3b', name: 'Grounder to 3B', type: 'grounder', coords: { x: 74, y: 155 }, fielderId: 'fielder-3b', details: 'Hard grounder to 3rd base!' },

  // Pop-Ups
  { id: 'popup_p', name: 'Pop-Up to Pitcher', type: 'popup', coords: { x: 160, y: 140 }, fielderId: 'pitcher', details: 'High pop fly over the mound!' },
  { id: 'popup_c', name: 'Pop-Up to Catcher', type: 'popup', coords: { x: 160, y: 270 }, fielderId: 'catcher', details: 'Sky-high pop-up behind home plate!' },
  { id: 'popup_1b', name: 'Pop-Up to 1B', type: 'popup', coords: { x: 240, y: 165 }, fielderId: 'fielder-1b', details: 'Pop-up along the first base line!' },
  { id: 'popup_2b', name: 'Pop-Up to 2B', type: 'popup', coords: { x: 218, y: 100 }, fielderId: 'fielder-2b', details: 'Pop-up in shallow right-center!' },
  { id: 'popup_ss', name: 'Pop-Up to SS', type: 'popup', coords: { x: 105, y: 80 }, fielderId: 'fielder-ss', details: 'Pop-up near the shortstop position!' },
  { id: 'popup_3b', name: 'Pop-Up to 3B', type: 'popup', coords: { x: 74, y: 150 }, fielderId: 'fielder-3b', details: 'Pop-up on the left side of the infield!' },

  // Fly Balls
  { id: 'fly_lf', name: 'Fly Ball to LF', type: 'fly', coords: { x: 45, y: 25 }, fielderId: 'fielder-lf', details: 'Fly ball to deep left field!' },
  { id: 'fly_lcf', name: 'Fly Ball to LCF', type: 'fly', coords: { x: 110, y: -5 }, fielderId: 'fielder-cf', details: 'Fly ball to left-center gap!' },
  { id: 'fly_cf', name: 'Fly Ball to CF', type: 'fly', coords: { x: 160, y: -15 }, fielderId: 'fielder-cf', details: 'Deep drive to straightaway center field!' },
  { id: 'fly_rcf', name: 'Fly Ball to RCF', type: 'fly', coords: { x: 210, y: -5 }, fielderId: 'fielder-cf', details: 'Fly ball to right-center gap!' },
  { id: 'fly_rf', name: 'Fly Ball to RF', type: 'fly', coords: { x: 275, y: 25 }, fielderId: 'fielder-rf', details: 'High fly ball to deep right field!' },

  // Line Drives
  { id: 'liner_lf', name: 'Line Drive to LF', type: 'liner', coords: { x: 45, y: 25 }, fielderId: 'fielder-lf', details: 'Line drive single to left field!' },
  { id: 'liner_cf', name: 'Line Drive to CF', type: 'liner', coords: { x: 160, y: -15 }, fielderId: 'fielder-cf', details: 'Rope to center field!' },
  { id: 'liner_rf', name: 'Line Drive to RF', type: 'liner', coords: { x: 275, y: 25 }, fielderId: 'fielder-rf', details: 'Liner to right field!' },
  { id: 'liner_mid', name: 'Line Drive up Middle', type: 'liner', coords: { x: 160, y: 108 }, fielderId: 'fielder-2b', details: 'Liner right past the pitcher\'s head!' },

  // Bunts
  { id: 'bunt_3b', name: 'Bunt to 3B side', type: 'bunt', coords: { x: 120, y: 230 }, fielderId: 'fielder-3b', details: 'Soft bunt down the third base line!' },
  { id: 'bunt_1b', name: 'Bunt to 1B side', type: 'bunt', coords: { x: 180, y: 230 }, fielderId: 'fielder-1b', details: 'Soft bunt down the first base line!' },
  { id: 'bunt_p', name: 'Bunt to Pitcher', type: 'bunt', coords: { x: 155, y: 210 }, fielderId: 'pitcher', details: 'Bunt right back to the mound!' }
];

const OUTCOME_PRESETS = [
  // Throws
  {
    id: 'throw_1b_out',
    name: 'Throw to 1B for out',
    type: 'throw',
    description: 'Fielder throws to 1st base to retire the batter-runner.',
    steps: [
      { type: 'status', text: 'THROWING TO 1ST BASE FOR THE OUT!' },
      { type: 'ball_throw', targetBase: '1b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 8 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT 1ST BASE! BATTER IS RETIRED!' }
    ]
  },
  {
    id: 'throw_2b_out',
    name: 'Throw to 2B for force',
    type: 'throw',
    description: 'Fielder throws to 2nd base to get the lead runner.',
    steps: [
      { type: 'status', text: 'THROWING TO 2ND BASE FOR THE FORCE OUT!' },
      { type: 'ball_throw', targetBase: '2b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '2b' },
      { type: 'dust', base: '2b', count: 8 },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT 2ND BASE! FORCE OUT!' }
    ]
  },
  {
    id: 'throw_3b_out',
    name: 'Throw to 3B for force',
    type: 'throw',
    description: 'Fielder throws to 3rd base to get the lead runner.',
    steps: [
      { type: 'status', text: 'THROWING TO 3RD BASE FOR THE FORCE OUT!' },
      { type: 'ball_throw', targetBase: '3b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '3b' },
      { type: 'dust', base: '3b', count: 8 },
      { type: 'runner_out', runnerId: 'runner-2b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT 3RD BASE! FORCE OUT!' }
    ]
  },
  {
    id: 'throw_home_out',
    name: 'Throw Home for out',
    type: 'throw',
    description: 'Fielder throws to Home plate to get the runner scoring.',
    steps: [
      { type: 'status', text: 'THROWING TO HOME PLATE!' },
      { type: 'ball_throw', targetBase: 'home', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: 'home' },
      { type: 'dust', base: 'home', count: 8 },
      { type: 'runner_out', runnerId: 'runner-3b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT THE PLATE! GREAT THROW!' }
    ]
  },

  // Steps/Touches
  {
    id: 'step_on_1b',
    name: 'Step on 1B',
    type: 'force',
    description: 'Fielder runs to step on 1st base for the force out.',
    steps: [
      { type: 'status', text: 'RUNNING TO TOUCH 1ST BASE!' },
      { type: 'fielder_move', targetBase: '1b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 10 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'FORCE OUT AT 1ST BASE!' }
    ]
  },
  {
    id: 'step_on_2b',
    name: 'Step on 2B',
    type: 'force',
    description: 'Fielder runs to step on 2nd base for the force out.',
    steps: [
      { type: 'status', text: 'RUNNING TO TOUCH 2ND BASE!' },
      { type: 'fielder_move', targetBase: '2b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '2b' },
      { type: 'dust', base: '2b', count: 10 },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'FORCE OUT AT 2ND BASE!' }
    ]
  },
  {
    id: 'step_on_3b',
    name: 'Step on 3B',
    type: 'force',
    description: 'Fielder runs to step on 3rd base for the force out.',
    steps: [
      { type: 'status', text: 'RUNNING TO TOUCH 3RD BASE!' },
      { type: 'fielder_move', targetBase: '3b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '3b' },
      { type: 'dust', base: '3b', count: 10 },
      { type: 'runner_out', runnerId: 'runner-2b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'FORCE OUT AT 3RD BASE!' }
    ]
  },
  {
    id: 'step_on_home',
    name: 'Step on Home',
    type: 'force',
    description: 'Catcher steps on Home plate for the force out.',
    steps: [
      { type: 'status', text: 'CATCHER TOUCHES HOME PLATE!' },
      { type: 'fielder_move_role', role: 'catcher', targetBase: 'home', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: 'home' },
      { type: 'dust', base: 'home', count: 10 },
      { type: 'runner_out', runnerId: 'runner-3b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'FORCE OUT AT HOME!' }
    ]
  },

  // Tags
  {
    id: 'tag_runner_at_3b',
    name: 'Tag runner at 3B',
    type: 'tag',
    description: 'Fielder tags the runner advancing to 3rd base.',
    steps: [
      { type: 'status', text: 'TAGGING THE RUNNER AT 3RD BASE!' },
      { type: 'fielder_tag_runner', runnerId: 'runner-2b', base: '3b', duration: 500 },
      { type: 'tag_sound' },
      { type: 'dust_runner', runnerId: 'runner-2b', count: 12 },
      { type: 'runner_out', runnerId: 'runner-2b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT 3RD BASE! STEAL PREVENTED!' }
    ]
  },
  {
    id: 'tag_runner_at_2b',
    name: 'Tag runner at 2B',
    type: 'tag',
    description: 'Fielder tags the runner advancing to 2nd base.',
    steps: [
      { type: 'status', text: 'TAGGING THE RUNNER AT 2ND BASE!' },
      { type: 'fielder_tag_runner', runnerId: 'runner-1b', base: '2b', duration: 500 },
      { type: 'tag_sound' },
      { type: 'dust_runner', runnerId: 'runner-1b', count: 12 },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT 2ND BASE!' }
    ]
  },
  {
    id: 'tag_runner_at_home',
    name: 'Tag runner at Home',
    type: 'tag',
    description: 'Fielder/Catcher tags the runner sliding into home.',
    steps: [
      { type: 'status', text: 'TAGGING THE RUNNER AT HOME!' },
      { type: 'fielder_tag_runner', runnerId: 'runner-3b', base: 'home', duration: 500 },
      { type: 'tag_sound' },
      { type: 'dust_runner', runnerId: 'runner-3b', count: 12 },
      { type: 'runner_out', runnerId: 'runner-3b' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT THE PLATE!' }
    ]
  },

  // Catch
  {
    id: 'catch_fly_ball',
    name: 'Catch fly ball',
    type: 'catch',
    description: 'Outfielder catches the fly ball in the air.',
    steps: [
      { type: 'status', text: 'FLY BALL CAUGHT IN THE OUTFIELD!' },
      { type: 'catch_sound' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'status', text: 'BATTER IS OUT! ALL RUNNERS MUST TAG UP.' }
    ]
  },
  {
    id: 'catch_popup',
    name: 'Catch pop-up',
    type: 'catch',
    description: 'Fielder catches the pop-up in the infield.',
    steps: [
      { type: 'status', text: 'POP-UP CAUGHT IN THE INFIELD!' },
      { type: 'catch_sound' },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'status', text: 'BATTER IS OUT!' }
    ]
  },

  // Runner Advances
  {
    id: 'runner_scores_3b',
    name: 'Runner scores from 3B',
    type: 'advance',
    description: 'The runner on 3rd base runs home and scores.',
    steps: [
      { type: 'status', text: 'RUNNER FROM 3RD TAGS UP AND RUNS HOME!' },
      { type: 'runners_advance', runnerList: ['runner-3b'], duration: 600 },
      { type: 'flash_base', base: 'home' },
      { type: 'dust', base: 'home', count: 8 },
      { type: 'cheer_sound', duration: 3, volume: 0.35 },
      { type: 'status', text: 'RUN SCORES! SAFE!' }
    ]
  },
  {
    id: 'runner_advances_3b',
    name: 'Runner advances to 3B',
    type: 'advance',
    description: 'The runner on 2nd base advances to 3rd base safely.',
    steps: [
      { type: 'status', text: 'RUNNER ON 2ND BASE ADVANCES TO 3RD!' },
      { type: 'runners_advance', runnerList: ['runner-2b'], duration: 600 },
      { type: 'flash_base', base: '3b' },
      { type: 'dust', base: '3b', count: 8 },
      { type: 'status', text: 'RUNNER SAFE AT 3RD BASE!' }
    ]
  },
  {
    id: 'runners_advance_all',
    name: 'Runners advance (all)',
    type: 'advance',
    description: 'All runners advance one base safely.',
    steps: [
      { type: 'status', text: 'RUNNERS ARE ON THE MOVE!' },
      { type: 'runners_advance', runnerList: ['runner-1b', 'runner-2b', 'runner-3b'], duration: 750 },
      { type: 'status', text: 'EVERYONE IS SAFE!' }
    ]
  },
  {
    id: 'batter_safe_1b',
    name: 'Batter safe at 1B',
    type: 'advance',
    description: 'The batter beats the throw to 1st base.',
    steps: [
      { type: 'status', text: 'BATTER BEATS THE THROW!' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 8 },
      { type: 'status', text: 'SAFE AT 1ST BASE!' }
    ]
  },

  // Double Plays
  {
    id: 'double_play_643',
    name: '6-4-3 Double Play',
    type: 'double_play',
    description: 'Shortstop throws to 2nd baseman, who throws to 1st base.',
    steps: [
      { type: 'fielder_move_role', role: '2b', targetBase: '2b', duration: 250 },
      { type: 'status', text: 'SS FIELDS AND THROWS TO 2B!' },
      { type: 'ball_throw', targetBase: '2b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '2b' },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'status', text: 'FORCE OUT AT 2ND! THROW TO 1ST!' },
      { type: 'wait', duration: 100 },
      { type: 'ball_throw_from_base', fromBase: '2b', targetBase: '1b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 8 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'cheer_sound', duration: 3, volume: 0.4 },
      { type: 'status', text: 'DOUBLE PLAY! 6-4-3 DP!' }
    ]
  },
  {
    id: 'double_play_463',
    name: '4-6-3 Double Play',
    type: 'double_play',
    description: '2nd baseman throws to Shortstop, who throws to 1st base.',
    steps: [
      { type: 'fielder_move_role', role: 'ss', targetBase: '2b', duration: 250 },
      { type: 'status', text: '2B FIELDS AND THROWS TO SS!' },
      { type: 'ball_throw', targetBase: '2b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '2b' },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'status', text: 'FORCE OUT AT 2ND! SS THROWS TO 1ST!' },
      { type: 'wait', duration: 100 },
      { type: 'ball_throw_from_base', fromBase: '2b', targetBase: '1b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 8 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'cheer_sound', duration: 3, volume: 0.4 },
      { type: 'status', text: 'DOUBLE PLAY! 4-6-3 DP!' }
    ]
  },
  {
    id: 'double_play_543',
    name: '5-4-3 Double Play',
    type: 'double_play',
    description: '3rd baseman throws to 2nd baseman, who throws to 1st base.',
    steps: [
      { type: 'fielder_move_role', role: '2b', targetBase: '2b', duration: 250 },
      { type: 'status', text: '3B FIELDS AND THROWS TO 2B!' },
      { type: 'ball_throw', targetBase: '2b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '2b' },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'status', text: 'FORCE OUT AT 2ND! THROW TO 1ST!' },
      { type: 'wait', duration: 100 },
      { type: 'ball_throw_from_base', fromBase: '2b', targetBase: '1b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 8 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'cheer_sound', duration: 3, volume: 0.4 },
      { type: 'status', text: 'DOUBLE PLAY! 5-4-3 DP!' }
    ]
  },
  {
    id: 'double_play_163',
    name: '1-6-3 Double Play',
    type: 'double_play',
    description: 'Pitcher throws to Shortstop, who throws to 1st base.',
    steps: [
      { type: 'fielder_move_role', role: 'ss', targetBase: '2b', duration: 250 },
      { type: 'status', text: 'PITCHER FIELDS AND THROWS TO SS!' },
      { type: 'ball_throw', targetBase: '2b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '2b' },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'status', text: 'FORCE OUT AT 2ND! SS THROWS TO 1ST!' },
      { type: 'wait', duration: 100 },
      { type: 'ball_throw_from_base', fromBase: '2b', targetBase: '1b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 8 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'cheer_sound', duration: 3, volume: 0.4 },
      { type: 'status', text: 'DOUBLE PLAY! 1-6-3 DP!' }
    ]
  },
  {
    id: 'double_play_363',
    name: '3-6-3 Double Play',
    type: 'double_play',
    description: '1st baseman throws to Shortstop, who throws back to 1st base.',
    steps: [
      { type: 'fielder_move_role', role: 'ss', targetBase: '2b', duration: 250 },
      { type: 'status', text: '1B FIELDS AND THROWS TO SS!' },
      { type: 'ball_throw', targetBase: '2b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '2b' },
      { type: 'runner_out', runnerId: 'runner-1b' },
      { type: 'status', text: 'FORCE OUT AT 2ND! SS THROWS TO 1ST!' },
      { type: 'wait', duration: 100 },
      { type: 'ball_throw_from_base', fromBase: '2b', targetBase: '1b', duration: 300 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'dust', base: '1b', count: 8 },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'cheer_sound', duration: 3, volume: 0.4 },
      { type: 'status', text: 'DOUBLE PLAY! 3-6-3 DP!' }
    ]
  },
  {
    id: 'throw_1b_out_runners_hold',
    name: 'Throw to 1B (Runners Hold)',
    type: 'throw',
    description: 'Fielder throws to 1B for the out; other runners return to their bases.',
    steps: [
      { type: 'status', text: 'THROWING TO 1ST BASE! RUNNERS RETREAT!' },
      { type: 'ball_throw', targetBase: '1b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'runners_return', runnerList: ['runner-1b', 'runner-2b', 'runner-3b'], duration: 500 },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT 1ST! RUNNERS HELD SAFELY.' }
    ]
  },
  {
    id: 'throw_1b_out_runners_advance',
    name: 'Throw to 1B (Runners Advance)',
    type: 'throw',
    description: 'Fielder throws to 1B for the out; other runners advance.',
    steps: [
      { type: 'status', text: 'THROWING TO 1ST BASE! RUNNERS ADVANCING!' },
      { type: 'ball_throw', targetBase: '1b', duration: 400 },
      { type: 'catch_sound' },
      { type: 'flash_base', base: '1b' },
      { type: 'runner_out', runnerId: 'player' },
      { type: 'runners_advance', runnerList: ['runner-1b', 'runner-2b', 'runner-3b'], duration: 600 },
      { type: 'cheer_sound', duration: 2, volume: 0.25 },
      { type: 'status', text: 'OUT AT 1ST! OTHER RUNNERS ADVANCE.' }
    ]
  },
  {
    id: 'outfielder_throw_cutoff',
    name: 'Throw to Cutoff',
    type: 'throw',
    description: 'Outfielder throws to the cutoff man in the infield; runners hold.',
    steps: [
      { type: 'status', text: 'THROWING TO THE INFIELD CUTOFF MAN!' },
      { type: 'ball_throw', targetBase: '2b', duration: 450 },
      { type: 'catch_sound' },
      { type: 'runners_return', runnerList: ['runner-1b', 'runner-2b', 'runner-3b'], duration: 400 },
      { type: 'status', text: 'CUTOFF MAN RECEIVES BALL. RUNNERS HOLD!' }
    ]
  },
  {
    id: 'runner_scores_2b',
    name: 'Runner scores from 2B',
    type: 'advance',
    description: 'The runner on 2nd base runs home and scores.',
    steps: [
      { type: 'status', text: 'RUNNER ON 2ND BASE SPEEDS AROUND 3RD!' },
      { type: 'runners_advance', runnerList: ['runner-2b'], duration: 800 },
      { type: 'flash_base', base: 'home' },
      { type: 'dust', base: 'home', count: 8 },
      { type: 'cheer_sound', duration: 3, volume: 0.35 },
      { type: 'status', text: 'SAFE AT HOME! RBI SINGLE!' }
    ]
  }
];
