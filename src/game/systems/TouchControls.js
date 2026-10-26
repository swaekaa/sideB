/**
 * TouchControls.js
 * SIDE B: One Perfect Afternoon (1969)
 * Responsive Virtual Joystick & Action Touch Controls for Mobile Devices
 * Preserves 100% desktop fidelity with zero interference on mouse/keyboard.
 */

import { audioManager } from './AudioManager.js';

class TouchControlsManager {
  constructor() {
    this.isTouchDevice = false;
    this.isVisible = false;

    // Movement state
    this.state = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false,
      space: false,
      interactJustDown: false,
      spaceJustDown: false
    };

    this.joystick = {
      active: false,
      touchId: null,
      baseX: 0,
      baseY: 0,
      radius: 40,
      deadzone: 10
    };

    // DOM references
    this.containerEl = null;
    this.joystickZoneEl = null;
    this.joystickBaseEl = null;
    this.joystickKnobEl = null;
    this.btnInteractEl = null;
    this.btnSpaceEl = null;
    this.rotateOverlayEl = null;
  }

  init() {
    this.isTouchDevice = this.detectTouchDevice();

    if (this.isTouchDevice) {
      document.body.classList.add('is-touch-device');
    }

    this.containerEl = document.getElementById('mobile-touch-controls');
    this.joystickZoneEl = document.getElementById('virtual-joystick-zone');
    this.joystickBaseEl = document.getElementById('virtual-joystick-base');
    this.joystickKnobEl = document.getElementById('virtual-joystick-knob');
    this.btnInteractEl = document.getElementById('v-btn-interact');
    this.btnSpaceEl = document.getElementById('v-btn-space');
    this.rotateOverlayEl = document.getElementById('rotate-device-overlay');

    this.setupOrientationWatcher();

    if (this.isTouchDevice) {
      this.setupJoystickEvents();
      this.setupActionButtons();
    }
  }

  detectTouchDevice() {
    const hasTouch = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return (hasTouch && (isMobileUA || isCoarse || window.innerWidth <= 1024));
  }

  setupOrientationWatcher() {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      if (this.rotateOverlayEl) {
        if (this.isTouchDevice && isPortrait) {
          this.rotateOverlayEl.style.display = 'flex';
          if (this.containerEl) this.containerEl.style.display = 'none';
        } else {
          this.rotateOverlayEl.style.display = 'none';
          if (this.isVisible && this.containerEl && this.isTouchDevice) {
            this.containerEl.style.display = 'flex';
          }
        }
      }
    };

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    checkOrientation();
  }

  setupJoystickEvents() {
    if (!this.joystickZoneEl || !this.joystickKnobEl || !this.joystickBaseEl) return;

    const onTouchStart = (e) => {
      audioManager.unlock();
      if (this.joystick.active) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const rect = this.joystickBaseEl.getBoundingClientRect();
      this.joystick.baseX = rect.left + rect.width / 2;
      this.joystick.baseY = rect.top + rect.height / 2;
      this.joystick.touchId = touch.identifier;
      this.joystick.active = true;

      this.updateJoystick(touch.clientX, touch.clientY);
      e.preventDefault();
    };

    const onTouchMove = (e) => {
      if (!this.joystick.active) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystick.touchId) {
          this.updateJoystick(touch.clientX, touch.clientY);
          e.preventDefault();
          break;
        }
      }
    };

    const onTouchEnd = (e) => {
      if (!this.joystick.active) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystick.touchId) {
          this.resetJoystick();
          e.preventDefault();
          break;
        }
      }
    };

    this.joystickZoneEl.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onTouchEnd, { passive: false });
  }

  updateJoystick(clientX, clientY) {
    const dx = clientX - this.joystick.baseX;
    const dy = clientY - this.joystick.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxR = this.joystick.radius;
    let clampedX = dx;
    let clampedY = dy;
    if (dist > maxR) {
      clampedX = (dx / dist) * maxR;
      clampedY = (dy / dist) * maxR;
    }

    if (this.joystickKnobEl) {
      this.joystickKnobEl.style.transition = 'none';
      this.joystickKnobEl.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
    }

    // Direction calculation
    if (dist < this.joystick.deadzone) {
      this.state.up = false;
      this.state.down = false;
      this.state.left = false;
      this.state.right = false;
      return;
    }

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // -180 to 180 deg

    // 4-way cardinal direction resolution
    this.state.right = (angle >= -45 && angle <= 45);
    this.state.down = (angle > 45 && angle < 135);
    this.state.left = (angle >= 135 || angle <= -135);
    this.state.up = (angle > -135 && angle < -45);
  }

  resetJoystick() {
    this.joystick.active = false;
    this.joystick.touchId = null;
    this.state.up = false;
    this.state.down = false;
    this.state.left = false;
    this.state.right = false;

    if (this.joystickKnobEl) {
      this.joystickKnobEl.style.transition = 'transform 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
      this.joystickKnobEl.style.transform = 'translate(0px, 0px)';
    }
  }

  setupActionButtons() {
    if (this.btnInteractEl) {
      this.btnInteractEl.addEventListener('touchstart', (e) => {
        audioManager.unlock();
        e.preventDefault();
        this.state.interact = true;
        this.state.interactJustDown = true;
        this.btnInteractEl.classList.add('active');
        if (navigator.vibrate) try { navigator.vibrate(10); } catch (_) {}

        // If dialogue is open, advance dialogue immediately
        if (window.__activeDialogueBox && window.__activeDialogueBox.isOpen) {
          window.__activeDialogueBox.triggerAdvance();
        }
      }, { passive: false });

      const endInteract = () => {
        this.state.interact = false;
        this.btnInteractEl.classList.remove('active');
      };
      this.btnInteractEl.addEventListener('touchend', endInteract);
      this.btnInteractEl.addEventListener('touchcancel', endInteract);
    }

    if (this.btnSpaceEl) {
      this.btnSpaceEl.addEventListener('touchstart', (e) => {
        audioManager.unlock();
        e.preventDefault();
        this.state.space = true;
        this.state.spaceJustDown = true;
        this.btnSpaceEl.classList.add('active');
        if (navigator.vibrate) try { navigator.vibrate(10); } catch (_) {}

        // If dialogue is open, advance dialogue immediately
        if (window.__activeDialogueBox && window.__activeDialogueBox.isOpen) {
          window.__activeDialogueBox.triggerAdvance();
        }
      }, { passive: false });

      const endSpace = () => {
        this.state.space = false;
        this.btnSpaceEl.classList.remove('active');
      };
      this.btnSpaceEl.addEventListener('touchend', endSpace);
      this.btnSpaceEl.addEventListener('touchcancel', endSpace);
    }
  }

  setMode(mode) {
    this.mode = mode; // 'all' | 'actionsOnly' | 'none'
    if (!this.containerEl || !this.isTouchDevice) return;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait || mode === 'none') {
      this.containerEl.style.display = 'none';
      return;
    }

    this.containerEl.style.display = 'flex';
    const actionBtns = this.containerEl.querySelector('.v-action-buttons');

    if (mode === 'actionsOnly') {
      if (this.joystickZoneEl) this.joystickZoneEl.style.display = 'none';
      if (actionBtns) actionBtns.style.display = 'flex';
    } else {
      if (this.joystickZoneEl) this.joystickZoneEl.style.display = 'flex';
      if (actionBtns) actionBtns.style.display = 'flex';
    }
  }

  setVisible(visible) {
    this.setMode(visible ? 'all' : 'none');
  }

  isLeft() { return this.state.left; }
  isRight() { return this.state.right; }
  isUp() { return this.state.up; }
  isDown() { return this.state.down; }

  consumeInteract() {
    if (this.state.interactJustDown) {
      this.state.interactJustDown = false;
      return true;
    }
    return false;
  }

  consumeSpace() {
    if (this.state.spaceJustDown) {
      this.state.spaceJustDown = false;
      return true;
    }
    return false;
  }
}

export const touchControls = new TouchControlsManager();
