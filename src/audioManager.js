// audioManager.js - Audio system for MotionMap

class AudioManager {
  constructor() {
    this.sounds = {};
    this.volume = 0.3; // Reduced from 0.7 - much quieter default
    this.enabled = true;
    this.currentAmbient = null;
    this.hoverSequenceIndex = 0;
    this.hoverSounds = ['hover1', 'hover2', 'hover3', 'hover4', 'hover5', 'hover6', 'hover7', 'hover8'];
    this.hoverPool = {}; // Pool of pre-loaded hover sound instances
    this.lastHoverTime = 0;
    this.hoverThrottle = 50; // Minimum ms between hover sounds - very responsive!
    
    // Preload all sounds
    this.preloadAll();
    
    // Create hover sound pool (2 instances per sound for smooth overlap)
    this.createHoverPool();
  }

  createHoverPool() {
    this.hoverSounds.forEach(soundName => {
      this.hoverPool[soundName] = [
        new Audio(`/sounds/${soundName}.mp3`),
        new Audio(`/sounds/${soundName}.mp3`)
      ];
      // Set volume for all instances
      this.hoverPool[soundName].forEach(audio => {
        audio.volume = this.volume;
        audio.preload = 'auto';
      });
    });
  }

  preloadAll() {
    const soundList = [
      'ambient-loop',
      'back',
      'click',
      'drilldown',
      'form-submit',
      'form_error',
      'hover1',
      'hover2',
      'hover3',
      'hover4',
      'transition'
    ];

    soundList.forEach(name => {
      this.preload(name);
    });
  }

  preload(soundName) {
    if (!this.sounds[soundName]) {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds[soundName] = audio;
    }
    return this.sounds[soundName];
  }

  play(soundName, loop = false) {
    if (!this.enabled) return;

    const audio = this.preload(soundName);
    
    // Stop any currently playing instance of this sound first
    if (!audio.paused) {
      audio.pause();
    }
    
    audio.loop = loop;
    audio.currentTime = 0;
    audio.volume = this.volume;
    
    // Return promise for better error handling
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn(`Audio play failed for ${soundName}:`, err);
      });
    }

    return audio;
  }

  stop(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].pause();
      this.sounds[soundName].currentTime = 0;
    }
  }

  // Specialized methods for MotionMap interactions

  playAmbient() {
    if (!this.enabled) return;
    
    if (this.currentAmbient) {
      // Already playing - just make sure it's actually playing
      if (this.currentAmbient.paused) {
        this.currentAmbient.play().catch(err => {
          console.warn('Ambient resume failed (may need user interaction):', err);
        });
      }
      return;
    }
    
    // Start fresh
    const audio = this.preload('ambient-loop');
    audio.loop = true;
    audio.volume = this.volume;
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.currentAmbient = audio;
          console.log('Ambient music started');
        })
        .catch(err => {
          console.warn('Ambient autoplay blocked - will start on first user interaction:', err);
          // Store reference so it can be started on first interaction
          this.currentAmbient = audio;
        });
    } else {
      this.currentAmbient = audio;
    }
  }

  stopAmbient() {
    if (this.currentAmbient) {
      this.stop('ambient-loop');
      this.currentAmbient = null;
    }
  }

  playHover() {
    // Throttle hover sounds to prevent overlap
    const now = Date.now();
    if (now - this.lastHoverTime < this.hoverThrottle) {
      return; // Too soon, skip this one
    }
    this.lastHoverTime = now;
    
    // Add slight delay for more tactile feel
    setTimeout(() => {
      if (!this.enabled) return; // Check if still enabled after delay
      
      // Get the next sound name in the sequence
      const soundName = this.hoverSounds[this.hoverSequenceIndex];
      
      // Get available instance from pool (use first available, or reuse)
      const pool = this.hoverPool[soundName];
      const audio = pool.find(a => a.paused) || pool[0];
      
      // Reset and play
      audio.currentTime = 0;
      audio.volume = this.volume;
      audio.play().catch(err => {
        console.warn(`Hover sound failed for ${soundName}:`, err);
      });
      
      // Move to next sound in sequence (loop back to start)
      this.hoverSequenceIndex = (this.hoverSequenceIndex + 1) % this.hoverSounds.length;
    }, 25);
  }

  playClick() {
    this.play('click');
    
    // If ambient is loaded but paused (due to autoplay block), start it now
    if (this.currentAmbient && this.currentAmbient.paused) {
      this.currentAmbient.play().catch(err => {
        console.warn('Could not start ambient on click:', err);
      });
    }
  }

  playDrilldown() {
    this.play('drilldown');
  }

  playBack() {
    this.play('back');
  }

  playTransition() {
    this.play('transition');
  }

  playFormSubmit() {
    this.play('form-submit');
  }

  playFormError() {
    this.play('form_error');
  }

  setVolume(newVolume) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    
    // Update all preloaded sounds
    Object.values(this.sounds).forEach(audio => {
      audio.volume = this.volume;
    });
    
    // Update all hover pool instances
    Object.values(this.hoverPool).forEach(pool => {
      pool.forEach(audio => {
        audio.volume = this.volume;
      });
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopAmbient();
    } else {
      // When re-enabling, restart ambient
      this.playAmbient();
    }
    return this.enabled;
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
