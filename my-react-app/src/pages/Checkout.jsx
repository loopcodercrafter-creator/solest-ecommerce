import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/images/logo.png";
import "./Checkout.css";

function Checkout({ cart = [], onPlaceOrder }) {
  const navigate = useNavigate();
  const [payment, setPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState("");
const [savingOrder, setSavingOrder] = useState(false);

  const getPrice = (price) =>
    Number(String(price ?? 0).replace(/[^\d.]/g, "")) || 0;

  const subtotal = cart.reduce(
    (sum, item) => sum + getPrice(item.price) * (item.quantity || 1),
    0
  );

  const shipping = subtotal === 0 || subtotal >= 3000 ? 0 : 100;
  const total = subtotal + shipping;

  const totalItems = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

 const API_BASE = "http://127.0.0.1:8000/api";

const handleSubmit = async (event) => {
  event.preventDefault();
  setOrderError("");

  if (cart.length === 0) {
    setOrderError("Your cart is empty.");
    return;
  }

  const token = localStorage.getItem("shoe_store_token");

  if (!token) {
    setOrderError("Please log in before placing your order.");
    return;
  }

  const formData = new FormData(event.currentTarget);

  const orderData = {
    customer_name: [
      formData.get("firstName"),
      formData.get("lastName"),
    ]
      .filter(Boolean)
      .join(" "),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
    country: formData.get("country"),
    payment_method: payment,
    subtotal,
    shipping,
    items: cart.map((item) => ({
      id: item.id,
      name: item.name || item.title || "Sneakers",
      category: item.category || "Sneakers",
      image: item.image || null,
      price: getPrice(item.price),
      quantity: item.quantity || 1,
    })),
  };

  try {
    setSavingOrder(true);

    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      const validationError = data.errors
        ? Object.values(data.errors).flat()[0]
        : null;

      throw new Error(
        validationError ||
          data.message ||
          "Could not place your order."
      );
    }

   // Refresh My Orders dashboard
window.dispatchEvent(new Event("shoe-orders-updated"));

onPlaceOrder?.();

setOrderPlaced(true);
  } catch (error) {
    setOrderError(error.message || "Unable to connect to the server.");
  } finally {
    setSavingOrder(false);
  }
};

  if (orderPlaced) {
    return (
      <main className="checkout-success">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="success-card"
        >
          <CheckCircle2 size={64} strokeWidth={1.4} />

          <span className="checkout-eyebrow">ORDER CONFIRMED</span>

          <h1>You're all set.</h1>

          <p>
            Your demo order has been placed successfully.
            No payment has been processed.
          </p>

          <button type="button" onClick={() => navigate("/")}>
            Continue Shopping <span>→</span>
          </button>
        </motion.div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-empty">
        <ShoppingBag size={48} strokeWidth={1.3} />

        <h1>Your bag is empty</h1>

        <p>Add your favourite sneakers before checking out.</p>

        <button type="button" onClick={() => navigate("/")}>
          Back to Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      {/* Checkout Navbar */}
      <header className="checkout-topbar">
        <button
          type="button"
          className="checkout-back"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          <span>Continue shopping</span>
        </button>

        <Link
          to="/"
          className="checkout-brand"
          aria-label="Solest home"
        >
          <img src={logo} alt="Solest Logo" />
        </Link>

        <div className="checkout-secure">
          <LockKeyhole size={15} />
          <span>SECURE CHECKOUT</span>
        </div>
      </header>

      {/* Page Heading */}
      <section className="checkout-heading">
        <span className="checkout-eyebrow">ALMOST YOURS</span>

        <h1>
          Checkout<span>.</span>
        </h1>

        <p>
          Complete your details and get your next favourite pair.
        </p>
      </section>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-form-column">
          {/* Contact Information */}
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step">01</span>

              <div>
                <h2>Contact information</h2>
                <p>Where can we reach you?</p>
              </div>
            </div>

            <div className="checkout-fields">
              <label className="checkout-field checkout-field-full">
                Email address
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="checkout-field">
                First name
                <input
                  name="firstName"
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="checkout-field">
                Last name
                <input
                  name="lastName"
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </label>

              <label className="checkout-field checkout-field-full">
                Phone number
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </label>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step">02</span>

              <div>
                <h2>Delivery address</h2>
                <p>Where should we deliver your sneakers?</p>
              </div>
            </div>

            <div className="checkout-fields">
              <label className="checkout-field checkout-field-full">
                Street address
                <input
                  name="address"
                  placeholder="House no., street, area"
                  autoComplete="street-address"
                  required
                />
              </label>

              <label className="checkout-field">
                City
                <input
                  name="city"
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label className="checkout-field">
                State
                <input
                  name="state"
                  placeholder="State"
                  autoComplete="address-level1"
                  required
                />
              </label>

              <label className="checkout-field">
                PIN code
                <input
                  name="pincode"
                  placeholder="6-digit PIN code"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </label>

              <label className="checkout-field">
                Country
                <input
                  name="country"
                  defaultValue="India"
                  autoComplete="country-name"
                  required
                />
              </label>
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step">03</span>

              <div>
                <h2>Payment method</h2>
                <p>Choose how you'd like to pay.</p>
              </div>
            </div>

            <div className="checkout-payment-options">
              <label
                className={`checkout-payment-option ${
                  payment === "cod" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={(event) => setPayment(event.target.value)}
                />

                <span className="checkout-radio" />

                <span className="checkout-payment-text">
                  <strong>Cash on delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
              </label>

              <label
                className={`checkout-payment-option ${
                  payment === "online" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={payment === "online"}
                  onChange={(event) => setPayment(event.target.value)}
                />

                <span className="checkout-radio" />

                <span className="checkout-payment-text">
                  <strong>Online payment</strong>
                  <small>
                    Demo option — no real payment is processed
                  </small>
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <aside className="checkout-summary">
          <div className="checkout-summary-title">
            <h2>Your order</h2>
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div className="checkout-summary-item" key={item.id}>
                <div className="checkout-product-image">
                  <img
                    src={item.image}
                    alt={item.name || "Sneakers"}
                  />

                  <span>{item.quantity || 1}</span>
                </div>

                <div className="checkout-product-info">
                  <h3>{item.name || item.title || "Sneakers"}</h3>

                  <p>{item.category || "Sneakers"}</p>

                  <span>Qty: {item.quantity || 1}</span>
                </div>

                <strong>
                  ₹
                  {(
                    getPrice(item.price) * (item.quantity || 1)
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-price-line">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="checkout-price-line">
            <span>Shipping</span>
            <span>
              {shipping === 0
                ? "FREE"
                : `₹${shipping.toLocaleString("en-IN")}`}
            </span>
          </div>

          <p className="checkout-shipping-note">
            {shipping === 0
              ? "You've unlocked free shipping."
              : "Free shipping on orders of ₹3,000 or more."}
          </p>

          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

            {orderError && (
              <p role="alert" className="checkout-error">
                {orderError}
              </p>
            )}

            <button
              type="submit"
              className="checkout-place-order"
              disabled={savingOrder}
            >
              {savingOrder ? "Placing Order..." : "Place Order"}
              {!savingOrder && <span> →</span>}
            </button>

            

          <p className="checkout-demo-note">
            <LockKeyhole size={13} />
            Demo checkout. No real payment is taken.
          </p>
        </aside>
      </form>
    </main>
  );
}

export default Checkout;