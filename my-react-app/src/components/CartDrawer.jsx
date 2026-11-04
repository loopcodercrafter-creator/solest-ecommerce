
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  X,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

function CartDrawer({
  isOpen,
  onClose,
  cart,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  // Hooks must be inside the component
  const navigate = useNavigate();

  // Checkout navigation
  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (Number(String(item.price).replace(/[^\d.]/g, "")) || 0) *
        item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* CART DRAWER */}
          <motion.aside
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* HEADER */}
            <div className="cart-header">
              <div>
                <span>YOUR SHOPPING BAG</span>

                <h2>
                  Cart <small>({totalItems})</small>
                </h2>
              </div>

              <button onClick={onClose} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* CART PRODUCTS */}
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={45} />

                  <h3>Your cart is empty</h3>

                  <p>
                    Add your favorite sneakers to your bag.
                  </p>

                  <button onClick={onClose}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const price =
                    Number(
                      String(item.price).replace(/[^\d.]/g, "")
                    ) || 0;

                  return (
                    <motion.div
                      className="cart-item"
                      key={item.id}
                      layout
                    >
                      {/* IMAGE */}
                      <div className="cart-item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="cart-item-details">
                        <span>{item.category}</span>

                        <h3>{item.name}</h3>

                        <p>{item.color}</p>

                        <strong>
                          ₹{price.toLocaleString("en-IN")}
                        </strong>

                        {/* QUANTITY */}
                        <div className="quantity-control">
                          <button
                            onClick={() => onDecrease(item.id)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => onIncrease(item.id)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* REMOVE */}
                      <button
                        className="remove-item"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Subtotal</span>

                  <strong>
                    ₹{total.toLocaleString("en-IN")}
                  </strong>
                </div>

                <p className="shipping-text">
                  Shipping calculated at checkout.
                </p>

                <button
                  className="checkout-button"
                  onClick={handleCheckout}
                >
                  Checkout
                  <span>→</span>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
