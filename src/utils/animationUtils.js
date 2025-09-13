/**
 * Animation utilities for timing and sequencing
 */

import { ANIMATION_PRESETS } from './constants';

/**
 * Calculate frames per second from millisecond timing
 * @param {number} ms - Milliseconds per frame
 * @returns {number} - Frames per second
 */
export const msToFPS = (ms) => {
  return Math.round(1000 / ms);
};

/**
 * Calculate milliseconds per frame from FPS
 * @param {number} fps - Frames per second
 * @returns {number} - Milliseconds per frame
 */
export const fpsToMs = (fps) => {
  return Math.round(1000 / fps);
};

/**
 * Get animation duration in seconds
 * @param {number} frameCount - Number of frames
 * @param {number} frameTime - Milliseconds per frame
 * @returns {number} - Total duration in seconds
 */
export const getAnimationDuration = (frameCount, frameTime) => {
  return (frameCount * frameTime) / 1000;
};

/**
 * Create smooth easing function for animations
 * @param {string} type - Easing type ('ease-in', 'ease-out', 'ease-in-out')
 * @returns {Function} - Easing function
 */
export const createEasing = (type = 'ease-in-out') => {
  const easingFunctions = {
    'ease-in': (t) => t * t,
    'ease-out': (t) => t * (2 - t),
    'ease-in-out': (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    'linear': (t) => t
  };
  
  return easingFunctions[type] || easingFunctions['ease-in-out'];
};

/**
 * Get preset animation timing
 * @param {string} preset - Preset name
 * @returns {number} - Milliseconds per frame
 */
export const getPresetTiming = (preset) => {
  return ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.NORMAL;
};

/**
 * Validate animation timing
 * @param {number} timing - Milliseconds per frame
 * @returns {boolean} - Whether timing is valid
 */
export const isValidTiming = (timing) => {
  return timing >= 50 && timing <= 2000;
};

/**
 * Create frame sequence for looping animations
 * @param {number} frameCount - Number of frames
 * @param {boolean} pingPong - Whether to ping-pong (reverse) the animation
 * @returns {number[]} - Array of frame indices
 */
export const createFrameSequence = (frameCount, pingPong = false) => {
  const frames = Array.from({ length: frameCount }, (_, i) => i);
  
  if (pingPong && frameCount > 2) {
    // Add reverse frames (excluding first and last to avoid stuttering)
    const reverseFrames = frames.slice(1, -1).reverse();
    return [...frames, ...reverseFrames];
  }
  
  return frames;
};

/**
 * Calculate optimal frame rate for smooth animation
 * @param {number} targetFPS - Desired FPS (default 60)
 * @param {number} frameCount - Number of animation frames
 * @returns {number} - Recommended milliseconds per frame
 */
export const calculateOptimalFrameRate = (targetFPS = 60, frameCount) => {
  // Ensure the animation doesn't update faster than the display can handle
  const maxFPS = Math.min(targetFPS, 60);
  const minFrameTime = 1000 / maxFPS;
  
  // For very short animations, slow them down slightly
  if (frameCount <= 3) {
    return Math.max(minFrameTime, 150);
  }
  
  // For longer animations, can be faster
  if (frameCount >= 10) {
    return Math.max(minFrameTime, 100);
  }
  
  return Math.max(minFrameTime, 200);
};

/**
 * Interpolate between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress (0-1)
 * @returns {number} - Interpolated value
 */
export const lerp = (start, end, progress) => {
  return start + (end - start) * progress;
};

/**
 * Create bouncing effect for jump animations
 * @param {number} frame - Current frame
 * @param {number} totalFrames - Total frames in animation
 * @param {number} maxHeight - Maximum bounce height
 * @returns {number} - Y offset for bounce
 */
export const createBounceEffect = (frame, totalFrames, maxHeight = 6) => {
  const progress = frame / (totalFrames - 1);
  // Use sine wave for smooth bounce
  const bounceProgress = Math.sin(progress * Math.PI);
  return -bounceProgress * maxHeight;
};

/**
 * Create walking bob effect
 * @param {number} frame - Current frame
 * @param {number} totalFrames - Total frames in animation
 * @param {number} bobAmount - Amount of vertical bob
 * @returns {number} - Y offset for bob
 */
export const createWalkBob = (frame, totalFrames, bobAmount = 1) => {
  const progress = (frame / totalFrames) * 2 * Math.PI;
  return Math.sin(progress) * bobAmount;
};
