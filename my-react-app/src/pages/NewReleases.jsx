import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import modelImage from "../assets/images/model.png";
import shoes from "../data/shoes";
import "./NewReleases.css";

const categories = [
  "All",
  "Running",
  "Lifestyle",
  "Performance",
  "Streetwear",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.96,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

function NewReleases({ onAddToCart = () => {} }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedId, setAddedId] = useState(null);

  // Only show products marked as new.
  const newShoes = Array.isArray(shoes)
    ? shoes.filter((shoe) => shoe.isNew)
    : [];

  const filteredShoes =
    activeCategory === "All"
      ? newShoes
      : newShoes.filter(
          (shoe) => shoe.category === activeCategory
        );

  const handleAddToBag = (shoe) => {
    onAddToCart(shoe);
    setAddedId(shoe.id);

    setTimeout(() => {
      setAddedId((current) =>
        current === shoe.id ? null : current
      );
    }, 1200);
  };

  return (
    <main className="new-releases-page">
      <section className="releases-hero">
        <motion.div
          className="releases-hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="releases-eyebrow">
            SOLEST / JUST DROPPED
          </span>

          <h1>
            Fresh kicks.
            <br />
            <span>New energy.</span>
          </h1>

          <p>
            Meet the latest sneakers built for your next move.
            Discover new silhouettes, fresh colorways, and
            everyday essentials.
          </p>

          <a href="#latest-shoes" className="releases-cta">
            EXPLORE THE DROP
            <ArrowUpRight size={17} />
          </a>
        </motion.div>

       <motion.div
  className="releases-hero-art"
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 0.15 }}
>
  <img
    src={modelImage}
    alt="Model wearing sneakers"
    className="releases-model-image"
  />

  <div className="hero-image-overlay" />

</motion.div>
      </section>

      <section
        className="releases-shoes-section"
        id="latest-shoes"
      >
        <div className="releases-section-heading">
          <div>
            <span className="releases-eyebrow">
              THE LATEST COLLECTION
            </span>
            <h2>
              New releases<span>.</span>
            </h2>
          </div>

          <span className="releases-count">
            {filteredShoes.length} SHOES
          </span>
        </div>

        <div className="releases-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "release-filter active"
                  : "release-filter"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div
          className="releases-grid"
          layout
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="releases-grid-inner"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {filteredShoes.map((shoe) => (
                <motion.article
                  layout
                  key={shoe.id}
                  className="release-card"
                  variants={cardVariants}
                  whileHover={{
                    y: -7,
                    transition: { duration: 0.25 },
                  }}
                >
                  <div className="release-image-wrap">
                    <span className="release-badge">
                      NEW DROP
                    </span>

                    <motion.img
                      src={shoe.image}
                      alt={shoe.name}
                      className="release-image"
                      loading="lazy"
                      whileHover={{
                        scale: 1.07,
                        rotate: -2,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0";
                      }}
                    />

                    <motion.button
                      type="button"
                      className="release-quick-add"
                      onClick={() => handleAddToBag(shoe)}
                      whileTap={{ scale: 0.94 }}
                      aria-label={`Add ${shoe.name} to bag`}
                    >
                      <ShoppingBag size={17} />
                      {addedId === shoe.id
                        ? "ADDED TO BAG"
                        : "ADD TO BAG"}
                    </motion.button>
                  </div>

                  <div className="release-shoes-info">
                    <div>
                      <span className="release-category">
                        {shoe.category}
                      </span>
                      <h3>{shoe.name}</h3>
                      <p className="release-color">
                        {shoe.color}
                      </p>
                    </div>

                    <span className="release-price">
                      ₹{Number(shoe.price || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {filteredShoes.length === 0 && (
          <div className="releases-empty">
            No new releases in this category yet.
          </div>
        )}
      </section>

      <section className="release-bottom-banner">
        <span>YOUR NEXT FAVORITE STARTS HERE</span>
        <h2>Make every step count.</h2>
        <a href="#latest-shoes">
          SHOP THE LATEST <ArrowUpRight size={17} />
        </a>
      </section>
    </main>
  );
}

export default NewReleases;