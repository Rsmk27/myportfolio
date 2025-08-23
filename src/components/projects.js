export function createProjects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, and real-time inventory tracking.",
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "#",
      live: "#"
    },
    {
      title: "Task Management App",
      description: "A collaborative project management tool with real-time updates, drag-and-drop functionality, and team collaboration features built with Vue.js and Socket.io.",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL"],
      github: "#",
      live: "#"
    },
    {
      title: "AI-Powered Analytics Dashboard",
      description: "An intelligent analytics platform that provides insights through machine learning algorithms. Built with Python, React, and integrated with various data sources.",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Python", "React", "TensorFlow", "D3.js"],
      github: "#",
      live: "#"
    },
    {
      title: "Mobile Banking App",
      description: "A secure mobile banking application with biometric authentication, transaction history, and budget tracking features. Built with React Native and secure backend APIs.",
      image: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["React Native", "Node.js", "JWT", "Biometrics"],
      github: "#",
      live: "#"
    },
    {
      title: "Social Media Platform",
      description: "A modern social networking platform with real-time messaging, content sharing, and advanced privacy controls. Features include stories, live streaming, and AI content moderation.",
      image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Next.js", "GraphQL", "Redis", "WebRTC"],
      github: "#",
      live: "#"
    },
    {
      title: "IoT Smart Home System",
      description: "An integrated smart home management system that controls lighting, temperature, security, and energy consumption through a unified dashboard and mobile app.",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["React", "MQTT", "Raspberry Pi", "AWS IoT"],
      github: "#",
      live: "#"
    }
  ];

  return `
    <section id="projects" class="section projects">
      <div class="container">
        <h2 class="section-title animate-on-scroll">Featured Projects</h2>
        <div class="projects-grid">
          ${projects.map((project, index) => `
            <div class="project-card animate-on-scroll" style="--delay: ${index * 0.1}s">
              <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                  <div class="project-links">
                    <a href="${project.github}" class="project-link" aria-label="View GitHub">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="${project.live}" class="project-link" aria-label="View Live Demo">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15,3 21,3 21,9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                  ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <style>
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .project-card {
        background: var(--secondary-dark);
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        animation-delay: var(--delay);
      }
      
      .project-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, var(--electric-blue) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: 1;
        pointer-events: none;
      }
      
      .project-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 102, 255, 0.15);
        border-color: var(--electric-blue);
      }
      
      .project-card:hover::before {
        opacity: 0.05;
      }
      
      .project-image {
        position: relative;
        height: 200px;
        overflow: hidden;
      }
      
      .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }
      
      .project-card:hover .project-image img {
        transform: scale(1.1);
      }
      
      .project-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s ease;
      }
      
      .project-card:hover .project-overlay {
        opacity: 1;
      }
      
      .project-links {
        display: flex;
        gap: 1rem;
      }
      
      .project-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: var(--electric-blue);
        color: white;
        border-radius: 50%;
        text-decoration: none;
        transition: all 0.3s ease;
        transform: translateY(20px);
      }
      
      .project-card:hover .project-link {
        transform: translateY(0);
      }
      
      .project-link:hover {
        background: var(--electric-blue-light);
        transform: translateY(-5px) scale(1.1);
      }
      
      .project-content {
        padding: 1.5rem;
        position: relative;
        z-index: 2;
      }
      
      .project-title {
        color: var(--text-primary);
        margin-bottom: 1rem;
        font-size: 1.3rem;
      }
      
      .project-description {
        margin-bottom: 1.5rem;
        line-height: 1.6;
        font-size: 0.95rem;
      }
      
      .project-technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .tech-tag {
        background: var(--tertiary-dark);
        color: var(--electric-blue);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
        border: 1px solid var(--electric-blue);
        transition: all 0.3s ease;
      }
      
      .tech-tag:hover {
        background: var(--electric-blue);
        color: var(--text-primary);
        transform: translateY(-2px);
      }
      
      @media (max-width: 768px) {
        .projects-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .project-card {
          margin: 0 auto;
          max-width: 400px;
        }
        
        .project-image {
          height: 180px;
        }
      }
      
      @media (max-width: 480px) {
        .projects-grid {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
      }
    </style>
  `
}