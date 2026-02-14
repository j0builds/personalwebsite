import React, { useState } from 'react'
import './Blog.css'

const blogPosts = [
  {
    id: 1,
    title: "The Convergence of Neuroscience and AI: What We're Learning",
    category: "Neuroscience & AI",
    date: "2025-01-15",
    excerpt: "Exploring how modern neuroscience research is informing the next generation of artificial intelligence systems, and vice versa.",
    content: `The intersection of neuroscience and artificial intelligence represents one of the most exciting frontiers in modern science. As someone who has worked at both OpenAI and in computational neurosurgery, I've witnessed firsthand how these fields are beginning to inform each other in profound ways.

Traditional AI models have been largely inspired by simplified neural networks, but we're now seeing a shift toward more biologically plausible architectures. Recent advances in understanding neural plasticity, attention mechanisms, and memory consolidation are directly influencing how we design AI systems.

At the same time, AI is revolutionizing neuroscience research. Machine learning models can now analyze massive datasets of neural activity, identify patterns that would be impossible for humans to detect, and even predict neurological outcomes with remarkable accuracy.

The implications are staggering. We're not just building better AI-we're building AI that might help us understand the very organ that created it.`
  },
  {
    id: 2,
    title: "Building at the Edges: Lessons from Founding Cognition",
    category: "Venture Essays",
    date: "2025-01-10",
    excerpt: "What I've learned about building a company at the intersection of neuroscience, AI, and human experience.",
    content: `Starting Cognition taught me that the best opportunities exist in the spaces between established fields. When you're building something that doesn't fit neatly into existing categories, you face unique challenges-but also unique advantages.

One of the most important lessons: don't wait for permission. I was prototyping brain-computer interfaces while still an undergraduate. I didn't have all the answers, but I had questions that hadn't been asked before. That curiosity, combined with action, led to partnerships with Google DeepMind, NVIDIA, and Carnegie Mellon.

Another critical insight: the best teams are built on shared vision, not just shared skills. When you're working at the edges, you need people who are comfortable with ambiguity, who can think across disciplines, and who are driven by the problem itself rather than predefined solutions.

The venture world often rewards specialization, but there's something powerful about being a generalist who can connect disparate fields. That's where true innovation happens.`
  },
  {
    id: 3,
    title: "What Computational Neurosurgery Taught Me About AI Ethics",
    category: "Lessons & Experiences",
    date: "2025-01-05",
    excerpt: "Spending a summer shadowing 80+ neurosurgical operations changed how I think about AI's role in critical decision-making.",
    content: `In 2023, I became the world's first undergraduate intern in the world's first Computational Neurosurgery lab. Over the course of that summer, I shadowed over 80 neurosurgical operations and witnessed neuromodulation procedures that most medical students never see.

The experience fundamentally changed how I think about AI's role in high-stakes decision-making. In the operating room, every decision matters. There's no undo button. There's no "we'll fix it in the next version."

This taught me that when we're building AI systems that will impact human lives-whether in healthcare, autonomous vehicles, or financial systems-we need to think like surgeons. We need to understand not just what the system can do, but what happens when it fails. We need to build in safeguards, redundancies, and human oversight.

The legal and ethical implications of AI in neurosurgery became a central focus of my research. How do we ensure AI-assisted medical decisions are transparent? How do we maintain human agency while leveraging AI's capabilities? These aren't abstract questions-they're questions that will determine how AI integrates into our most critical systems.

The lesson: technology without ethics is just a tool. Technology with ethics is a force for good.`
  },
  {
    id: 4,
    title: "The Forgetting Crisis: Why We Built Cognition",
    category: "Venture Essays",
    date: "2024-12-28",
    excerpt: "People forget up to 70% of what they learn online within 24 hours. Here's how we're solving it.",
    content: `The internet has democratized access to information, but it hasn't solved the fundamental problem of human memory. Research shows that people forget up to 70% of what they learn online within 24 hours. We're drowning in information but starving for retention.

This isn't just a personal problem-it's a systemic one. Companies spend billions on training and education, but most of that investment is lost to forgetting. Students consume endless content but struggle to retain what matters. Professionals attend conferences and workshops, only to forget the key insights within days.

Cognition was born from a simple question: what if software could remember what you learn, reinforce it at the right moments, and help you build on that knowledge over time? What if learning wasn't a one-time event, but a continuous process supported by intelligent systems?

We're building the world's first Social Intelligence Network-a drop-in intelligence layer that transforms any software into a living system that converses, remembers, and reinforces growth. It's not about replacing human learning; it's about augmenting it.

The future isn't about having more information. It's about having better memory.`
  },
  {
    id: 5,
    title: "From OpenAI to Building My Own: Why I Left",
    category: "Lessons & Experiences",
    date: "2024-12-20",
    excerpt: "Working at OpenAI was incredible, but I realized I needed to build something of my own. Here's why.",
    content: `At 21, joining OpenAI as a Member of Technical Staff felt like a dream. I was working on next-generation large language models, helping shape how AI understands biology and neuroscience. I saw firsthand how AI could transform scientific discovery.

But I also saw its limitations. I saw how even the most advanced models struggled with context, memory, and truly understanding the nuances of biological systems. I realized that to solve the problems I cared about most, I needed to build something from the ground up.

Leaving wasn't easy. OpenAI is an incredible place with brilliant people. But there's something powerful about building your own vision, about taking the lessons you've learned and applying them to problems you're uniquely positioned to solve.

The experience taught me that sometimes the best way to contribute to a field is not to work within existing structures, but to create new ones. That's what I'm doing with Cognition, and that's what I'll continue to do.`
  }
]

function Blog() {
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Neuroscience & AI', 'Venture Essays', 'Lessons & Experiences']
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">blog</h1>
        <p className="blog-subtitle">thoughts on neuroscience, ai, building, and learning</p>
      </div>

      <div className="blog-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {selectedPost ? (
        <div className="blog-post-view">
          <button className="back-button" onClick={() => setSelectedPost(null)}>
            ← back
          </button>
          <article className="blog-post-full">
            <div className="post-meta">
              <span className="post-category">{selectedPost.category}</span>
              <span className="post-date">{new Date(selectedPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <h2 className="post-title-full">{selectedPost.title}</h2>
            <div className="post-content">
              {selectedPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      ) : (
        <div className="blog-posts-grid">
          {filteredPosts.map(post => (
            <article 
              key={post.id} 
              className="blog-post-card"
              onClick={() => setSelectedPost(post)}
            >
              <div className="post-header">
                <span className="post-category">{post.category}</span>
                <span className="post-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-excerpt">{post.excerpt}</p>
              <span className="read-more">read more →</span>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Blog
