import { NavLink, useLocation } from "react-router";
// import type { SetStateAction } from "react";
// import SubNav from "../../shared/SubNav";
import ExtendedPieceCard from "../util/ExtendedPieceCard";

import styles from "./AllPieces.module.css";
import { useEffect, useState } from "react";

export default function AllPiecesPage() {
  const location = useLocation();

  const [allPieces, setAllPieces] = useState<ExtendedPieceData[]>([]);

  //Load all pieces
  useEffect(() => {
    async function loadPieces() {
      const data = await window.electron.getAllPiece();
      setAllPieces(data);
    }
    loadPieces();
  }, [location.pathname]);

  //Create PieceCards
  const allPiecesCardList = allPieces.map((piece, index) => {
    return <ExtendedPieceCard piece={piece} key={index} />;
  });
  return (
    <>
      <header className={styles.header}>
        <div>
          <h2>All Piece</h2>
          <NavLink to="/piece/create" className="btn-blue">
            +Create New Piece
          </NavLink>
        </div>

        <hr />
      </header>
      <main className={styles.main}>
        <section className={styles.searchBox}>
          <div className="card-box">
            <div>
              <label htmlFor="search" className="h3">
                Search
              </label>
              <input type="text" name="search" className="input-deco" />
            </div>
            <div>
              <label htmlFor="sort" className="h3">
                Sort
              </label>
              <input type="text" name="sort" className="input-deco" />
            </div>
            <div>
              <label htmlFor="filter" className="h3">
                Filter
              </label>
              <input type="text" name="filter" className="input-deco" />
            </div>
          </div>
        </section>
        <section className={styles.pieceList}>
          <ul>{allPiecesCardList}</ul>
        </section>
      </main>
    </>
  );
}
