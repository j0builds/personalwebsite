import React, { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [revealedAreas, setRevealedAreas] = useState(new Set())
  const [revealedSecrets, setRevealedSecrets] = useState(new Set())
  const [documentOpen, setDocumentOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [exploreClicked, setExploreClicked] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: '' })
  const rafRef = useRef(null)
  const elementCacheRef = useRef({})
  
  // Clear cache when document opens/closes
  useEffect(() => {
    if (documentOpen) {
      elementCacheRef.current = {}
    }
  }, [documentOpen])

  // EmailJS configuration
  // Option 1: Use environment variables (recommended for production)
  // Create a .env file with: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
  // Option 2: Replace the values below with your actual EmailJS credentials
  // Get them from: https://dashboard.emailjs.com/admin
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ci8h64h'
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_sipb9ui'
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'i0dQLe27a4mA6Or6D'

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const spotlightSize = 200

  // Track revealed secrets and content with requestAnimationFrame for smooth performance
  useEffect(() => {
    if (documentOpen) return
    if (mousePosition.x === 0 && mousePosition.y === 0) return // Skip initial position

    // Cancel previous frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    // Use requestAnimationFrame for smooth, performant updates
    rafRef.current = requestAnimationFrame(() => {
      // Check which secrets are currently in spotlight
      hiddenSecrets.forEach(secret => {
        const secretXPx = (parseFloat(secret.x) / 100) * window.innerWidth
        const secretYPx = (parseFloat(secret.y) / 100) * window.innerHeight
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - secretXPx, 2) + 
          Math.pow(mousePosition.y - secretYPx, 2)
        )
        if (distance < spotlightSize / 2) {
          setRevealedSecrets(prev => {
            if (prev.has(secret.id)) return prev // Already revealed
            return new Set([...prev, secret.id])
          })
        }
      })

      // Check if main content is in spotlight - cache elements for performance
      const contentElements = ['mystery-title', 'mystery-subtitle', 'mystery-description', 'mystery-location', 'mystery-citizenship']
      contentElements.forEach(elementId => {
        // Cache element lookups
        if (!elementCacheRef.current[elementId]) {
          elementCacheRef.current[elementId] = document.querySelector(`.spotlight-content .${elementId}`)
        }
        const element = elementCacheRef.current[elementId]
        
        if (element && !element.classList.contains('hidden')) {
          const rect = element.getBoundingClientRect()
          const elementCenterX = rect.left + rect.width / 2
          const elementCenterY = rect.top + rect.height / 2
          const distance = Math.sqrt(
            Math.pow(mousePosition.x - elementCenterX, 2) + 
            Math.pow(mousePosition.y - elementCenterY, 2)
          )
          if (distance < spotlightSize / 2) {
            setRevealedAreas(prev => {
              if (prev.has(elementId)) return prev // Already revealed
              return new Set([...prev, elementId])
            })
          }
        }
      })
    })

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [mousePosition, documentOpen])

  // Document pages content
  const pages = [
    {
      title: "",
      content: [
        "hey i'm Joseph Ayinde",
        "aka j0",
        "",
        "and i am a polymath (builder, thinker, dreamer)",
        "",
        "from greensboro north carolina",
        "",
        "i am a dual citizen of both the united states and nigeria"
      ],
      images: [],
      videos: []
    },
    {
      title: "About",
      content: [
        "As a polymath, I explore the intersections",
        "of technology, creativity, and human experience.",
        "",
        "My work spans multiple disciplines,",
        "blending analytical thinking with",
        "creative expression.",
        "",
        "I believe in building things that matter,",
        "thinking deeply about complex problems,",
        "and dreaming of possibilities yet to come."
      ],
      images: [],
      videos: []
    },
    {
      title: "Experience",
      content: [
        "Joseph Ayinde",
        "jayinde@unc.edu",
        "Joseph Ayinde | LinkedIn",
        "",
        "EDUCATION",
        "",
        "University of North Carolina at Chapel Hill",
        "August 2021 - May 2025",
        "Bachelor of Science in Biology",
        "Minor in Neuroscience | Minor in Chemistry",
        "",
        "Honors and Awards:",
        "",
        "• 2024 International Young Outstanding Leadership Award in Healthcare",
        "  (Las Vegas, Nevada)",
        "",
        "• 2024 LAUNCH Chapel Hill Startup Accelerator Cohort 25 Recipient",
        "",
        "• 2024 Dreamers Who Do INNOVATE Carolina Scholarship",
        "",
        "• 2021 Chancellor's Science Scholars Scholarship Recipient",
        "  1 out of 25 selected worldwide for the highest STEM merit scholarship",
        "  offered by the University of North Carolina at Chapel Hill",
        "",
        "• Fall 2021 Honors Carolina Cohort",
        "  Highly competitive, four-year academic program enrolling 10% of each class",
        "",
        "• 2023 Macquarie Medical School (Sydney, Australia) Visiting Scholar Nomination",
        "  Appointed to the Faculty of Medicine, Health, and Human Sciences",
        "  under Professor Antonio Di Ieva",
        "",
        "• 2023 Triangle Ventures Pitch Competition Semifinalist",
        "  Top 50 out of 600 teams across all of North Carolina",
        "",
        "RELEVANT EXPERIENCE",
        "",
        "HEALLY – Chapel Hill, NC",
        "November 2022 – August 2025",
        "CEO & Co-Founder",
        "",
        "• Prototyped and tested a non-invasive EEG-AI brain–computer interface",
        "",
        "• Drafted and implemented study protocols for human-subject usability testing",
        "",
        "• Managed participant safety, data collection, and confidentiality during pilot studies",
        "",
        "• Oversaw a cross-disciplinary team of researchers, engineers, and clinicians",
        "",
        "• Administered all accounts and collaborations with partners including",
        "  Google DeepMind, NVIDIA, CARTA, Carnegie Mellon University, and 1789 Venture Lab",
        "",
        "• Secured $150,000+ in funding resources",
        "",
        "Macquarie Neurosurgery & Computational Neurosurgery Lab",
        "Sydney, Australia | June 2023 - August 2023",
        "World's First Undergraduate Intern & Research Project Leader",
        "",
        "• World's first undergraduate intern in the world's first Computational",
        "  Neurosurgery lab in Sydney, Australia",
        "",
        "• Shadowed over 80 Neurosurgical Operations led by",
        "  Dr. Antonio Di Ieva and Dr. Eric Suero-Molina",
        "",
        "• Witnessed unique neuromodulation procedures performed by",
        "  Italian Neurosurgeon Dr. Antonio Di Ieva",
        "",
        "• Participated in weekly neurosurgical case meetings at",
        "  Macquarie University Hospital with the Macquarie Neurosurgery Group",
        "",
        "• Attended distinguished neurosurgical lectureships at Macquarie Medical School",
        "",
        "• Served as a research assistant in the world's first Computational Neurosurgery lab",
        "",
        "• Led a project exploring the legal and ethical implications of applying",
        "  artificial intelligence to Neurosurgery",
        "",
        "• Attended and presented at weekly research meetings at the",
        "  Australian Institute of Health Innovation",
        "",
        "LAUNCH Chapel Hill – Chapel Hill, North Carolina",
        "May 2024 – August 2024",
        "Summer Venture Fellow",
        "",
        "• Selected as 1 of 10 ventures across North Carolina for Launch Chapel Hill's",
        "  competitive 2024 Summer Accelerator",
        "",
        "• Refined business model, go-to-market strategy, and customer discovery pipeline",
        "  through mentorship from Harvard Business School faculty and top business leaders",
        "",
        "• Delivered investor-ready pitch demonstrating venture traction, scalability,",
        "  and long-term growth potential",
        "",
        "OpenAI – San Francisco, California",
        "January 2024 – May 2024",
        "Member of Technical Staff",
        "",
        "• Served as a biology expert, contributing to the creation and fine-tuning of",
        "  next-generation large language models (LLMs)",
        "",
        "• Applied domain expertise to refine LLM outputs, enhancing the models' ability",
        "  to generate accurate, context-aware, and research-driven responses in",
        "  biology and neuroscience",
        "",
        "• Provided strategic guidance on aligning AI development with cutting-edge",
        "  biological and neuroscientific principles",
        "",
        "• Participated in the evaluation and testing of LLM performance, focusing on",
        "  scientific reasoning, data interpretation, and application of",
        "  biology-specific knowledge"
      ],
      images: [],
      videos: []
    },
    {
      title: "Connect",
      content: [
        "I'm always interested in connecting",
        "with fellow builders, thinkers, and dreamers.",
        "",
        "Whether it's collaboration, conversation,",
        "or simply sharing ideas,",
        "",
        "I believe the best work happens",
        "when diverse perspectives come together.",
        "",
        "Let's build something meaningful together."
      ],
      images: [],
      videos: []
    }
  ]

  // Hidden content areas - fun facts about Joseph scattered across the page
  // Positioned to avoid overlap with centered main content (center area ~35-65% x, ~35-65% y)
  const hiddenSecrets = [
    { id: 1, x: '15%', y: '25%', text: 'Ex-OpenAI Member of Technical Staff' },
    { id: 2, x: '75%', y: '20%', text: "World's first intern in the world's first computational neurosurgery lab" },
    { id: 3, x: '85%', y: '55%', text: 'Computational Neuroscience Scholar at Carnegie Mellon University' },
    { id: 4, x: '25%', y: '75%', text: 'UNC Chapel Hill - Honors Biology, Neuroscience, Chemistry Graduate' },
    { id: 5, x: '8%', y: '85%', text: "Chancellor's Science Scholar - 1 of 25 selected worldwide" },
    { id: 6, x: '92%', y: '30%', text: 'The Residency Delta Finalist' },
    { id: 7, x: '20%', y: '12%', text: 'CEO and Founder of Cognition' },
    { id: 8, x: '15%', y: '55%', text: 'LAUNCH Chapel Hill Startup Accelerator Cohort 25 Recipient' },
  ]

  const isInSpotlight = (secretX, secretY) => {
    // Convert percentage to pixel position (approximate)
    const secretXPx = (parseFloat(secretX) / 100) * window.innerWidth
    const secretYPx = (parseFloat(secretY) / 100) * window.innerHeight
    
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - secretXPx, 2) + 
      Math.pow(mousePosition.y - secretYPx, 2)
    )
    
    return distance < spotlightSize / 2
  }

  const handleOpenDocument = () => {
    setDocumentOpen(true)
  }

  const handleCloseDocument = () => {
    setDocumentOpen(false)
    setCurrentPage(0)
    setExploreClicked(false)
  }

  const handleNextPage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
      setExploreClicked(false)
      // Scroll to top of page
      const pageElement = document.querySelector('.document-page')
      if (pageElement) {
        pageElement.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handlePrevPage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      setExploreClicked(false)
      // Scroll to top of page
      const pageElement = document.querySelector('.document-page')
      if (pageElement) {
        pageElement.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleExploreClick = () => {
    setExploreClicked(true)
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ loading: true, success: false, error: '' })

    // Check if EmailJS is configured
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: 'Email service not configured. Please set up EmailJS credentials.' 
      })
      return
    }

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'josephayinde64@gmail.com'
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      setFormStatus({ loading: false, success: true, error: '' })
      setFormData({ name: '', email: '', message: '' })
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setExploreClicked(false)
        setFormStatus({ loading: false, success: false, error: '' })
      }, 3000)
    } catch (error) {
      console.error('EmailJS error:', error)
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: 'Failed to send message. Please try again later.' 
      })
    }
  }

  return (
    <div className={`app ${documentOpen ? 'document-open' : ''}`}>
      {/* Soccer ball cursor - always visible */}
      <div 
        className="soccer-ball-cursor"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        ⚽
      </div>

      {/* Black overlay with spotlight effect - hidden when document is open */}
      {!documentOpen && (
        <>
          <div 
            className="spotlight-overlay"
            style={{
              background: `radial-gradient(circle ${spotlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.95) 70%, rgba(0,0,0,1) 100%)`
            }}
          />
          
          {/* Permanently revealed content layer */}
          <div className="permanent-reveal-layer">
            {/* Permanently revealed secrets */}
            <div className="secrets-layer">
              {hiddenSecrets.map(secret => {
                const isPermanentlyRevealed = revealedSecrets.has(secret.id)
                return (
                  <div
                    key={secret.id}
                    className={`secret-item ${isPermanentlyRevealed ? 'revealed permanent' : ''}`}
                    style={{
                      left: secret.x,
                      top: secret.y,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {isPermanentlyRevealed && (
                      <div className="secret-text">{secret.text}</div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Permanently revealed main content - exact same positioning, only shows revealed items */}
            <div className="main-content permanent-content">
              <div className="content-wrapper permanent-content-wrapper">
                <h1 className={`mystery-title permanent-reveal ${!revealedAreas.has('mystery-title') ? 'hidden' : ''}`}>
                  hey i'm Joseph Ayinde
                </h1>
                <p className={`mystery-subtitle permanent-reveal ${!revealedAreas.has('mystery-subtitle') ? 'hidden' : ''}`}>
                  aka j0
                </p>
                <p className={`mystery-description permanent-reveal ${!revealedAreas.has('mystery-description') ? 'hidden' : ''}`}>
                  and i am a polymath (builder, thinker, dreamer)
                </p>
                <p className={`mystery-location permanent-reveal ${!revealedAreas.has('mystery-location') ? 'hidden' : ''}`}>
                  from greensboro north carolina
                </p>
                <p className={`mystery-citizenship permanent-reveal ${!revealedAreas.has('mystery-citizenship') ? 'hidden' : ''}`}>
                  i am a dual citizen of both the united states and nigeria
                </p>
              </div>
            </div>
          </div>

          {/* Hidden secrets layer (for spotlight discovery) */}
          <div className="secrets-layer">
            {hiddenSecrets.map(secret => {
              const currentlyRevealed = isInSpotlight(secret.x, secret.y)
              const isPermanentlyRevealed = revealedSecrets.has(secret.id)
              // Only show if currently in spotlight and not already permanently revealed
              if (isPermanentlyRevealed) return null
              return (
                <div
                  key={`spotlight-${secret.id}`}
                  className={`secret-item ${currentlyRevealed ? 'revealed' : ''}`}
                  style={{
                    left: secret.x,
                    top: secret.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {currentlyRevealed && (
                    <div className="secret-text">{secret.text}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Main content (visible in spotlight for discovery) - always render for consistent layout */}
          <div className="main-content spotlight-content">
            <div className="content-wrapper spotlight-content-wrapper">
              <h1 className={`mystery-title ${revealedAreas.has('mystery-title') ? 'hidden' : ''}`}>
                hey i'm Joseph Ayinde
              </h1>
              <p className={`mystery-subtitle ${revealedAreas.has('mystery-subtitle') ? 'hidden' : ''}`}>
                aka j0
              </p>
              <p className={`mystery-description ${revealedAreas.has('mystery-description') ? 'hidden' : ''}`}>
                and i am a polymath (builder, thinker, dreamer)
              </p>
              <p className={`mystery-location ${revealedAreas.has('mystery-location') ? 'hidden' : ''}`}>
                from greensboro north carolina
              </p>
              <p className={`mystery-citizenship ${revealedAreas.has('mystery-citizenship') ? 'hidden' : ''}`}>
                i am a dual citizen of both the united states and nigeria
              </p>
            </div>
          </div>

          {/* Cursor glow effect with physics-like radiant particles */}
          <div 
            className="cursor-glow"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="glow-core"></div>
            <div className="glow-ring ring-1"></div>
            <div className="glow-ring ring-2"></div>
            <div className="glow-ring ring-3"></div>
            <div className="glow-particle particle-1"></div>
            <div className="glow-particle particle-2"></div>
            <div className="glow-particle particle-3"></div>
            <div className="glow-particle particle-4"></div>
            <div className="glow-particle particle-5"></div>
            <div className="glow-particle particle-6"></div>
          </div>
        </>
      )}

      {/* Open button - bottom right */}
      {!documentOpen && (
        <button className="open-button" onClick={handleOpenDocument}>
          open
        </button>
      )}

      {/* Document view */}
      {documentOpen && (
        <div className="document-container">
          <div className="document-book">
            {/* Previous page button */}
            {currentPage > 0 && (
              <button className="page-nav prev-page" onClick={handlePrevPage} title="Previous page">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="8" width="36" height="24" stroke="white" stroke-width="2.5" fill="none" rx="2"/>
                  <line x1="2" y1="8" x2="2" y2="32" stroke="white" stroke-width="2.5"/>
                  <line x1="38" y1="8" x2="38" y2="32" stroke="white" stroke-width="2.5"/>
                  <line x1="2" y1="20" x2="12" y2="20" stroke="white" stroke-width="2"/>
                  <line x1="2" y1="14" x2="10" y2="14" stroke="white" stroke-width="2"/>
                  <line x1="2" y1="26" x2="10" y2="26" stroke="white" stroke-width="2"/>
                </svg>
              </button>
            )}

            {/* Current page */}
            <div className="document-page">
              <div className="page-content">
                {pages[currentPage].title && (
                  <h2 className="page-title">{pages[currentPage].title}</h2>
                )}
                <div className="page-text">
                  {pages[currentPage].content.map((line, index) => {
                    // Check if line contains LinkedIn
                    if (line.includes('LinkedIn')) {
                      return (
                        <p key={index}>
                          <a 
                            href="https://www.linkedin.com/in/joseph-ayinde" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="page-link"
                          >
                            {line}
                          </a>
                        </p>
                      )
                    }
                    // Check if line is an email
                    if (line.includes('@') && line.includes('.com')) {
                      return (
                        <p key={index}>
                          <a 
                            href={`mailto:${line}`}
                            className="page-link"
                          >
                            {line}
                          </a>
                        </p>
                      )
                    }
                    return <p key={index}>{line}</p>
                  })}
                  
                  {/* Special handling for Connect page */}
                  {pages[currentPage].title === "Connect" && (
                    <div className="connect-section">
                      {!exploreClicked ? (
                        <button className="explore-button" onClick={handleExploreClick}>
                          explore more
                        </button>
                      ) : (
                        <div className="access-locked">
                          <p className="locked-message">access locked, fill out contact form to gain full access</p>
                          {formStatus.success ? (
                            <div className="form-success">
                              <p>Thank you! Your message has been sent. I'll get back to you soon.</p>
                            </div>
                          ) : (
                            <form className="contact-form" onSubmit={handleFormSubmit}>
                              {formStatus.error && (
                                <div className="form-error">
                                  <p>{formStatus.error}</p>
                                </div>
                              )}
                              <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                className="form-input"
                                disabled={formStatus.loading}
                              />
                              <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                                className="form-input"
                                disabled={formStatus.loading}
                              />
                              <textarea
                                name="message"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleFormChange}
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
                      )}
                    </div>
                  )}
                </div>
                
                {/* Images */}
                {pages[currentPage].images && pages[currentPage].images.length > 0 && (
                  <div className="page-media">
                    {pages[currentPage].images.map((image, index) => (
                      <div key={index} className="media-item">
                        <img 
                          src={image.src} 
                          alt={image.alt || ''} 
                          className="page-image"
                        />
                        {image.caption && (
                          <p className="media-caption">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Videos */}
                {pages[currentPage].videos && pages[currentPage].videos.length > 0 && (
                  <div className="page-media">
                    {pages[currentPage].videos.map((video, index) => (
                      <div key={index} className="media-item">
                        {video.type === 'youtube' || video.type === 'vimeo' ? (
                          <iframe
                            src={video.src}
                            title={video.title || ''}
                            className="page-video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <video 
                            src={video.src} 
                            controls 
                            className="page-video"
                            poster={video.poster}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {video.caption && (
                          <p className="media-caption">{video.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Next page button */}
            {currentPage < pages.length - 1 && (
              <button className="page-nav next-page" onClick={handleNextPage} title="Next page">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="8" width="36" height="24" stroke="white" stroke-width="2.5" fill="none" rx="2"/>
                  <line x1="2" y1="8" x2="2" y2="32" stroke="white" stroke-width="2.5"/>
                  <line x1="38" y1="8" x2="38" y2="32" stroke="white" stroke-width="2.5"/>
                  <line x1="38" y1="20" x2="28" y2="20" stroke="white" stroke-width="2"/>
                  <line x1="38" y1="14" x2="30" y2="14" stroke="white" stroke-width="2"/>
                  <line x1="38" y1="26" x2="30" y2="26" stroke="white" stroke-width="2"/>
                </svg>
              </button>
            )}

            {/* Close button */}
            <button className="close-button" onClick={handleCloseDocument}>
              close
            </button>

            {/* Page indicator */}
            <div className="page-indicator">
              {currentPage + 1} / {pages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

