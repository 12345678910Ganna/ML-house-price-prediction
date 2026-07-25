import { Link } from "react-router-dom";

export default function NotFoundPage(): JSX.Element {
  return (
    <main className="page-shell result-shell">
      <section className="result-panel compact-panel">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you opened does not exist in this application.</p>
        <Link className="secondary-button" to="/">
          Back to Predictor
        </Link>
      </section>
    </main>
  );
}
