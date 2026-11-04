
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock3,
  LockKeyhole, Mail, Phone, UserRound, Package,
  MapPin, Heart, ShoppingCart, CreditCard,
  LogOut, ChevronRight, Pencil, Bell, Ticket,
  CircleHelp, ShieldCheck
} from "lucide-react";
import "./Profile.css";

const API_BASE = "http://127.0.0.1:8000/api";

function Profile({ cart = [], setCart }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePreview, setProfilePreview] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [editProfile, setEditProfile] = useState(false);

  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  // Saved addresses
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState("");
  const [addressSaving, setAddressSaving] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const emptyAddress = {
    full_name: "",
    phone: "",
    address_line: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
    is_default: false,
  };

  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Cancel order
  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("shoe_store_token");

      const response = await fetch(
        `${API_BASE}/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel order.");
      }

      setUserOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );

      alert("Your order has been cancelled successfully.");
    } catch (error) {
      alert(error.message);
    }
  };

  // STEP 1: Upload or update profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoMessage("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoMessage("Image size must be less than 2 MB.");
      return;
    }

    const token = localStorage.getItem("shoe_store_token");

    if (!token) {
      setPhotoMessage("Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_photo", file);

    try {
      setPhotoLoading(true);
      setPhotoMessage("");

      const response = await fetch(`${API_BASE}/profile/photo`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Photo upload failed.");
      }

     setProfilePreview(data.profile_photo_url || "");

if (data.user) {
  setUser(data.user);

  localStorage.setItem(
    "shoe_store_user",
    JSON.stringify({
      ...data.user,
      profile_photo_url: data.profile_photo_url || "",
    })
  );

  window.dispatchEvent(new Event("user-updated"));
}

      setPhotoMessage("Profile photo updated successfully!");
    } catch (error) {
      setPhotoMessage(error.message);
    } finally {
      setPhotoLoading(false);
      e.target.value = "";
    }
  };

  // Remove profile photo
  const handleRemovePhoto = async () => {
    const token = localStorage.getItem("shoe_store_token");

    if (!token) {
      setPhotoMessage("Please log in again.");
      return;
    }

    try {
      setPhotoLoading(true);
      setPhotoMessage("");

      const response = await fetch(`${API_BASE}/profile/photo`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not remove photo.");
      }

    setProfilePreview("");

if (data.user) {
  setUser(data.user);

  localStorage.setItem(
    "shoe_store_user",
    JSON.stringify({
      ...data.user,
      profile_photo_url: "",
      profile_photo: null,
    })
  );

  window.dispatchEvent(new Event("user-updated"));
}

      setPhotoMessage("Profile photo removed successfully!");
    } catch (error) {
      setPhotoMessage(error.message);
    } finally {
      setPhotoLoading(false);
    }
  };

  // Fetch orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const token = localStorage.getItem("shoe_store_token");

      if (!token) {
        setOrdersError("Please log in to view your orders.");
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError("");

        const response = await fetch(`${API_BASE}/orders`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders.");
        }

        const formattedOrders = (data.orders || []).map((order) => {
          const firstItem = order.items?.[0];

          return {
            id: order.id,
            status: order.status || "Processing",
            name:
              order.items?.length > 1
                ? `${firstItem?.name || "Sneakers"} + ${order.items.length - 1} more`
                : firstItem?.name || "Sneakers",
            image: firstItem?.image || null,
            quantity: (order.items || []).reduce(
              (sum, item) => sum + Number(item.quantity || 0),
              0
            ),
            date: order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-IN")
              : "Date unavailable",
            total: `₹${Number(order.total || 0).toLocaleString("en-IN")}`,
            deliveryMessage: `Shipping to ${order.city || ""}`,
          };
        });

        setUserOrders(formattedOrders);
      } catch (error) {
        setOrdersError(error.message || "Unable to load orders.");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();

    window.addEventListener("shoe-orders-updated", fetchOrders);

    return () => {
      window.removeEventListener("shoe-orders-updated", fetchOrders);
    };
  }, [user]);

  // Fetch wishlist
  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      const token = localStorage.getItem("shoe_store_token");
      if (!token) return;

      try {
        setWishlistLoading(true);
        setWishlistError("");

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

        setWishlistItems(data.wishlist || []);
      } catch (error) {
        setWishlistError(error.message);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();

    window.addEventListener("shoe-wishlist-updated", fetchWishlist);

    return () => {
      window.removeEventListener("shoe-wishlist-updated", fetchWishlist);
    };
  }, [user]);

  // Remove wishlist item
  const removeWishlistItem = async (productId) => {
    const token = localStorage.getItem("shoe_store_token");

    try {
      const response = await fetch(
        `${API_BASE}/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove product.");
      }

      setWishlistItems((previous) =>
        previous.filter(
          (item) => String(item.product_id) !== String(productId)
        )
      );

      window.dispatchEvent(new Event("shoe-wishlist-updated"));
    } catch (error) {
      alert(error.message);
    }
  };

  // Fetch saved addresses
  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      const token = localStorage.getItem("shoe_store_token");
      if (!token) return;

      try {
        setAddressesLoading(true);
        setAddressesError("");

        const response = await fetch(`${API_BASE}/addresses`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load addresses.");
        }

        setAddresses(data.addresses || []);
      } catch (error) {
        setAddressesError(error.message);
      } finally {
        setAddressesLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  // OTP countdown
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = window.setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [seconds]);

  // Update profile picture when user changes
  useEffect(() => {
    if (user) {
      const photoUrl = user.profile_photo_url
        ? user.profile_photo_url
        : user.profile_photo
        ? `http://127.0.0.1:8000/storage/${user.profile_photo}`
        : "";

      setProfilePreview(photoUrl);
    }
  }, [user]);

  // Restore login session
  useEffect(() => {
    const token = localStorage.getItem("shoe_store_token");

    if (!token) {
      setCheckingSession(false);
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetch(`${API_BASE}/me`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("shoe_store_token");
          return;
        }
            localStorage.removeItem("shoe_store_user");
        window.dispatchEvent(new Event("user-updated"));

        const data = await response.json();

          const loggedInUser = {
      ...data.user,
      profile_photo_url:
        data.profile_photo_url || data.user?.profile_photo_url || "",
    };

    setUser(loggedInUser);

    localStorage.setItem(
      "shoe_store_user",
      JSON.stringify(loggedInUser)
    );

window.dispatchEvent(new Event("user-updated"));

setProfilePreview(loggedInUser.profile_photo_url || "");

        setProfilePreview(data.profile_photo_url || "");
      } catch (error) {
        console.error("Unable to restore session:", error);
      } finally {
        setCheckingSession(false);
      }
    }

    loadProfile();
  }, []);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setOtpSent(false);
    setOtp("");
    setSeconds(0);
    setMessage("");
    setError("");
  };

  // Register new account
  async function submitSignup(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create your account.");
      }

      setMessage(data.message || "Account created successfully.");
      setMode("login");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Registration API is not connected. Check Laravel server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  // Request login OTP
  async function requestOtp(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (seconds > 0 || loading) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setSeconds(30);
        throw new Error(
          data.message || "Too many attempts. Please try again later."
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not generate OTP.");
      }

      setOtpSent(true);
      setSeconds(30);
      setMessage(
        data.message || "OTP generated. Check the Laravel log file."
      );
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Login API is not connected. Check Laravel server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  // Verify OTP
  async function verifyOtp(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid or expired OTP.");
      }

      if (!data.token || !data.user) {
        throw new Error("Login token or user details were not returned.");
      }

      localStorage.setItem("shoe_store_token", data.token);
      localStorage.setItem("shoe_store_user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("user-updated"));
      setUser(data.user);
      setMessage("You are now logged in.");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "OTP verification API is not connected. Check Laravel server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function logout() {
    const token = localStorage.getItem("shoe_store_token");

    setLoading(true);

    try {
      if (token) {
        const response = await fetch(`${API_BASE}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Laravel logout request failed.");
        }
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("shoe_store_token");
      setUser(null);
      setEmail("");
      setOtp("");
      setOtpSent(false);
      setSeconds(0);
      setMessage("You have been logged out.");
      setError("");
      setLoading(false);
    }
  }

  // Address form input
  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reset address form
  const resetAddressForm = () => {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  // Save or update address
  const saveAddress = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("shoe_store_token");

    if (!token) {
      setAddressesError("Please log in again.");
      return;
    }

    try {
      setAddressSaving(true);
      setAddressesError("");

      const url = editingAddressId
        ? `${API_BASE}/addresses/${editingAddressId}`
        : `${API_BASE}/addresses`;

      const response = await fetch(url, {
        method: editingAddressId ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (!response.ok) {
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "";

        throw new Error(
          validationErrors || data.message || "Unable to save address."
        );
      }

      const refreshResponse = await fetch(`${API_BASE}/addresses`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error("Address saved, but address list could not refresh.");
      }

      setAddresses(refreshData.addresses || []);
      resetAddressForm();

      alert(
        editingAddressId
          ? "Address updated successfully."
          : "Address saved successfully."
      );
    } catch (error) {
      setAddressesError(error.message);
    } finally {
      setAddressSaving(false);
    }
  };

  // Edit address
  const editAddress = (address) => {
    setEditingAddressId(address.id);

    setAddressForm({
      full_name: address.full_name || "",
      phone: address.phone || "",
      address_line: address.address_line || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      type: address.type || "Home",
      is_default: Boolean(address.is_default),
    });

    setShowAddressForm(true);
  };

  // Delete address
  const deleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    const token = localStorage.getItem("shoe_store_token");

    try {
      const response = await fetch(`${API_BASE}/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete address.");
      }

      setAddresses((previous) =>
        previous.filter((address) => address.id !== id)
      );

      const refreshResponse = await fetch(`${API_BASE}/addresses`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const refreshData = await refreshResponse.json();

      if (refreshResponse.ok) {
        setAddresses(refreshData.addresses || []);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Set default address
  const makeDefaultAddress = async (id) => {
    const token = localStorage.getItem("shoe_store_token");

    try {
      const response = await fetch(
        `${API_BASE}/addresses/${id}/default`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to set default address.");
      }

      setAddresses((previous) =>
        previous.map((address) => ({
          ...address,
          is_default: address.id === id,
        }))
      );
    } catch (error) {
      alert(error.message);
    }
  };

  // Session loading
  if (checkingSession) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <p className="profile-subtitle">Checking your account...</p>
        </section>
      </main>
    );
  }

  // Logged-in account dashboard
  if (user) {
    const menuGroups = [
      {
        title: "MY ACCOUNT",
        items: [
          { id: "orders", label: "My Orders", icon: Package },
          { id: "profile", label: "Profile Information", icon: UserRound },
          { id: "addresses", label: "Manage Addresses", icon: MapPin },
          { id: "security", label: "Login & Security", icon: LockKeyhole },
        ],
      },
      {
        title: "MY SHOPPING",
        items: [
          { id: "cart", label: "My Cart", icon: ShoppingCart },
          { id: "wishlist", label: "Wishlist", icon: Heart },
          { id: "payments", label: "Payments", icon: CreditCard },
        ],
      },
      {
        title: "MY STUFF",
        items: [
          { id: "coupons", label: "Coupons", icon: Ticket },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "help", label: "Help Centre", icon: CircleHelp },
        ],
      },
    ];

    const sectionTitles = {
      orders: "My Orders",
      profile: "Personal Information",
      addresses: "Manage Addresses",
      security: "Login & Security",
      cart: "My Cart",
      wishlist: "My Wishlist",
      payments: "Payments",
      coupons: "My Coupons",
      notifications: "Notifications",
      help: "Help Centre",
    };

    return (
      <main className="account-page">
        <div className="account-container">

          <div className="account-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={15} />
            <span>My Account</span>
          </div>

          <header className="account-welcome">
            <div>
              <span className="profile-kicker">THE SOLEST EXPERIENCE</span>
              <h1>Hello, {user.name?.split(" ")[0] || "there"}.</h1>
              <p>Manage your account, orders and personal details.</p>
            </div>

            <div className="account-avatar">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" />
              ) : (
                <UserRound size={28} />
              )}
            </div>
          </header>

          <div className="account-layout">

            <aside className="account-sidebar">

              <div className="account-mini-profile">
                <div className="account-mini-avatar">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="mini-profile-image"
                    />
                  ) : (
                    <UserRound size={22} />
                  )}
                </div>

                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </div>

              {menuGroups.map((group) => (
                <div className="account-menu-group" key={group.title}>
                  <p className="account-menu-heading">{group.title}</p>

                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`account-menu-item ${
                          activeSection === item.id ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveSection(item.id);
                          setEditProfile(false);
                        }}
                      >
                        <Icon size={18} strokeWidth={1.7} />
                        <span>{item.label}</span>
                        <ChevronRight
                          className="account-menu-arrow"
                          size={15}
                        />
                      </button>
                    );
                  })}
                </div>
              ))}

              <button
                type="button"
                className="account-logout"
                onClick={logout}
                disabled={loading}
              >
                <LogOut size={18} />
                {loading ? "Logging out..." : "Logout"}
              </button>

            </aside>

            <section className="account-content">

              <div className="account-content-heading">
                <div>
                  <span className="profile-kicker">YOUR ACCOUNT</span>
                  <h2>{sectionTitles[activeSection]}</h2>
                </div>
              </div>

              {/* PROFILE SECTION */}
              {activeSection === "profile" && (
                <div className="account-panel">

                  <div className="account-panel-heading">
                    <div>
                      <h3>Personal Information</h3>
                      <p>Your registered account details.</p>
                    </div>

                    <button
                      type="button"
                      className="account-edit-button"
                      onClick={() => setEditProfile(!editProfile)}
                    >
                      <Pencil size={15} />
                      {editProfile ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {/* STEP 1: PROFILE PHOTO SECTION */}
                  <div className="profile-photo-section">

                    <div className="profile-photo-preview">
                      {profilePreview ? (
                        <img src={profilePreview} alt="Profile" />
                      ) : (
                        <UserRound size={32} />
                      )}
                    </div>

                    <div className="profile-photo-controls">

                      <div className="photo-actions">

                        {/* CHANGE PHOTO BUTTON */}
                        <label
                          htmlFor="profile-photo"
                          className="photo-btn primary-btn"
                        >
                          {photoLoading ? "Uploading..." : "Change Photo"}

                          <input
                            id="profile-photo"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handlePhotoUpload}
                            disabled={photoLoading}
                            hidden
                          />
                        </label>

                        {/* REMOVE PHOTO BUTTON */}
                        {profilePreview && (
                          <button
                            type="button"
                            className="photo-btn secondary-btn"
                            onClick={handleRemovePhoto}
                            disabled={photoLoading}
                          >
                            Remove Photo
                          </button>
                        )}

                      </div>

                      {photoMessage && (
                        <p className="photo-message">
                          {photoMessage}
                        </p>
                      )}

                    </div>
                  </div>

                  {editProfile && (
                    <div className="account-notice">
                      Profile editing UI is ready to be connected. Saving
                      changes requires a Laravel profile-update API.
                    </div>
                  )}

                  <div className="account-info-grid">

                    <div className="account-info-field">
                      <span>Full Name</span>
                      <strong>{user.name || "Not provided"}</strong>
                    </div>

                    <div className="account-info-field">
                      <span>Email Address</span>
                      <strong>{user.email || "Not provided"}</strong>
                    </div>

                    <div className="account-info-field">
                      <span>Mobile Number</span>
                      <strong>{user.mobile || "Not provided"}</strong>
                    </div>

                  </div>

                  <div className="account-security-note">
                    <ShieldCheck size={20} />
                    <div>
                      <strong>Your account security matters</strong>
                      <p>
                        Never share your verification codes or account token
                        with anyone.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* ORDERS SECTION */}
              {activeSection === "orders" && (
                <div className="account-section">

                  <p className="orders-description">
                    Track your purchases and check their delivery status.
                  </p>

                  {ordersLoading ? (
                    <p>Loading your orders...</p>
                  ) : ordersError ? (
                    <p role="alert" className="checkout-error">
                      {ordersError}
                    </p>
                  ) : userOrders.length === 0 ? (

                    <div className="orders-empty">
                      <div className="orders-empty-icon">
                        <Package size={34} strokeWidth={1.4} />
                      </div>

                      <h3>Your orders will appear here</h3>

                      <p>
                        Once you place an order, you can view your purchases,
                        order details and delivery status here.
                      </p>

                      <Link to="/" className="orders-shop-button">
                        Explore Collection <ArrowRight size={17} />
                      </Link>
                    </div>

                  ) : (

                    <div className="orders-list">
                      {userOrders.map((order) => (
                        <div className="order-card" key={order.id}>

                          <div className="order-card-top">
                            <div>
                              <span className="order-label">ORDER ID</span>
                              <h3>#{order.id}</h3>
                            </div>

                            <span
                              className={`order-status ${String(
                                order.status || "Processing"
                              ).toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {order.status || "Processing"}
                            </span>
                          </div>

                          <div className="order-card-product">

                            {order.image && (
                              <img
                                src={order.image}
                                alt={order.name || "Ordered shoe"}
                              />
                            )}

                            <div className="order-product-info">
                              <h4>{order.name || "Shoe product"}</h4>
                              <p>Quantity: {order.quantity || 1}</p>
                              <p>Ordered on: {order.date}</p>
                            </div>

                            <div className="order-total">
                              <span>Total amount</span>
                              <strong>{order.total}</strong>
                            </div>

                          </div>

                          <div className="order-card-footer">
                            <span>
                              <Package size={16} />
                              {order.deliveryMessage}
                            </span>

                            {order.status === "Processing" && (
                              <button
                                type="button"
                                className="cancel-order-btn"
                                onClick={() => cancelOrder(order.id)}
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* ADDRESSES SECTION */}
              {activeSection === "addresses" && (
                <div className="account-section address-section">

                  <div className="address-heading">
                    <div>
                      <h3>Saved Delivery Addresses</h3>
                      <p>Manage your delivery locations.</p>
                    </div>

                    {!showAddressForm && (
                      <button
                        type="button"
                        className="account-primary-link"
                        onClick={() => {
                          setAddressForm(emptyAddress);
                          setEditingAddressId(null);
                          setShowAddressForm(true);
                        }}
                      >
                        + Add New Address
                      </button>
                    )}
                  </div>

                  {addressesLoading ? (
                    <p>Loading your saved addresses...</p>
                  ) : addressesError ? (
                    <p className="checkout-error">{addressesError}</p>
                  ) : null}

                  {showAddressForm && (
                    <form className="address-form" onSubmit={saveAddress}>

                      <h3>
                        {editingAddressId ? "Edit Address" : "Add New Address"}
                      </h3>

                      <div className="address-form-grid">

                        <label>
                          Full Name
                          <input
                            name="full_name"
                            value={addressForm.full_name}
                            onChange={handleAddressChange}
                            placeholder="Enter full name"
                            required
                          />
                        </label>

                        <label>
                          Mobile Number
                          <input
                            name="phone"
                            type="tel"
                            value={addressForm.phone}
                            onChange={handleAddressChange}
                            placeholder="10-digit mobile number"
                            maxLength={20}
                            required
                          />
                        </label>

                        <label className="address-full-width">
                          Complete Address
                          <textarea
                            name="address_line"
                            value={addressForm.address_line}
                            onChange={handleAddressChange}
                            placeholder="House no., street, area"
                            required
                          />
                        </label>

                        <label className="address-full-width">
                          Landmark (Optional)
                          <input
                            name="landmark"
                            value={addressForm.landmark}
                            onChange={handleAddressChange}
                            placeholder="Nearby landmark"
                          />
                        </label>

                        <label>
                          City
                          <input
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressChange}
                            placeholder="City"
                            required
                          />
                        </label>

                        <label>
                          State
                          <input
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressChange}
                            placeholder="State"
                            required
                          />
                        </label>

                        <label>
                          PIN Code
                          <input
                            name="pincode"
                            value={addressForm.pincode}
                            onChange={handleAddressChange}
                            placeholder="PIN code"
                            maxLength={10}
                            required
                          />
                        </label>

                        <label>
                          Address Type
                          <select
                            name="type"
                            value={addressForm.type}
                            onChange={handleAddressChange}
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </label>

                      </div>

                      <label className="address-default-option">
                        <input
                          type="checkbox"
                          name="is_default"
                          checked={addressForm.is_default}
                          onChange={handleAddressChange}
                        />
                        Set as default delivery address
                      </label>

                      <div className="address-form-actions">
                        <button
                          type="submit"
                          disabled={addressSaving}
                          className="account-primary-link"
                        >
                          {addressSaving
                            ? "Saving..."
                            : editingAddressId
                            ? "Update Address"
                            : "Save Address"}
                        </button>

                        <button
                          type="button"
                          className="address-cancel-button"
                          onClick={resetAddressForm}
                          disabled={addressSaving}
                        >
                          Cancel
                        </button>
                      </div>

                    </form>
                  )}

                  {!addressesLoading &&
                    addresses.length === 0 &&
                    !showAddressForm && (
                      <div className="account-empty-state">
                        <MapPin size={38} />
                        <h3>No saved addresses yet</h3>
                        <p>
                          Add your delivery address once. You can use it again
                          whenever you order.
                        </p>

                        <button
                          type="button"
                          className="account-primary-link"
                          onClick={() => setShowAddressForm(true)}
                        >
                          Add Your First Address
                        </button>
                      </div>
                    )}

                  <div className="saved-address-grid">
                    {addresses.map((address) => (
                      <div className="saved-address-card" key={address.id}>

                        <div className="saved-address-top">
                          <span className="saved-address-type">
                            <MapPin size={15} />
                            {address.type}
                          </span>

                          {address.is_default && (
                            <span className="default-address-badge">
                              Default
                            </span>
                          )}
                        </div>

                        <h4>{address.full_name}</h4>
                        <p>{address.phone}</p>

                        <p>
                          {address.address_line}
                          {address.landmark ? `, ${address.landmark}` : ""}
                        </p>

                        <p>
                          {address.city}, {address.state} - {address.pincode}
                        </p>

                        <div className="saved-address-actions">

                          {!address.is_default && (
                            <button
                              type="button"
                              onClick={() => makeDefaultAddress(address.id)}
                            >
                              Set as Default
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => editAddress(address)}
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteAddress(address.id)}
                          >
                            Delete
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* CART SECTION */}
              {activeSection === "cart" && (
                <div className="account-section">

                  {cart.length === 0 ? (
                    <div className="account-empty-state">
                      <ShoppingCart size={42} />
                      <h3>Your cart is empty</h3>
                      <p>Add your favourite shoes to see them here.</p>
                      <Link to="/" className="account-action-button">
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="my-cart-list">

                        {cart.map((item) => {
                          const price = Number(
                            String(item.price ?? item.priceText ?? 0)
                              .replace(/[₹,/-]/g, "")
                              .trim()
                          ) || 0;

                          return (
                            <div className="my-cart-item" key={item.id}>

                              <img
                                src={item.image || item.img}
                                alt={item.name || item.title}
                              />

                              <div className="my-cart-details">
                                <h3>{item.name || item.title}</h3>
                                <p>₹{price.toLocaleString("en-IN")}</p>

                                <div className="my-cart-quantity">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCart((previous) =>
                                        previous
                                          .map((shoe) =>
                                            shoe.id === item.id
                                              ? {
                                                  ...shoe,
                                                  quantity: shoe.quantity - 1,
                                                }
                                              : shoe
                                          )
                                          .filter((shoe) => shoe.quantity > 0)
                                      )
                                    }
                                  >
                                    −
                                  </button>

                                  <span>{item.quantity}</span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCart((previous) =>
                                        previous.map((shoe) =>
                                          shoe.id === item.id
                                            ? {
                                                ...shoe,
                                                quantity: shoe.quantity + 1,
                                              }
                                            : shoe
                                        )
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="my-cart-remove"
                                  onClick={() =>
                                    setCart((previous) =>
                                      previous.filter(
                                        (shoe) => shoe.id !== item.id
                                      )
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              </div>

                              <strong>
                                ₹{(price * item.quantity).toLocaleString("en-IN")}
                              </strong>

                            </div>
                          );
                        })}

                      </div>

                      <div className="my-cart-total">
                        <span>Subtotal</span>

                        <strong>
                          ₹
                          {cart
                            .reduce((total, item) => {
                              const price = Number(
                                String(item.price ?? item.priceText ?? 0)
                                  .replace(/[₹,/-]/g, "")
                                  .trim()
                              ) || 0;

                              return total + price * item.quantity;
                            }, 0)
                            .toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <Link to="/checkout" className="account-action-button">
                        Proceed to Checkout
                      </Link>
                    </>
                  )}

                </div>
              )}

              {/* WISHLIST SECTION */}
              {activeSection === "wishlist" && (
                <div className="account-section">

                  <p className="orders-description">
                    Your favourite shoes, saved in one place.
                  </p>

                  {wishlistLoading ? (
                    <p>Loading your wishlist...</p>
                  ) : wishlistError ? (
                    <p className="checkout-error">{wishlistError}</p>
                  ) : wishlistItems.length === 0 ? (

                    <div className="account-empty-state">
                      <Heart size={36} />
                      <h3>Your wishlist is empty</h3>
                      <p>
                        Save your favourite shoes by clicking the heart icon
                        on any product.
                      </p>
                      <Link to="/" className="account-primary-link">
                        Discover Shoes
                      </Link>
                    </div>

                  ) : (

                    <div className="wishlist-grid">

                      {wishlistItems.map((item) => {
                        const price = Number(item.price || 0);

                        return (
                          <div className="wishlist-card" key={item.id}>

                            <div className="wishlist-image">
                              <img
                                src={item.image}
                                alt={item.name}
                              />

                              <button
                                type="button"
                                className="wishlist-remove"
                                onClick={() =>
                                  removeWishlistItem(item.product_id)
                                }
                                aria-label="Remove from wishlist"
                              >
                                <Heart size={19} fill="currentColor" />
                              </button>
                            </div>

                            <div className="wishlist-details">
                              <span>{item.category}</span>
                              <h3>{item.name}</h3>

                              <strong>
                                ₹{price.toLocaleString("en-IN")}
                              </strong>

                              <button
                                type="button"
                                className="wishlist-cart-button"
                                onClick={() => {
                                  if (setCart) {
                                    setCart((previous) => {
                                      const existing = previous.find(
                                        (shoe) =>
                                          String(shoe.id) ===
                                          String(item.product_id)
                                      );

                                      if (existing) {
                                        return previous.map((shoe) =>
                                          String(shoe.id) ===
                                          String(item.product_id)
                                            ? {
                                                ...shoe,
                                                quantity:
                                                  (shoe.quantity || 1) + 1,
                                              }
                                            : shoe
                                        );
                                      }

                                      return [
                                        ...previous,
                                        {
                                          id: item.product_id,
                                          name: item.name,
                                          category: item.category,
                                          price: item.price,
                                          image: item.image,
                                          quantity: 1,
                                        },
                                      ];
                                    });

                                    alert("Added to cart!");
                                  }
                                }}
                              >
                                <ShoppingCart size={16} />
                                Add to Cart
                              </button>

                            </div>
                          </div>
                        );
                      })}

                    </div>
                  )}

                </div>
              )}

              {/* SECURITY SECTION */}
              {activeSection === "security" && (
                <div className="account-panel">

                  <div className="account-security-row">
                    <div className="account-security-icon">
                      <Mail size={20} />
                    </div>

                    <div>
                      <strong>Email address</strong>
                      <p>{user.email}</p>
                      <span>Used for account verification</span>
                    </div>
                  </div>

                  <div className="account-security-row">
                    <div className="account-security-icon">
                      <LockKeyhole size={20} />
                    </div>

                    <div>
                      <strong>Password</strong>
                      <p>You currently sign in using email OTP.</p>
                      <span>
                        Password login and password reset are not configured
                        yet.
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* OTHER SECTIONS */}
              {[
                "payments",
                "coupons",
                "notifications",
                "help",
              ].includes(activeSection) && (
                <div className="account-empty-state">

                  {activeSection === "payments" && <CreditCard size={36} />}
                  {activeSection === "coupons" && <Ticket size={36} />}
                  {activeSection === "notifications" && <Bell size={36} />}
                  {activeSection === "help" && <CircleHelp size={36} />}

                  <h3>{sectionTitles[activeSection]}</h3>

                  <p>
                    This section's interface is ready to be developed. Its
                    data and actions will need the corresponding backend
                    functionality.
                  </p>

                </div>
              )}

              {message && (
                <div className="profile-alert success" role="status">
                  <CheckCircle2 size={17} />
                  {message}
                </div>
              )}

            </section>
          </div>

          <footer className="account-footer">
            <Link to="/">Continue shopping</Link>
            <span>THE SOLEST EXPERIENCE</span>
          </footer>

        </div>
      </main>
    );
  }

  // LOGIN AND SIGNUP PAGE
  return (
    <main className="profile-page">

      <motion.section
        className="profile-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >

        <Link to="/" className="profile-back">
          <ArrowLeft size={17} />
          Back to store
        </Link>

        <div className="profile-heading">

          <div className="profile-avatar">
            <UserRound size={31} strokeWidth={1.4} />
          </div>

          <span className="profile-kicker">THE SOLEST EXPERIENCE</span>

          <h1>
            {mode === "login" ? "Welcome back." : "Join the club."}
          </h1>

          <p className="profile-subtitle">
            {mode === "login"
              ? "Sign in to discover your next favourite pair."
              : "Create your account and step into something better."}
          </p>

        </div>

        <div className="profile-tabs">

          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>

        </div>

        {error && (
          <div className="profile-alert error" role="alert">
            {error}

            {seconds > 0 && (
              <p className="countdown-message">
                Try again in <strong>{seconds}s</strong>
              </p>
            )}
          </div>
        )}

        {message && (
          <div className="profile-alert success" role="status">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {/* SIGNUP FORM */}
        {mode === "signup" ? (

          <form className="profile-form" onSubmit={submitSignup}>

            <label htmlFor="signup-name">Full name</label>

            <div className="profile-input-wrap">
              <UserRound size={18} />

              <input
                id="signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                minLength={2}
              />
            </div>

            <label htmlFor="signup-email">Email address</label>

            <div className="profile-input-wrap">
              <Mail size={18} />

              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="signup-mobile">Mobile number</label>

            <div className="profile-input-wrap">
              <Phone size={18} />

              <input
                id="signup-mobile"
                type="tel"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile number"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                title="Enter a 10-digit mobile number"
                required
              />
            </div>

            <button className="profile-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

        ) : (

          /* LOGIN FORM */
          <form className="profile-form" onSubmit={requestOtp}>

            <label htmlFor="login-email">Email address</label>

            <div className="profile-input-wrap">
              <Mail size={18} />

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);
                  setOtp("");
                  setSeconds(0);
                  setError("");
                  setMessage("");
                }}
                placeholder="Enter your registered email"
                autoComplete="email"
                required
              />
            </div>

            {otpSent && (
              <>
                <label htmlFor="login-otp">Verification code</label>

                <div className="profile-input-wrap otp-input-wrap">
                  <LockKeyhole size={18} />

                  <input
                    id="login-otp"
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="button"
                  className="resend-button"
                  disabled={seconds > 0 || loading}
                  onClick={requestOtp}
                >
                  {seconds > 0 ? (
                    <>
                      <Clock3 size={15} />
                      Resend OTP in {seconds}s
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </>
            )}

            {!otpSent ? (

              <button className="profile-submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send login OTP"}
                {!loading && <ArrowRight size={18} />}
              </button>

            ) : (

              <button
                type="button"
                className="profile-submit"
                disabled={loading || otp.length !== 6}
                onClick={verifyOtp}
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>

            )}

            <p className="profile-security">
              <LockKeyhole size={14} />
              Secure email verification
            </p>

          </form>
        )}

        <div className="profile-bottom-note">
          STEP INTO YOUR OWN STYLE.
        </div>

      </motion.section>
    </main>
  );
}

export default Profile;
