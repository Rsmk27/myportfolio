export function createAbout() {
  return `
    <section id="about" class="section about">
      <div class="container">
        <h2 class="section-title animate-on-scroll">About Me</h2>
        <div class="about-content">
          <div class="about-text animate-on-scroll">
            <p>
              I'm a passionate full-stack developer with over 5 years of experience creating 
              digital solutions that bridge the gap between design and functionality. My journey 
              in tech started with a curiosity about how things work, and it has evolved into 
              a deep love for crafting exceptional user experiences.
            </p>
            <p>
              I specialize in modern web technologies and have a keen eye for design. 
              Whether it's building scalable backend systems or creating intuitive user 
              interfaces, I approach every project with attention to detail and a commitment 
              to excellence.
            </p>
            <div class="skills-grid">
              <div class="skill-category">
                <h4>Frontend</h4>
                <div class="skills">
                  <span class="skill-tag">React</span>
                  <span class="skill-tag">Vue.js</span>
                  <span class="skill-tag">TypeScript</span>
                  <span class="skill-tag">Next.js</span>
                </div>
              </div>
              <div class="skill-category">
                <h4>Backend</h4>
                <div class="skills">
                  <span class="skill-tag">Node.js</span>
                  <span class="skill-tag">Python</span>
                  <span class="skill-tag">PostgreSQL</span>
                  <span class="skill-tag">MongoDB</span>
                </div>
              </div>
              <div class="skill-category">
                <h4>Tools</h4>
                <div class="skills">
                  <span class="skill-tag">Docker</span>
                  <span class="skill-tag">AWS</span>
                  <span class="skill-tag">Git</span>
                  <span class="skill-tag">Figma</span>
                </div>
              </div>
            </div>
          </div>
          <div class="about-stats animate-on-scroll">
            <div class="stat-card">
              <div class="stat-number">50+</div>
              <div class="stat-label">Projects Completed</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">5+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">30+</div>
              <div class="stat-label">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <style>
      .about {
        background: var(--secondary-dark);
      }
      
      .about-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 4rem;
        align-items: start;
      }
      
      .about-text p {
        margin-bottom: 1.5rem;
      }
      
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .skill-category h4 {
        color: var(--electric-blue);
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
      
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .skill-tag {
        background: var(--tertiary-dark);
        color: var(--text-primary);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }
      
      .skill-tag:hover {
        background: var(--electric-blue);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px var(--shadow-color);
      }
      
      .about-stats {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .stat-card {
        background: var(--primary-dark);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 102, 255, 0.1), transparent);
        transition: left 0.5s;
      }
      
      .stat-card:hover::before {
        left: 100%;
      }
      
      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px var(--shadow-color);
        border-color: var(--electric-blue);
      }
      
      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--electric-blue);
        margin-bottom: 0.5rem;
      }
      
      .stat-label {
        color: var(--text-secondary);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      @media (max-width: 768px) {
        .about-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .skills-grid {
          grid-template-columns: 1fr;
        }
        
        .about-stats {
          flex-direction: row;
          justify-content: space-between;
        }
        
        .stat-card {
          flex: 1;
          padding: 1.5rem 1rem;
        }
        
        .stat-number {
          font-size: 2rem;
        }
      }
    </style>
  `
}