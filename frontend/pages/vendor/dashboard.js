import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { apiGet, apiPost } from "../../lib/api";
import { getToken, setToken as saveToken, clearToken } from "../../lib/auth";

export default function VendorDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingVendor, setLoadingVendor] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    currentPrice: "",
    sku: "",
    stock: "",
  });

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    const t = getToken();
    if (t) setTokenState(t);
  }, [isClient]);

  useEffect(() => {
    if (!token) return;

    const fetchVendor = async () => {
      try {
        setLoadingVendor(true);
        const v = await apiGet("/vendors/me", token);
        setVendor(v);
        if (v) {
          const list = await apiGet("/products/vendor/me", token);
          setProducts(list);
        }
      } catch (err) {
        console.error(err);
        setVendor(null);
      } finally {
        setLoadingVendor(false);
      }
    };

    fetchVendor();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await apiPost("/auth/login", { email, password });
      saveToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      alert("Logged in");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const slug = e.target.slug.value;

    try {
      const v = await apiPost("/vendors", { name, slug }, token);
      setVendor(v);
      alert("Vendor created");
    } catch (err) {
      console.error(err);
      alert("Error creating vendor");
    }
  };

  const loadProducts = async () => {
    try {
      const list = await apiGet("/products/vendor/me", token);
      setProducts(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const body = {
        title: form.title,
        description: form.description,
        currentPrice: parseInt(form.currentPrice, 10),
        basePrice: parseInt(form.currentPrice, 10),
        sku: form.sku,
        stock: parseInt(form.stock, 10),
      };

      await apiPost("/products", body, token);
      setForm({
        title: "",
        description: "",
        currentPrice: "",
        sku: "",
        stock: "",
      });
      await loadProducts();
      alert("Product created");
    } catch (err) {
      console.error(err);
      alert("Error creating product");
    }
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setVendor(null);
    setProducts([]);
  };

  if (!isClient) return null;

  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Vendor Dashboard</h1>

        {!token && (
          <section className="card">
            <h2 className="section-title">Login as Vendor</h2>
            <form className="form" onSubmit={handleLogin}>
              <input
                name="email"
                placeholder="Email"
                className="input"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input"
                required
              />
              <button type="submit" className="button primary">
                Login
              </button>
            </form>
          </section>
        )}

        {token && (
          <>
            <button onClick={handleLogout} className="button logout">
              Logout
            </button>

            {loadingVendor && <p className="loading-text">Loading vendor...</p>}

            {!loadingVendor && !vendor && (
              <section className="card">
                <h2 className="section-title">Create Vendor Profile</h2>
                <form className="form" onSubmit={handleCreateVendor}>
                  <input
                    name="name"
                    placeholder="Store name"
                    className="input"
                    required
                  />
                  <input
                    name="slug"
                    placeholder="Store slug (e.g. techzone)"
                    className="input"
                    required
                  />
                  <button type="submit" className="button primary">
                    Create Vendor
                  </button>
                </form>
              </section>
            )}

            {!loadingVendor && vendor && (
              <>
                <section className="card">
                  <h2 className="section-title">Create Product</h2>
                  <form className="form" onSubmit={handleCreateProduct}>
                    <input
                      placeholder="Title"
                      value={form.title}
                      className="input"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      required
                    />

                    <textarea
                      placeholder="Description"
                      value={form.description}
                      className="textarea"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />

                    <input
                      placeholder="Price (cents)"
                      value={form.currentPrice}
                      className="input"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, currentPrice: e.target.value }))
                      }
                      required
                    />

                    <input
                      placeholder="SKU"
                      value={form.sku}
                      className="input"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, sku: e.target.value }))
                      }
                    />

                    <input
                      placeholder="Stock"
                      value={form.stock}
                      className="input"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, stock: e.target.value }))
                      }
                    />

                    <button type="submit" className="button primary">
                      Create Product
                    </button>
                  </form>
                </section>

                <section className="card">
                  <h2 className="section-title">Your Products</h2>
                  <button onClick={loadProducts} className="button secondary">
                    Refresh
                  </button>

                  <div className="product-list">
                    {products.map((p) => (
                      <div key={p._id} className="product-card">
                        <div className="product-title">{p.title}</div>
                        <div className="product-price">
                          {(p.currentPrice / 100).toFixed(2)} USD
                        </div>
                        <div className="product-sku">SKU: {p.sku}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
