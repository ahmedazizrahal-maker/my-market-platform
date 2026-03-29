import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3 className="product-card-title">
        <Link href={`/products/${product._id}`} className="product-card-link">
          {product.title}
        </Link>
      </h3>

      <p className="product-card-price">
        {(product.currentPrice / 100).toFixed(2)} USD
      </p>

      <p className="product-card-vendor">
        Vendor: <strong>{product.vendorId?.name}</strong>
      </p>
    </div>
  );
}
