import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import GlobalCursor from './components/GlobalCursor'
import Home from './components/Home'
import Blog from './components/Blog'
import J0InTheWrld from './components/J0InTheWrld'
import './App.css'

function App() {
  return (
    <Router>
      <GlobalCursor />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/j0-in-the-wrld" element={<J0InTheWrld />} />
      </Routes>
    </Router>
  )
}

export default App
