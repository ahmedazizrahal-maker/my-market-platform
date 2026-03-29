import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { apiGet, apiPost } from "../../lib/api";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [comparison, setComparison] = useState([]);

  useEffect(() => {
    if (!id) return;

    apiGet(`/products/${id}`).then(setProduct).catch(console.error);
    apiGet(`/products/${id}/comparison`)
      .then(setComparison)
      .catch(console.error);
  }, [id]);

  const handleCheckout = async () => {
    try {
      const res = await apiPost("/checkout/create-session", { productId: id });
      if (res.url) window.location.href = res.url;
    } catch (err) {
      console.error(err);
      alert("Checkout error");
    }
  };

  if (!product) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="product-page-container">
        <div className="product-main-card">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-description">{product.description}</p>

          <p className="product-price">
            {(product.currentPrice / 100).toFixed(2)} USD
          </p>

          <p className="product-vendor">
            Sold by: <strong>{product.vendorId?.name}</strong>
          </p>

          <button
            className="button primary buy-button"
            onClick={handleCheckout}
          >
            Buy with Stripe
          </button>
        </div>

        <section className="comparison-section">
          <h2 className="section-title">Other offers for this product</h2>

          {comparison.length === 0 && (
            <p className="no-offers">No other offers available.</p>
          )}

          <div className="comparison-list">
            {comparison.map((p) => (
              <div key={p._id} className="comparison-card">
                <div className="comparison-title">{p.title}</div>
                <div className="comparison-vendor">
                  Vendor: {p.vendorId?.name}
                </div>
                <div className="comparison-price">
                  {(p.currentPrice / 100).toFixed(2)} USD
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
