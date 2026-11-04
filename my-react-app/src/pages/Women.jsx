import React from "react";
import { Link } from "react-router-dom";
import "./Women.css";


import womenAirMax from "../assets/images/women1.jpg";
import womenAirForce from "../assets/images/women2.jpg";
import womenUltraboost from "../assets/images/women3.jpg";
import womenRSX from "../assets/images/women4.jpg";
import womenUltra from "../assets/images/women5.jpg";


export const womenShoes = [
  {
    id: 101,
    name: "Nike Air Max",
    category: "Lifestyle Sneakers",
    price: 8999,
    color: "White / Pink",
    image: womenAirMax,
    badge: "BESTSELLER",
  },
  {
    id: 102,
    name: "Nike Air",
    category: "Classic Sneakers",
    price: 7499,
    color: "Triple White",
    image: womenAirForce,
    badge: "POPULAR",
  },
  {
    id: 103,
    name: "Nike Ultraboost",
    category: "Running Sneakers",
    price: 9999,
    color: "Cream / Beige",
    image: womenUltraboost,
    badge: "NEW",
  },
  {
    id: 104,
    name: "Nike-X",
    category: "Streetwear Sneakers",
    price: 6499,
    color: "Pink / White",
    image: womenRSX,
    badge: "",
  },
   {
    id: 105,
    name: "Nike Ultra",
    category: "Streetwear Sneakers",
    price: 6499,
    color: "Pink / White",
    image: womenUltra,
    badge: "",
  },
];

function Women({ onAddToCart }) {
  const handleAddToCart = (shoe) => {
    if (onAddToCart) {
      onAddToCart(shoe);
    } else {
      console.log("Added to cart:", shoe.name);
    }
  };

  return (
    <main className="women-page">
      <section className="women-header">
        <p className="women-eyebrow">
          THE WOMEN'S COLLECTION
        </p>

        <h1>
          Style That <span>Moves You.</span>
        </h1>

        <p className="women-description">
          Discover your next favourite sneakers.
          Designed for everyday comfort, effortless style,
          and every adventure.
        </p>

        <div className="women-results">
          <span>{womenShoes.length} Products</span>
          <span>New Season / 2026</span>
        </div>
      </section>

      <section className="women-product-grid">
        {womenShoes.map((shoe) => (
          <article
            className="women-product-card"
            key={shoe.id}
          >
            <div className="women-product-image">
              {shoe.badge && (
                <span className="women-product-badge">
                  {shoe.badge}
                </span>
              )}

             <Link to={`/product/${shoe.id}`}>
              <img src={shoe.image} alt={shoe.name} />
            </Link>

              <button
                className="women-quick-add"
                onClick={() => handleAddToCart(shoe)}
                aria-label={`Add ${shoe.name} to cart`}
              >
                +
              </button>
            </div>

            <div className="women-product-info">
              <p className="women-product-category">
                {shoe.category}
              </p>

                <Link
                to={`/product/${shoe.id}`}
                className="women-product-title-link"
              >
                <h2>{shoe.name}</h2>
              </Link>

                  <p className="women-product-color">
                Colour: {shoe.color}
              </p>

              <div className="women-product-bottom">
                <span className="women-product-price">
                  ₹{shoe.price.toLocaleString("en-IN")}
                </span>

                <button
                  className="women-add-button"
                  onClick={() => handleAddToCart(shoe)}
                >
                  Add to Cart <span>↗</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Women;