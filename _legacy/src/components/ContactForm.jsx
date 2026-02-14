import React from 'react'

// Contact form component
export default function ContactForm({ 
  formData, 
  formStatus, 
  exploreClicked, 
  onFormChange, 
  onFormSubmit 
}) {
  if (!exploreClicked) return null

  return (
    <div className="access-locked">
      <p className="locked-message">access locked, fill out contact form to gain full access</p>
      {formStatus.success ? (
        <div className="form-success">
          <p>Thank you! Your message has been sent. I'll get back to you soon.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={onFormSubmit}>
          {formStatus.error && (
            <div className="form-error"><p>{formStatus.error}</p></div>
          )}
          <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            value={formData.name} 
            onChange={onFormChange} 
            required 
            className="form-input" 
            disabled={formStatus.loading} 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={onFormChange} 
            required 
            className="form-input" 
            disabled={formStatus.loading} 
          />
          <textarea 
            name="message" 
            placeholder="Message" 
            value={formData.message} 
            onChange={onFormChange} 
            required 
            className="form-textarea" 
            rows="5" 
            disabled={formStatus.loading} 
          />
          <button 
            type="submit" 
            className="form-submit-button" 
            disabled={formStatus.loading}
          >
            {formStatus.loading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  )
}
