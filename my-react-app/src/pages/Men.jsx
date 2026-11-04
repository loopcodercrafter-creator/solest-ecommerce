import React from "react";
import { Link } from "react-router-dom";
import "./Men.css";

import nikeAirMax from "../assets/images/nike-air-max.jpg";
import nikeAirForce from "../assets/images/nike-air-force.jpg";
import adidasUltraboost from "../assets/images/nike-ultraboost.jpg";
import nikeRSX from "../assets/images/nike-rs-x.jpg";
import nikeUltra from "../assets/images/nike-ultra.jpg";


export const menShoes = [
  {
    id: 201,
    name: "Nike Air Max",
    category: "Lifestyle Sneakers",
    price: 8999,
    color: "White / Black",
    image: nikeAirMax,
    badge: "BESTSELLER",
  },
  {
    id: 202,
    name: "Nike Air Force 1",
    category: "Running Sneakers",
    price: 7499,
    color: "Triple White",
    image: nikeAirForce,
    badge: "POPULAR",
  },
  {
    id: 203,
    name: "Nike Ultraboost",
    category: "Classic Sneakers",
    price: 9999,
    color: "Core Black",
    image: adidasUltraboost,
    badge: "NEW",
  },
   {
    id: 204,
    name: "Nike RS-X",
    category: "Streetwear Sneakers",
    price: 6499,
    color: "Grey / White",
    image: nikeRSX,
    badge: "",
  },
   {
    id: 205,
    name: "Nike Ultra",
    category: "Streetwear Sneakers",
    price: 6499,
    color: "Grey / White",
    image: nikeUltra,
    badge: "",
  },
];

function Men({ onAddToCart }) {
  const handleAddToCart = (shoe) => {
    if (onAddToCart) {
      onAddToCart(shoe);
    } else {
      console.log("Added to cart:", shoe.name);
    }
  };

  return (
    <main className="men-page">
      <section className="men-header">
        <p className="men-eyebrow">THE MEN'S COLLECTION</p>
        <h1>Built for <span>Every Move.</span></h1>
        <p className="men-description">
          Discover sneakers that combine everyday comfort,
          modern design, and street-ready style.
        </p>
        <div className="men-results">
          <span>{menShoes.length} Products</span>
          <span>New Season / 2026</span>
        </div>
      </section>

      <section className="men-product-grid">
        {menShoes.map((shoe) => (
          <article className="men-product-card" key={shoe.id}>
            <div className="men-product-image">
              {shoe.badge && (
                <span className="men-product-badge">
                  {shoe.badge}
                </span>
              )}

                  <Link to={`/product/${shoe.id}`}>
                    <img src={shoe.image} alt={shoe.name} />
                  </Link>

              <button
                className="men-quick-add"
                onClick={() => handleAddToCart(shoe)}
                aria-label={`Add ${shoe.name} to cart`}
              >
                +
              </button>
            </div>

            <div className="men-product-info">
              <p className="men-product-category">
                {shoe.category}
              </p>

             <Link
              to={`/product/${shoe.id}`}
              className="men-product-title-link"
            >
              <h2>{shoe.name}</h2>
            </Link>

              <p className="men-product-color">
                Colour: {shoe.color}
              </p>

              <div className="men-product-bottom">
                <span className="men-product-price">
                  ₹{shoe.price.toLocaleString("en-IN")}
                </span>

                <button
                  className="men-add-button"
                  onClick={() => handleAddToCart(shoe)}
                >
                  Add to Cart
                  <span>↗</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Men;