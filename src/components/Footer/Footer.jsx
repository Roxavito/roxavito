import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a className="footer__logo" href="#">
            <span className="footer__logo-mark" aria-hidden="true" />
            Black Bulls
          </a>
          <p className="footer__tagline">Digital products for ambitious brands.</p>
        </div>

        <nav className="footer__cols" aria-label="Footer">
          <div className="footer__col">
            <p className="footer__col-title">Studio</p>
            <a href="#">Services</a>
            <a href="#">Showcase</a>
            <a href="#">About us</a>
          </div>
          <div className="footer__col">
            <p className="footer__col-title">Connect</p>
            <a href="#">Careers</a>
            <a href="#">Community</a>
            <a href="#">Contact</a>
          </div>
        </nav>
      </div>

      <div className="container footer__bottom">
        <span>Created with ♥ by Black Bulls</span>
        <span>© {year} Black Bulls</span>
      </div>
    </footer>
  );
}
