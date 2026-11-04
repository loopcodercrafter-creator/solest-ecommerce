
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import "./ShoeCard.css";

const API_BASE = "http://127.0.0.1:8000/api";

function ProductCard({ shoe, onAddToCart }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check whether this shoe is already wishlisted
  useEffect(() => {
    const loadWishlistStatus = async () => {
      const token = localStorage.getItem("shoe_store_token");

      if (!token || !shoe) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/wishlist`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load wishlist.");
        }

        const items = Array.isArray(data)
          ? data
          : data.wishlist || [];

        setIsWishlisted(
          items.some(
            (item) => String(item.product_id) === String(shoe.id)
          )
        );
      } catch (error) {
        console.error("Wishlist status error:", error);
      }
    };

    loadWishlistStatus();
  }, [shoe?.id]);

  // Add or remove shoe from wishlist
  const toggleWishlist = async () => {
    const token = localStorage.getItem("shoe_store_token");

    if (!token) {
      alert("Please login to add shoes to your wishlist.");
      return;
    }

    if (wishlistLoading || !shoe) return;

    setWishlistLoading(true);

    try {
      const response = await fetch(
        isWishlisted
          ? `${API_BASE}/wishlist/${shoe.id}`
          : `${API_BASE}/wishlist`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(!isWishlisted && {
            body: JSON.stringify({
              product_id: String(shoe.id),
              name: shoe.name,
              category: shoe.category || "",
              price:
                Number(
                  String(shoe.price || "")
                    .replace(/[₹,/-]/g, "")
                    .trim()
                ) || 0,
              image:
                typeof shoe.image === "string"
                  ? shoe.image
                  : "",
            }),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Wishlist update failed.");
      }

      setIsWishlisted((previous) => !previous);

      window.dispatchEvent(new Event("shoe-wishlist-updated"));

    } catch (error) {
      alert(error.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (!shoe) return null;

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="product-image">

        {/* Wishlist Button */}
        <button
          className={`product-heart ${
            isWishlisted ? "wishlisted" : ""
          }`}
          type="button"
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={18}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        <img
          src={shoe.image}
          alt={shoe.name}
        />

        {/* Add to Cart */}
        <button
          className="product-add"
          type="button"
          onClick={() => onAddToCart(shoe)}
          aria-label={`Add ${shoe.name} to cart`}
        >
          <Plus size={20} />
        </button>

      </div>

      <div className="product-info">
        <div>
          <span>{shoe.category}</span>
          <h3>{shoe.name}</h3>
        </div>

        <strong>₹{shoe.price}</strong>
      </div>

    </motion.article>
  );
}

export default ProductCard;
