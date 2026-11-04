
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

// Existing Home / New Releases products
import shoes from "../data/shoes";

// Men and Women collections
import { menShoes } from "./Men";
import { womenShoes } from "./Women";

import "./ProductDetails.css";

const sizes = [6, 7, 8, 9, 10];

const reviews = [
  {
    name: "Rahul Sharma",
    date: "Recently purchased",
    rating: 5,
    title: "Amazing comfort and quality!",
    text: "The shoes look premium and feel very comfortable. Really happy with the purchase.",
  },
  {
    name: "Aman Verma",
    date: "Recently purchased",
    rating: 5,
    title: "Worth every penny",
    text: "Great design, excellent finishing and a very stylish look. Highly recommended.",
  },
  {
    name: "Priya Singh",
    date: "Recently purchased",
    rating: 4,
    title: "Beautiful sneakers",
    text: "Really like the design and comfort. Looks even better in person.",
  },
];

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Combine all product collections
  const allShoes = [
    ...shoes,
    ...menShoes,
    ...womenShoes,
  ];

  // Find selected product using URL ID
  const shoe = allShoes.find(
    (item) => String(item.id) === String(id)
  );

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  if (!shoe) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  // Handle numeric and string prices
  const price = Number(
    String(shoe.price).replace(/[^\d.]/g, "")
  );

  const displayPrice = price.toLocaleString("en-IN");

  // Add product to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select your shoe size first.");
      return;
    }

    if (onAddToCart) {
      onAddToCart({
        ...shoe,
        selectedSize,
        quantity,
      });
    }
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select your shoe size first.");
      return;
    }

    if (onAddToCart) {
      onAddToCart({
        ...shoe,
        selectedSize,
        quantity,
      });

      navigate("/checkout");
    }
  };

  // Check delivery availability
  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMessage(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    setDeliveryMessage(
      "Pincode saved! Delivery availability will be confirmed at checkout."
    );
  };

  return (
    <main className="product-details-page">

      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{shoe.category}</span>
        <span>/</span>
        <strong>{shoe.name}</strong>
      </div>

      {/* Main Product */}
      <section className="product-main-layout">

        {/* Product Gallery */}
        <div className="product-gallery">

          <div className="product-thumbnails">
            {[shoe.image].map((image, index) => (
              <button
                key={index}
                className={
                  activeImage === index ? "active" : ""
                }
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt={shoe.name} />
              </button>
            ))}
          </div>

          <div className="product-main-image">

            <span className="product-tag">
              {shoe.badge || "SOLEST EXCLUSIVE"}
            </span>

            <button
              className={`product-wishlist ${
                wishlist ? "wishlisted" : ""
              }`}
              onClick={() => setWishlist(!wishlist)}
              aria-label="Toggle Wishlist"
            >
              <Heart
                size={22}
                fill={wishlist ? "currentColor" : "none"}
              />
            </button>

            <img
              src={shoe.image}
              alt={shoe.name}
            />

          </div>

        </div>

        {/* Product Information */}
        <div className="product-information">

          <span className="product-category">
            {shoe.category}
          </span>

          <h1>{shoe.name}</h1>

          <p className="product-description">
            {shoe.description ||
              "Designed for everyday comfort, modern style, and premium performance. Make every step count with Solest."}
          </p>

          <div className="product-rating">
            <span className="rating-number">
              4.8 <Star size={14} fill="currentColor" />
            </span>

            <span>128 Ratings & Reviews</span>
          </div>

          <div className="product-price-section">

            <div className="product-current-price">
              ₹{displayPrice}
            </div>

            <span className="product-price-note">
              Inclusive of all taxes
            </span>

          </div>

          <div className="product-divider" />

          {/* Product Colour */}
          <div className="product-color-section">
            <h3>Colour</h3>
            <p>{shoe.color || "Classic Edition"}</p>
          </div>

          {/* Size */}
          <div className="product-size-section">

            <div className="product-section-heading">
              <h3>Select Size</h3>
              <span>UK SIZE</span>
            </div>

            <div className="product-size-options">

              {sizes.map((size) => (
                <button
                  key={size}
                  className={
                    selectedSize === size ? "active" : ""
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}

            </div>

            {!selectedSize && (
              <p className="size-hint">
                Please select your preferred size.
              </p>
            )}

          </div>

          {/* Quantity */}
          <div className="product-quantity-section">

            <h3>Quantity</h3>

            <div className="quantity-control">

              <button
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity((previous) => previous - 1)
                }
              >
                <Minus size={15} />
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((previous) => previous + 1)
                }
              >
                <Plus size={15} />
              </button>

            </div>

          </div>

          {/* Buttons */}
          <div className="product-action-buttons">

            <button
              className="product-add-cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={19} />
              ADD TO CART
            </button>

            <button
              className="product-buy-now"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>

          </div>

          {/* Delivery */}
          <div className="product-delivery-box">

            <div className="delivery-heading">
              <Truck size={21} />
              <h3>Check Delivery Availability</h3>
            </div>

            <div className="delivery-input">

              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => {
                  setPincode(
                    e.target.value.replace(/\D/g, "")
                  );

                  setDeliveryMessage("");
                }}
              />

              <button onClick={checkDelivery}>
                CHECK
              </button>

            </div>

            {deliveryMessage && (
              <p className="delivery-message">
                {deliveryMessage}
              </p>
            )}

          </div>

          {/* Benefits */}
          <div className="product-benefits">

            <div>
              <Truck size={20} />
              <span>Delivery Information</span>
            </div>

            <div>
              <ShieldCheck size={20} />
              <span>Quality Assured</span>
            </div>

            <div>
              <RotateCcw size={20} />
              <span>Easy Support</span>
            </div>

          </div>

        </div>

      </section>

      {/* Product Highlights */}
      <section className="product-highlights">

        <div className="product-section-title">

          <span>THE SOLEST STANDARD</span>

          <h2>Made to move with you.</h2>

          <p>
            A combination of everyday comfort, modern design
            and a style that speaks for itself.
          </p>

        </div>

        <div className="highlight-grid">

          <div>
            <CheckCircle2 />
            <h3>Everyday Comfort</h3>
            <p>
              Designed for comfort throughout your day.
            </p>
          </div>

          <div>
            <CheckCircle2 />
            <h3>Modern Design</h3>
            <p>
              A versatile look for your everyday wardrobe.
            </p>
          </div>

          <div>
            <CheckCircle2 />
            <h3>Quality Focused</h3>
            <p>
              Style and functionality come together.
            </p>
          </div>

        </div>

      </section>

      {/* Reviews */}
      <section className="product-reviews">

        <div className="reviews-heading">

          <div>
            <span>COMMUNITY FEEDBACK</span>
            <h2>Customer Reviews</h2>
          </div>

          <div className="reviews-overall">

            <strong>4.8</strong>

            <div>
              <div className="review-stars">
                ★★★★★
              </div>

              <span>Sample rating display</span>
            </div>

          </div>

        </div>

        <div className="review-summary">

          <div className="review-summary-score">

            <strong>4.8</strong>

            <div className="review-stars">
              ★★★★★
            </div>

            <span>Demo rating</span>

          </div>

          <div className="review-bars">

            {[5, 4, 3, 2, 1].map((rating) => (
              <div className="review-bar-row" key={rating}>

                <span>{rating} ★</span>

                <div className="review-bar">

                  <span
                    style={{
                      width:
                        rating === 5 ? "85%" :
                        rating === 4 ? "12%" :
                        "3%"
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>

        <div className="customer-review-grid">

          {reviews.map((review, index) => (
            <article
              className="customer-review"
              key={index}
            >

              <div className="customer-review-top">

                <div className="review-avatar">
                  {review.name.charAt(0)}
                </div>

                <div>
                  <h3>{review.name}</h3>
                  <span>{review.date}</span>
                </div>

                <CheckCircle2
                  size={17}
                  className="review-verified"
                />

              </div>

              <div className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <h4>{review.title}</h4>

              <p>{review.text}</p>

            </article>
          ))}

        </div>

        <p className="review-demo-note">
          These are sample reviews for design preview, not
          verified customer feedback.
        </p>

      </section>

    </main>
  );
}

export default ProductDetails;
