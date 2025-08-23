export function createHero() {
  return `
    <section id="home" class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text animate-on-scroll">
            <h1 class="hero-title">
              Hi, I'm <span class="highlight">RSMK</span>
            </h1>
            <p class="hero-subtitle">Full Stack Developer & UI/UX Designer</p>
            <p class="hero-description">
              I create exceptional digital experiences through innovative design and cutting-edge technology. 
              Passionate about building scalable applications that make a difference.
            </p>
            <div class="hero-buttons">
              <a href="#projects" class="btn">View My Work</a>
              <a href="#contact" class="btn btn-outline">Get In Touch</a>
            </div>
          </div>
          <div class="hero-visual animate-on-scroll">
            <div class="floating-card">
              <div class="card-content">
                <div class="code-snippet">
                  <div class="code-line">
                    <span class="code-keyword">const</span> 
                    <span class="code-variable">developer</span> = {
                  </div>
                  <div class="code-line code-indent">
                    <span class="code-property">name</span>: 
                    <span class="code-string">'RSMK'</span>,
                  </div>
                  <div class="code-line code-indent">
                    <span class="code-property">skills</span>: [
                    <span class="code-string">'React'</span>, 
                    <span class="code-string">'Node.js'</span>],
                  </div>
                  <div class="code-line code-indent">
                    <span class="code-property">passion</span>: 
                    <span class="code-string">'Innovation'</span>
                  </div>
                  <div class="code-line">}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-bg-elements">
        <div class="bg-circle bg-circle-1"></div>
        <div class="bg-circle bg-circle-2"></div>
        <div class="bg-circle bg-circle-3"></div>
      </div>
    </section>
    
    <style>
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        padding-top: 80px;
      }
      
      .hero-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        position: relative;
        z-index: 2;
      }
      
      .hero-title {
        margin-bottom: 1rem;
      }
      
      .highlight {
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .hero-subtitle {
        font-size: 1.5rem;
        color: var(--electric-blue);
        margin-bottom: 1.5rem;
        font-weight: 500;
      }
      
      .hero-description {
        margin-bottom: 2.5rem;
        font-size: 1.2rem;
        max-width: 500px;
      }
      
      .hero-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .floating-card {
        background: var(--secondary-dark);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        position: relative;
        animation: float 6s ease-in-out infinite;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      
      .floating-card::before {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        background: var(--gradient-primary);
        border-radius: 12px;
        z-index: -1;
        opacity: 0.5;
        filter: blur(10px);
      }
      
      .code-snippet {
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
      }
      
      .code-line {
        margin-bottom: 0.5rem;
      }
      
      .code-indent {
        padding-left: 1.5rem;
      }
      
      .code-keyword {
        color: #ff6b9d;
      }
      
      .code-variable {
        color: #4ecdc4;
      }
      
      .code-property {
        color: #45b7d1;
      }
      
      .code-string {
        color: #96ceb4;
      }
      
      .hero-bg-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        pointer-events: none;
      }
      
      .bg-circle {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, var(--electric-blue) 0%, transparent 70%);
        opacity: 0.1;
        animation: pulse 4s ease-in-out infinite;
      }
      
      .bg-circle-1 {
        width: 300px;
        height: 300px;
        top: 10%;
        right: 10%;
        animation-delay: 0s;
      }
      
      .bg-circle-2 {
        width: 200px;
        height: 200px;
        bottom: 20%;
        left: 10%;
        animation-delay: 2s;
      }
      
      .bg-circle-3 {
        width: 150px;
        height: 150px;
        top: 50%;
        left: 50%;
        animation-delay: 1s;
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      
      @media (max-width: 768px) {
        .hero-content {
          grid-template-columns: 1fr;
          gap: 2rem;
          text-align: center;
        }
        
        .hero-buttons {
          justify-content: center;
        }
        
        .floating-card {
          max-width: 300px;
          margin: 0 auto;
        }
      }
    </style>
  `
}