// audio.js — Web Audio API sound effects for BatterPlay

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSelectSound() {
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.setValueAtTime(900, now + 0.08);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.linearRampToValueAtTime(0.001, now + 0.18);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(now + 0.18);
}

function playBatCrack() {
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(now + 0.08);
  
  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1100;
  filter.Q.value = 1.8;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.35, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start();
  noise.stop(now + 0.05);
}

function playCrowdCheer(duration, maxVolume) {
  if (maxVolume === undefined) maxVolume = 0.25;
  initAudio();
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  
  const filter1 = audioCtx.createBiquadFilter();
  filter1.type = 'bandpass';
  filter1.frequency.value = 950;
  filter1.Q.value = 1.3;
  
  const filter2 = audioCtx.createBiquadFilter();
  filter2.type = 'bandpass';
  filter2.frequency.value = 1750;
  filter2.Q.value = 1.6;
  
  const gainNode = audioCtx.createGain();
  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(maxVolume, now + 0.35);
  gainNode.gain.linearRampToValueAtTime(maxVolume * 0.75, now + 1.2);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
  filter1.frequency.setValueAtTime(850, now);
  filter1.frequency.exponentialRampToValueAtTime(1300, now + 0.4);
  filter1.frequency.linearRampToValueAtTime(950, now + duration);
  
  filter2.frequency.setValueAtTime(1550, now);
  filter2.frequency.exponentialRampToValueAtTime(2100, now + 0.45);
  filter2.frequency.linearRampToValueAtTime(1650, now + duration);
  
  source.connect(filter1);
  filter1.connect(gainNode);
  source.connect(filter2);
  filter2.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start();
  source.stop(now + duration);
}

function playGloveCatch() {
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(now + 0.08);
}

function playTagSound() {
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(now + 0.1);
}
