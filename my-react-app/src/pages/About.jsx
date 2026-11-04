import { motion } from "framer-motion";
import nikeAirMax from "../assets/images/nike-air-max.jpg";
import {
  ArrowUpRight,
  ShieldCheck,
  Gem,
  Footprints,
  Heart,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";
import "./About.css";

const values = [
  {
    number: "01",
    icon: Gem,
    title: "Quality Without Compromise",
    description:
      "Every pair is selected with attention to materials, finish, comfort, and the details that make a difference.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Confidence in Every Step",
    description:
      "Shop with clarity through transparent product information, dependable service, and a customer-first experience.",
  },
  {
    number: "03",
    icon: Footprints,
    title: "Made for Your Lifestyle",
    description:
      "From everyday essentials to statement sneakers, discover styles that move effortlessly with your life.",
  },
  {
    number: "04",
    icon: Heart,
    title: "Customers Come First",
    description:
      "Your experience matters to us. We aim to make discovering, choosing, and enjoying your next pair simple.",
  },
];

function About() {
  return (
    <main className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="about-eyebrow">
            THE AKASH STORE STORY
          </span>

          <h1>
            More Than Shoes.
            <br />
            <span>A Way of Moving.</span>
          </h1>

          <p>
            We believe the right pair does more than complete an outfit.
            It gives you the confidence to express yourself, the comfort
            to keep moving, and the freedom to make every step your own.
          </p>

          <a href="#our-story" className="about-primary-btn">
            Discover Our Story
            <ArrowUpRight size={18} />
          </a>
        </motion.div>

        <motion.div
          className="about-hero-visual"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="about-image-frame">
            <img
              src={nikeAirMax}
              alt="Premium sneaker from the Solest collection"
            />
            <div className="about-image-label">
              <span>THE ART OF EVERYDAY STYLE</span>
              <span>Solest / EST. 2026</span>
            </div>
          </div>
          <div className="about-orbit-text">STEP INTO YOUR OWN</div>
        </motion.div>

        <div className="about-hero-bottom">
          <span>BUILT AROUND YOUR EVERY STEP</span>
          <span>01 — OUR PHILOSOPHY</span>
        </div>
      </section>

      {/* STORY */}
      <section className="about-story" id="our-story">
        <div className="about-story-label">
          <span>01 / OUR STORY</span>
          <div className="about-small-line" />
        </div>

        <div className="about-story-content">
          <h2>
            Great style begins
            <br />
            <span>from the ground up.</span>
          </h2>

          <div className="about-story-copy">
            <p>
              At Solest, sneakers are more than something you wear.
              They are part of your identity, your everyday routine,
              and the moments that move you forward.
            </p>

            <p>
              Our philosophy is simple: bring together distinctive
              design, considered quality, lasting comfort, and a
              shopping experience that feels as good as your next pair.
            </p>

            <p>
              We want you to find sneakers that feel right, look
              exceptional, and fit naturally into your world.
              Because luxury is not only about appearance. It is
              about the care behind every detail.
            </p>
          </div>
        </div>
      </section>

      {/* QUALITY */}
      <section className="about-quality">
        <div className="about-quality-heading">
          <span className="about-eyebrow">THE STANDARD WE BELIEVE IN</span>

          <h2>
            Details matter.
            <br />
            <span>Every single one.</span>
          </h2>

          <p>
            Premium style should feel considered, from the first look
            to the last step of the day.
          </p>
        </div>

        <div className="about-values-grid">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.article
                className="about-value-card"
                key={value.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <div className="about-value-top">
                  <span>{value.number}</span>
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* PROMISE */}
      <section className="about-promise">
        <div className="about-promise-content">
          <span className="about-eyebrow">OUR PROMISE TO YOU</span>

          <h2>
            Luxury isn't just
            <br />
            what you wear.
            <br />
            <span>It's how you feel.</span>
          </h2>

          <p>
            We want every visit to Solest to leave you feeling
            confident in your choice. No unnecessary noise. Just
            considered style, clear information, and a commitment
            to making your experience better.
          </p>

          <a href="/collections" className="about-light-btn">
            Explore Our Collection
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="about-promise-stamp">
          <PackageCheck size={34} strokeWidth={1.2} />
          <span>QUALITY</span>
          <span>IN EVERY DETAIL</span>
          <div className="about-stamp-line" />
          <CheckCircle2 size={19} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="about-final">
        <span>YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>Find your next favourite.</h2>
        <p>Good shoes. Thoughtful choices. A style that feels like you.</p>

        <a href="/new-releases" className="about-final-link">
          Shop New Releases <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  );
}

export default About;