export function createContact() {
  return `
    <section id="contact" class="section contact">
      <div class="container">
        <h2 class="section-title animate-on-scroll">Get In Touch</h2>
        <div class="contact-content">
          <div class="contact-info animate-on-scroll">
            <h3>Let's Work Together</h3>
            <p>
              I'm always interested in new opportunities and exciting projects. 
              Whether you have a question, want to collaborate, or just want to say hi, 
              I'd love to hear from you.
            </p>
            <div class="contact-methods">
              <div class="contact-method">
                <div class="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="contact-details">
                  <h4>Email</h4>
                  <p>hello@rsmk.dev</p>
                </div>
              </div>
              <div class="contact-method">
                <div class="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div class="contact-details">
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div class="contact-method">
                <div class="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="contact-details">
                  <h4>Location</h4>
                  <p>San Francisco, CA</p>
                </div>
              </div>
            </div>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
          <form class="contact-form animate-on-scroll">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="subject">Subject</label>
              <input type="text" id="subject" name="subject" required>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p>&copy; 2024 RSMK. All rights reserved.</p>
          <p>Built with passion and modern web technologies.</p>
        </div>
      </div>
    </footer>
    
    <style>
      .contact {
        background: var(--secondary-dark);
      }
      
      .contact-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
      }
      
      .contact-info h3 {
        color: var(--electric-blue);
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      
      .contact-info p {
        margin-bottom: 2rem;
        font-size: 1.1rem;
      }
      
      .contact-methods {
        margin-bottom: 2rem;
      }
      
      .contact-method {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--primary-dark);
        border-radius: 8px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }
      
      .contact-method:hover {
        transform: translateX(10px);
        border-color: var(--electric-blue);
        box-shadow: 0 5px 15px var(--shadow-color);
      }
      
      .contact-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: var(--electric-blue);
        color: white;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .contact-details h4 {
        color: var(--text-primary);
        margin-bottom: 0.25rem;
        font-size: 1rem;
      }
      
      .contact-details p {
        color: var(--text-secondary);
        margin: 0;
        font-size: 0.9rem;
      }
      
      .social-links {
        display: flex;
        gap: 1rem;
      }
      
      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: var(--tertiary-dark);
        color: var(--text-secondary);
        border-radius: 50%;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
      }
      
      .social-link:hover {
        background: var(--electric-blue);
        color: white;
        transform: translateY(-5px);
        box-shadow: 0 10px 20px var(--shadow-color);
      }
      
      .contact-form {
        background: var(--primary-dark);
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid var(--border-color);
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 500;
      }
      
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 1rem;
        background: var(--secondary-dark);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
        resize: vertical;
      }
      
      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--electric-blue);
        box-shadow: 0 0 0 3px var(--shadow-color);
      }
      
      .btn-submit {
        width: 100%;
        justify-content: center;
      }
      
      .footer {
        background: var(--primary-dark);
        padding: 2rem 0;
        border-top: 1px solid var(--border-color);
        text-align: center;
      }
      
      .footer-content p {
        margin: 0.5rem 0;
        color: var(--text-muted);
        font-size: 0.9rem;
      }
      
      @media (max-width: 768px) {
        .contact-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .contact-method {
          flex-direction: column;
          text-align: center;
          gap: 0.5rem;
        }
        
        .contact-method:hover {
          transform: translateY(-5px);
        }
        
        .social-links {
          justify-content: center;
        }
      }
    </style>
  `
}