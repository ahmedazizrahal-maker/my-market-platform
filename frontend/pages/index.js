import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { apiGet } from "../lib/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiGet("/products").then(setProducts).catch(console.error);
  }, []);

  return (
    <Layout>
      <div className="home-container">
        <h1 className="home-title">Welcome to the Marketplace</h1>
        <p className="home-subtitle">
          Discover products from multiple vendors — all in one place.
        </p>

        <div className="home-product-grid">
          {products.length === 0 && (
            <p className="no-products">No products available yet.</p>
          )}

          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
