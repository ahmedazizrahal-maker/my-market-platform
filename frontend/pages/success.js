import Layout from "../components/Layout";

export default function Success() {
  return (
    <Layout>
      <div className="success-container">
        <div className="success-card">
          <h1 className="success-title">Payment Successful</h1>
          <p className="success-message">Thank you for your purchase.</p>
          <a href="/" className="success-button">
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
}
