import Layout from "../components/Layout";

export default function Cancel() {
  return (
    <Layout>
      <div className="cancel-container">
        <div className="cancel-card">
          <h1 className="cancel-title">Payment Canceled</h1>
          <p className="cancel-message">
            Your payment was canceled. You can continue browsing.
          </p>
          <a href="/" className="cancel-button">
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
}
