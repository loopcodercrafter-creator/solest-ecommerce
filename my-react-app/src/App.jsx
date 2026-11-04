
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import ProductDetails from "./pages/ProductDetails";

import Home from "./pages/Home";
import NewReleases from "./pages/NewReleases";
import Men from "./pages/Men";
import Women from "./pages/Women";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

import shoes from "./data/shoes";

function App() {
  const [activeShoe, setActiveShoe] = useState(0);

  // LOAD CART FROM LOCAL STORAGE
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("solest_cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        return Array.isArray(parsedCart) ? parsedCart : [];
      }

      return [];
    } catch (error) {
      console.error("Cart loading error:", error);
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  // SAVE CART AUTOMATICALLY
  useEffect(() => {
    try {
      localStorage.setItem("solest_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Cart saving error:", error);
    }
  }, [cart]);

  // PLACE ORDER
  const handlePlaceOrder = () => {
    setCart([]);
    setCartOpen(false);
  };

  // ADD TO CART
 const addToCart = (shoe) => {
  const quantityToAdd = shoe.quantity || 1;

  setCart((prevCart) => {
    const existing = prevCart.find(
      (item) =>
        item.id === shoe.id &&
        item.selectedSize === shoe.selectedSize
    );

    if (existing) {
      return prevCart.map((item) =>
        item.id === shoe.id &&
        item.selectedSize === shoe.selectedSize
          ? {
              ...item,
              quantity: item.quantity + quantityToAdd,
            }
          : item
      );
    }

    return [
      ...prevCart,
      {
        ...shoe,
        quantity: quantityToAdd,
      },
    ];
  });

  setCartOpen(true);
};

  // INCREASE QUANTITY
  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };

  // CART COUNTER
  const cartCount = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  return (
    <BrowserRouter>

      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <Routes>

        <Route
          path="/"
          element={
            <Home
              shoes={shoes}
              activeShoe={activeShoe}
              setActiveShoe={setActiveShoe}
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/New-Releases"
          element={
            <NewReleases
              shoes={shoes}
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/Men"
          element={
            <Men
              shoes={shoes}
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/Women"
          element={
            <Women
              shoes={shoes}
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              onPlaceOrder={handlePlaceOrder}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/about-us"
          element={<About />}
        />

        <Route
        path="/product/:id"
        element={<ProductDetails onAddToCart={addToCart} />}
      />

      </Routes>
      

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
      />

    </BrowserRouter>
  );
}

export default App;
