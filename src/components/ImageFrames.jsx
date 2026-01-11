import React from 'react'

// Image placeholder frames component
export default function ImageFrames() {
  return (
    <div className="image-frames-container">
      <div className="image-frame frame-1">
        <div className="image-placeholder">
          <span className="placeholder-icon">📸</span>
          <span className="placeholder-text">Image 1</span>
        </div>
      </div>
      <div className="image-frame frame-2">
        <div className="image-placeholder">
          <span className="placeholder-icon">🖼️</span>
          <span className="placeholder-text">Image 2</span>
        </div>
      </div>
      <div className="image-frame frame-3">
        <div className="image-placeholder">
          <span className="placeholder-icon">📷</span>
          <span className="placeholder-text">Image 3</span>
        </div>
      </div>
      <div className="image-frame frame-4">
        <div className="image-placeholder">
          <span className="placeholder-icon">🎨</span>
          <span className="placeholder-text">Image 4</span>
        </div>
      </div>
      <div className="image-frame frame-5">
        <div className="image-placeholder">
          <span className="placeholder-icon">🖼️</span>
          <span className="placeholder-text">Image 5</span>
        </div>
      </div>
      <div className="image-frame frame-6">
        <div className="image-placeholder">
          <span className="placeholder-icon">📸</span>
          <span className="placeholder-text">Image 6</span>
        </div>
      </div>
    </div>
  )
}
