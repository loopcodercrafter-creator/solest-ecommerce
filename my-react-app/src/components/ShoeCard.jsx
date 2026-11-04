import { motion } from "framer-motion";

function ShoeCard({ shoe, active, onClick }) {
  return (
    <motion.button
      className={`shoe-card ${active ? "active" : ""}`}
      onClick={onClick}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.96 }}
    >

      <div className="card-image">

        <motion.img
          src={shoe.image}
          alt={shoe.name}
          animate={{
            scale: active ? 1.08 : 1,
            rotate: active ? -5 : 0
          }}
          transition={{
            duration: 0.4
          }}
        />

      </div>

      <div className="card-info">

        <span className="card-category">
          {shoe.category}
        </span>

        <h3>{shoe.name}</h3>

        <p>{shoe.price}</p>

      </div>

    </motion.button>
  );
}

export default ShoeCard;