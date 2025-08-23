import './style.css'
import { createHeader } from './components/header.js'
import { createHero } from './components/hero.js'
import { createAbout } from './components/about.js'
import { createProjects } from './components/projects.js'
import { createContact } from './components/contact.js'
import { initializeAnimations } from './utils/animations.js'

document.querySelector('#app').innerHTML = `
  ${createHeader()}
  ${createHero()}
  ${createAbout()}
  ${createProjects()}
  ${createContact()}
`

// Initialize animations and interactions
initializeAnimations()