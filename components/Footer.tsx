const socialLinks = [
  {
    label: "Facebook",
    short: "Fb",
    href: "https://www.facebook.com/mohamed.hesham.design1/",
  },
  {
    label: "Instagram",
    short: "Ig",
    href: "https://www.instagram.com/mohamed.hesham.design1/?hl=en",
  },
  {
    label: "LinkedIn",
    short: "in",
    href: "https://www.linkedin.com/in/mohamedheshamdesign/",
  },
  {
    label: "Behance",
    short: "Be",
    href: "https://www.behance.net/mohamedheshamdesign",
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-name">
          © {new Date().getFullYear()} —{" "}
          <strong>Mohamed Hisham</strong>. All rights reserved.
        </div>

        <div className="footer-socials">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
            >
              <span className="footer-social-short">
                {social.short}
              </span>

              <span className="footer-social-label">
                {social.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}