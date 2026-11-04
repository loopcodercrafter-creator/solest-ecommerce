import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

import Footer from "./Footer";
import "./Hero.css";

function Hero({
  shoes = [],
  activeShoe = 0,
  setActiveShoe = () => {},
  onAddToCart = () => {},
}) {
  const [favorites, setFavorites] = useState([]);
const [wishlistLoading, setWishlistLoading] = useState(false);

const navigate = useNavigate();

  const shoe = shoes[activeShoe];

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return "Price unavailable";
    }

    const numericPrice = Number(
      String(price).replace(/[^\d.]/g, "")
    );

    return Number.isFinite(numericPrice)
      ? numericPrice.toLocaleString("en-IN")
      : price;
  };

 const toggleWishlist = async (item) => {
  if (!item || wishlistLoading) return;

  const token = localStorage.getItem("shoe_store_token");

  if (!token) {
    alert("Please login first to use wishlist.");
    return;
  }

  setWishlistLoading(true);

  const isWishlisted = favorites.includes(item.id);

  try {
    const response = await fetch(
      isWishlisted
        ? `http://127.0.0.1:8000/api/wishlist/${item.id}`
        : "http://127.0.0.1:8000/api/wishlist",
      {
        method: isWishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...(isWishlisted
          ? {}
          : {
              body: JSON.stringify({
                product_id: String(item.id),
                name: item.name,
                category: item.category,
                price: Number(
                  String(item.price).replace(/[^\d.]/g, "")
                ),
                image: item.image,
              }),
            }),
      }
    );

  const data = await response.json().catch(() => ({}));

console.log("Wishlist API Status:", response.status);
console.log("Wishlist API Response:", data);

if (!response.ok) {
  throw new Error(
    data.message || JSON.stringify(data) || "Wishlist update failed"
  );
}
    setFavorites((current) =>
      isWishlisted
        ? current.filter((id) => id !== item.id)
        : [...current, item.id]
    );
  } catch (error) {
    console.error("Wishlist error:", error);
    alert(error.message);
  } finally {
    setWishlistLoading(false);
  }
};

  const isFavorite = shoe
    ? favorites.includes(shoe.id)
    : false;

  if (!shoe) {
    return <Footer />;
  }

  return (
    <>
      <section className="luxury-hero" id="new">
        <div className="luxury-hero-inner">

          {/* Header and circular logo */}
          <div className="luxury-topline">
            <a href="/" className="luxury-brand">
               <img
                  src={logo}
                  alt="Solest Logo"
                  className="luxury-brand-logo"
                />
                Solest
            </a>

            <span className="luxury-eyebrow">
              <span className="status-dot" />
              THE ART OF EVERYDAY LUXURY
            </span>

            <span className="luxury-season">
              COLLECTION — 2026
            </span>
          </div>

          <div className="luxury-main-grid">

            {/* LEFT: Product information */}
            <div className="luxury-copy">
              <AnimatePresence mode="wait">
                <motion.div
                  key={shoe.id}
                  className="luxury-copy-content"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.38 }}
                >
                  <div className="luxury-product-index">
                    <span>EXCLUSIVE SELECTION</span>
                    <span className="index-line" />
                    <span>
                      {String(activeShoe + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="luxury-category">
                    {shoe.category}
                  </p>

                  <h1 className="luxury-title">
                    Designed
                    <br />
                    to <span>stand out.</span>
                  </h1>

                  <div className="luxury-name-row">
                    <div>
                      <p className="luxury-product-label">
                        FEATURED SILHOUETTE
                      </p>

                      <h2 className="luxury-product-name">
                        {shoe.name}
                      </h2>
                    </div>

                    <span className="luxury-product-number">
                      No. {String(shoe.id).padStart(3, "0")}
                    </span>
                  </div>

                  <p className="luxury-description">
                    {shoe.description}
                  </p>

                  <div className="luxury-price-row">
                    <div>
                      <span className="luxury-price-label">
                        YOUR NEXT EVERYDAY ESSENTIAL
                      </span>

                      <div className="luxury-price">
                        <strong>
                          ₹{formatPrice(shoe.price)}
                        </strong>

                        {shoe.oldPrice && (
                          <del>
                            ₹{formatPrice(shoe.oldPrice)}
                          </del>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`luxury-favorite ${
                        isFavorite ? "is-favorite" : ""
                      }`}
                    onClick={() => toggleWishlist(shoe)}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      aria-pressed={isFavorite}
                    >
                      <Heart
                        size={19}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="luxury-actions">
                    <button
                      type="button"
                      className="luxury-add-button"
                      onClick={() => onAddToCart(shoe)}
                    >
                      <span>Add to bag</span>

                      <span className="luxury-button-icon">
                        <ArrowRight size={19} />
                      </span>
                    </button>

                    <button
                      type="button"
                      className="luxury-explore-button"
                      onClick={() =>
                        document
                          .getElementById("luxury-shoe-selector")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          })
                      }
                    >
                      Explore collection
                      <ArrowUpRight size={17} />
                    </button>
                  </div>

                  <div className="luxury-benefits">
                    <div className="luxury-benefit">
                      <ShieldCheck size={18} strokeWidth={1.5} />
                      <span>Quality first</span>
                    </div>

                    <div className="luxury-benefit">
                      <Truck size={18} strokeWidth={1.5} />
                      <span>Delivery available</span>
                    </div>

                    <div className="luxury-benefit">
                      <RotateCcw size={18} strokeWidth={1.5} />
                      <span>Easy returns</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT: Animated shoe showcase */}
            <div className="luxury-visual">
              <div className="luxury-visual-top">
                <span>THE FEATURED EDIT</span>

                <span>
                  {String(activeShoe + 1).padStart(2, "0")} /{" "}
                  {String(shoes.length).padStart(2, "0")}
                </span>
              </div>

              <div className="luxury-artwork">
                <div className="luxury-orbit luxury-orbit-one" />
                <div className="luxury-orbit luxury-orbit-two" />
                <div className="luxury-backdrop" />
                <div className="luxury-light" />

                <AnimatePresence mode="wait">
                  <motion.img
                    key={shoe.id}
                    src={shoe.image}
                    alt={shoe.name}
                    className="luxury-main-shoe"
                    initial={{
                      opacity: 0,
                      x: 100,
                      y: 20,
                      scale: 0.78,
                      rotate: 12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -75,
                      y: -8,
                      scale: 0.82,
                      rotate: -10,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </AnimatePresence>

                <div className="luxury-image-caption">
                  <span>FORM MEETS FUNCTION</span>
                  <span>EST. 2026</span>
                </div>

                <div className="luxury-vertical-label">
                  THE SIGNATURE COLLECTION
                </div>
              </div>

              <div className="luxury-visual-bottom">
                <span>CRAFTED FOR YOUR EVERYDAY</span>
                <span>01 — DISCOVER</span>
              </div>
            </div>
          </div>

          {/* Interactive shoe selector */}
          <div
            className="luxury-selector-section"
            id="luxury-shoe-selector"
          >
            <div className="luxury-selector-heading">
              <div>
                <span className="luxury-selector-kicker">
                  FIND YOUR SIGNATURE
                </span>

                <h3>Explore the collection</h3>
              </div>

              <span className="luxury-selector-count">
                {String(shoes.length).padStart(2, "0")} PIECES
              </span>
            </div>

            <div className="luxury-selector">
              {shoes.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className={`luxury-selector-item ${
                    index === activeShoe ? "active" : ""
                  }`}
                  onClick={() => setActiveShoe(index)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Select ${item.name}`}
                  aria-pressed={index === activeShoe}
                >
                  <div className="luxury-thumb">
                    <span className="luxury-thumb-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                    />

                     <button
                        type="button"
                        className="luxury-wishlist-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        aria-label={`Add ${item.name} to wishlist`}
                      >
                        <Heart
                          size={17}
                          fill={
                            favorites.includes(item.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                    <span
                        className="luxury-thumb-arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${item.id}`);
                        }}
                      >
                        <ArrowUpRight size={17} />
                      </span>
                  </div>

                  <div className="luxury-thumb-info">
                    <div>
                      <span className="luxury-thumb-category">
                        {item.category}
                      </span>

                      <strong>{item.name}</strong>
                    </div>

                    <span className="luxury-thumb-price">
                      ₹{formatPrice(item.price)}
                    </span>
                  </div>

                  <span className="luxury-selector-underline" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="luxury-footer-line">
            <span>LESS, BUT BETTER.</span>
            <span>THOUGHTFULLY SELECTED. ALWAYS.</span>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Hero;
