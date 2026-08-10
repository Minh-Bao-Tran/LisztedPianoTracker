// import { Link } from "react-router";

import HomePiece from "./PieceCard";

import styles from "./Home.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={`${styles.welcomeBackSection} card-box`}>
        <h1>Welcome Back!</h1>
        <div>
          <h3>This Week Practice:</h3>
          <div className={styles.statistics}>
            <h2 className={styles.h2}>5.4 / 10 Hours</h2>
            <h2 className={styles.h2}>+27%</h2>
          </div>
        </div>
      </section>

      <section className={styles.pieceSection}>
        <h2 className={styles.h2}>Continue Practice?</h2>{" "}
        <ol style={{ display: "flex", gap: "20px" }}>
          <HomePiece />
          <HomePiece />
        </ol>
      </section>

      <section className={styles.pieceSection}>
        <h2 className={styles.h2}>Upcoming Goals</h2>{" "}
        <ol style={{ display: "flex", gap: "20px" }}>
          <HomePiece />
          <HomePiece />
        </ol>
      </section>
    </main>
  );
}
