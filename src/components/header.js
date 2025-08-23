export function createHeader() {
  return `
    <header class="header">
      <nav class="nav">
        <div class="container">
          <div class="nav-content">
            <div class="logo">
              <span class="logo-text">RSMK</span>
            </div>
            <ul class="nav-links">
              <li><a href="#home" class="nav-link">Home</a></li>
              <li><a href="#about" class="nav-link">About</a></li>
              <li><a href="#projects" class="nav-link">Projects</a></li>
              <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <button class="mobile-menu-btn">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
    
    <style>
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }
      
      .nav-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
      }
      
      .logo-text {
        font-size: 1.8rem;
        font-weight: 700;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .nav-links {
        display: flex;
        list-style: none;
        gap: 2rem;
        margin: 0;
      }
      
      .nav-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
      }
      
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--electric-blue);
        transition: width 0.3s ease;
      }
      
      .nav-link:hover {
        color: var(--text-primary);
      }
      
      .nav-link:hover::after {
        width: 100%;
      }
      
      .mobile-menu-btn {
        display: none;
        flex-direction: column;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
      }
      
      .mobile-menu-btn span {
        width: 25px;
        height: 3px;
        background: var(--text-primary);
        transition: all 0.3s ease;
      }
      
      @media (max-width: 768px) {
        .nav-links {
          display: none;
        }
        
        .mobile-menu-btn {
          display: flex;
        }
      }
    </style>
  `
}