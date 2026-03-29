import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <header className="navbar">
        <Link href="/" className="navbar-logo">
          Marketplace
        </Link>

        <nav className="navbar-links">
          <Link href="/vendor/dashboard" className="navbar-link">
            Vendor Dashboard
          </Link>
        </nav>
      </header>

      <main className="layout-content">{children}</main>
    </div>
  );
}
