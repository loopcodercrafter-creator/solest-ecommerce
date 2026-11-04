import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import shoes from "../data/shoes";

function Navbar({ cartCount = 0, onCartClick }) {

  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shoe_store_user"));
    } catch {
      return null;
    }
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShoe, setSelectedShoe] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(
          JSON.parse(localStorage.getItem("shoe_store_user"))
        );
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("user-updated", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("user-updated", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  const getInitials = (user) => {
    const fullName =
      user?.name ||
      user?.full_name ||
      [user?.first_name, user?.last_name]
        .filter(Boolean)
        .join(" ") ||
      "";

    if (!fullName.trim()) return "U";

    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  const filteredShoes = shoes.filter((shoe) => {
    const searchText = searchQuery.trim().toLowerCase();

    if (!searchText) return true;

    return (
      shoe.name.toLowerCase().includes(searchText) ||
      shoe.category.toLowerCase().includes(searchText) ||
      shoe.description.toLowerCase().includes(searchText)
    );
  });

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedShoe(null);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setSearchQuery("");
    setSelectedShoe(null);
  };

  return (
    <>
      <nav className="navbar">

        <div className="logo">
          <Link to="/" onClick={closeSearch}>
            <img src={logo} alt="Solest Logo" />
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/new-releases">New Releases</Link>
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/about-us">About Us</Link>
        </div>

        <div className="nav-actions">

          {/* Search Button */}
          <button
            type="button"
            aria-label="Search Products"
            onClick={() =>
              searchOpen ? closeSearch() : openSearch()
            }
          >
            {searchOpen ? (
              <X size={21} strokeWidth={1.7} />
            ) : (
              <Search size={21} strokeWidth={1.7} />
            )}
          </button>

          {/* Profile */}
          <Link
            to="/profile"
            className="profile-button"
            aria-label="My Profile"
            title={user?.name || "My Profile"}
          >
            <span>{getInitials(user)}</span>
          </Link>

          {/* Cart */}
          <button
            type="button"
            className="cart-button"
            aria-label="Shopping Bag"
            onClick={onCartClick}
          >
            <ShoppingBag size={21} strokeWidth={1.7} />

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>

          {/* Menu */}
          <button
            type="button"
            className="menu-button"
            aria-label="Open Menu"
          >
            <Menu size={22} strokeWidth={1.7} />
          </button>

        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="search-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div className="search-container">

            <div className="search-heading">
              <div>
                <span className="search-eyebrow">
                  SOLEST / DISCOVER
                </span>
                <h2>Find your next pair.</h2>
              </div>

              <button
                className="search-close"
                onClick={closeSearch}
                aria-label="Close Search"
              >
                <X size={23} />
              </button>
            </div>

            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={23} />

              <input
                type="text"
                autoFocus
                placeholder="Search shoes, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedShoe(null);
                }}
              />

              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedShoe(null);
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Search Results */}
            <div className="search-results">

              <div className="search-results-heading">
                <span>
                  {searchQuery
                    ? "SEARCH RESULTS"
                    : "ALL PRODUCTS"}
                </span>

                <span>
                  {filteredShoes.length} PRODUCTS
                </span>
              </div>

              {filteredShoes.length > 0 ? (
               
/* Search Results */
<div className="search-results">

  {!searchQuery.trim() ? (
    <div className="search-empty">
      <Search size={35} />
      <h3>What are you looking for?</h3>
      <p>
        Search for your favourite shoes by name or category.
      </p>
    </div>
  ) : (
    <>
      <div className="search-results-heading">
        <span>SEARCH RESULTS</span>
        <span>{filteredShoes.length} PRODUCTS</span>
      </div>

      {filteredShoes.length > 0 ? (
        <div className="search-products-grid">
          {filteredShoes.map((shoe) => (
            <button
              type="button"
              className={`search-product-card ${
                selectedShoe?.id === shoe.id ? "selected" : ""
              }`}
              key={shoe.id}
             onClick={() => {
              closeSearch();
              navigate(`/product/${shoe.id}`);
            }}
                >
              <div className="search-product-image">
                <img src={shoe.image} alt={shoe.name} />

                <span className="search-product-arrow">
                  <ArrowUpRight size={19} />
                </span>
              </div>

              <div className="search-product-info">
                <span>{shoe.category}</span>
                <h3>{shoe.name}</h3>
                <p>₹{shoe.price}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="search-empty">
          <Search size={35} />
          <h3>No products found</h3>
          <p>Try another shoe name or category.</p>
        </div>
      )}
    </>
  )}

</div>

              ) : (
                <div className="search-empty">
                  <Search size={35} />
                  <h3>No products found</h3>
                  <p>
                    Try another shoe name or category.
                  </p>
                </div>
              )}

            </div>

            {selectedShoe && (
              <div className="search-selected-product">
                <img
                  src={selectedShoe.image}
                  alt={selectedShoe.name}
                />

                <div>
                  <span>SELECTED PRODUCT</span>
                  <h3>{selectedShoe.name}</h3>
                  <p>{selectedShoe.description}</p>
                  <strong>₹{selectedShoe.price}</strong>
                </div>

                <button
                  onClick={() => setSelectedShoe(null)}
                  aria-label="Back to results"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
            )}

            <div className="search-footer">
              <span>SO﻿LEST — STEP INTO YOUR STYLE.</span>
              <span>PRESS ESC TO CLOSE</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
