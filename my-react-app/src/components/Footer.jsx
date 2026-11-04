
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "./Footer.css";
import logo from "../assets/images/logo.png";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    alert("Thank you for joining AKASH STORE!");
    setEmail("");
  };

  return (
    <footer className="akash-footer" id="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
           <img
              src={logo}
              alt="Solest Logo"
              className="footer-logo-image"
            />

            <span>Solest</span>
          </div>

          <h2 className="footer-tagline">
            Step into your style.
            <br />
            Walk with confidence.
          </h2>

          <p className="footer-description">
            Discover footwear that combines timeless
            design, everyday comfort, and effortless style.
          </p>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
         

          <h2>
            Good shoes.
            <br />
            Great stories.
          </h2>

          <p>
            Get updates on new drops, exclusive collections,
            and styles worth stepping into.
          </p>

          <form
            className="footer-subscribe"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" aria-label="Subscribe">
              <ArrowRight size={20} />
            </button>
          </form>

          <span className="footer-note">
            STYLE IN YOUR INBOX. NO NOISE.
          </span>
        </div>
      </div>

      {/* Brand Promises */}
      <div className="footer-promise">
        <div>
          <span className="promise-number">01</span>
          <span>STYLE THAT SPEAKS</span>
        </div>

        <div>
          <span className="promise-number">02</span>
          <span>COMFORT EVERY STEP</span>
        </div>

        <div>
          <span className="promise-number">03</span>
          <span>MADE FOR YOUR EVERYDAY</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Solest.
          ALL RIGHTS RESERVED.
        </p>

        <a
          href="#"
          className="footer-back-top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          BACK TO TOP <ArrowUpRight size={15} />
        </a>

        <span>WALK YOUR WAY.</span>
      </div>
    </footer>
  );
}

export default Footer;
