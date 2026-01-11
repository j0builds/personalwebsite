import React from 'react'

// Secret detail modal component
export default function SecretModal({ secret, onClose }) {
  if (!secret) return null

  return (
    <div className="secret-modal-overlay" onClick={onClose}>
      <div className="secret-modal" onClick={(e) => e.stopPropagation()}>
        <button className="secret-modal-close" onClick={onClose}>×</button>
        <div className="secret-modal-content">
          {secret.image && (
            <div className="secret-modal-image-container">
              <img 
                src={secret.image} 
                alt={secret.text} 
                className="secret-modal-image" 
                loading="lazy"
                decoding="async"
                onError={(e) => e.target.style.display = 'none'} 
              />
            </div>
          )}
          <div className="secret-modal-text">
            <h2 className="secret-modal-title">{secret.text}</h2>
            <p className="secret-modal-description">{secret.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
