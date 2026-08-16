import { NavLink, useLocation } from "react-router";
// import type { SetStateAction } from "react";
// import SubNav from "../../shared/SubNav";
import ExtendedPieceCard from "../util/Card/ExtendedPieceCard";

import styles from "./AllPieces.module.css";
import { useEffect, useState } from "react";

const avalSortCriteria = {
  az: "A to Z",
  za: "Z to A",
  newestPracticeDate: "Newest Practice",
  oldestPracticeDate: "Oldest Practice",
  mostFrequent: "Most Frequent",
  leastFrequent: "Least Frequent",
  completionStatus: "Status Completed",
};

//Sort compares the values of a and b. if a < b( a- b = 0), a comes before b
//Therefore, to reverse sort, we only need to change the expression to b - a (a > b)
const sortFunctions: Record<
  keyof typeof avalSortCriteria,
  (pieceList: ExtendedPieceData[]) => ExtendedPieceData[]
> = {
  az: (pieceList) => {
    return [...pieceList].sort((a, b) => a.name.localeCompare(b.name));
  },
  za: (pieceList) => {
    return [...pieceList].sort((a, b) => b.name.localeCompare(a.name));
  },
  newestPracticeDate: (pieceList) => {
    return [...pieceList].sort((a, b) => {
      if (a.lastPracticeDate === "N/A") return 1;
      if (b.lastPracticeDate === "N/A") return -1;

      return b.lastPracticeDate.getTime() - a.lastPracticeDate.getTime();
    });
  },
  oldestPracticeDate: (pieceList) => {
    return [...pieceList].sort((a, b) => {
      if (a.lastPracticeDate === "N/A") return 1;
      if (b.lastPracticeDate === "N/A") return -1;

      return a.lastPracticeDate.getTime() - b.lastPracticeDate.getTime();
    });
  },
  mostFrequent: (pieceList) => {
    const timeFrameConversion: Record<FreqFrame, number> = {
      week: 7,
      fortnight: 14,
      month: 30,
    };
    return [...pieceList].sort((a, b) => {
      return (
        b.freqNumber / (timeFrameConversion[b.freqFrame] ?? 1000) -
        a.freqNumber / (timeFrameConversion[a.freqFrame] ?? 1000)
      );
    });
  },
  leastFrequent: (pieceList) => {
    const timeFrameConversion: Record<FreqFrame, number> = {
      week: 7,
      fortnight: 14,
      month: 30,
    };
    return [...pieceList].sort((a, b) => {
      return (
        a.freqNumber / (timeFrameConversion[a.freqFrame] ?? 1000) -
        b.freqNumber / (timeFrameConversion[b.freqFrame] ?? 1000)
      );
    });
  },
  completionStatus: (pieceList) => {
    //Ranking the importance(1 = first, 2 = second, 3 = last)
    const statusConversion: Record<Status, number> = {
      Active: 1,
      Planned: 2,
      Completed: 3,
    };
    return [...pieceList].sort((a, b) => {
      return statusConversion[a.status] - statusConversion[b.status];
    });
  },
};

export default function AllPiecesPage() {
  const location = useLocation();

  function toggleStatus(status: Status) {
    setFilterStatuses((prev) => {
      return prev.includes(status)
        ? [...prev].filter((prevStatus) => prevStatus !== status)
        : [...prev, status];
    });
  }

  const [allPieces, setAllPieces] = useState<ExtendedPieceData[]>([]);

  const [searchCriteria, setSearchCriteria] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [filterStatuses, setFilterStatuses] = useState<Status[]>([]);

  //Load all pieces
  useEffect(() => {
    async function loadPieces() {
      const data = await window.electron.getAllPiece();
      setAllPieces(data);
      console.log(data);
    }
    loadPieces();
  }, [location.pathname]);

  //Filter Piece
  let fliteredPieces: ExtendedPieceData[] = allPieces.filter((piece) => {
    return filterStatuses.length === 0 || filterStatuses.includes(piece.status);
  });

  //Search Piece
  const searchedPieces = fliteredPieces.filter((piece) => {
    if (searchCriteria === "") return true;
    console.log(piece.name.toLowerCase().slice(0, searchCriteria.length));
    return (
      piece.name.toLowerCase().slice(0, searchCriteria.length) ===
      searchCriteria.toLowerCase()
    );
  });

  //Sort Piece
  const sortPieces: ExtendedPieceData[] = sortCriteria
    ? sortFunctions[sortCriteria](searchedPieces)
    : searchedPieces;

  //----Render Components----
  //Create PieceCards
  const allPiecesCardList = sortPieces.map((piece, index) => {
    return <ExtendedPieceCard piece={piece} key={index} />;
  });

  //Sort Criteria Component
  const sortCriteriaList = [];
  for (const criterion in avalSortCriteria) {
    const criterionComponent = (
      <option key={criterion} value={criterion}>
        {avalSortCriteria[criterion]}
      </option>
    );
    sortCriteriaList.push(criterionComponent);
  }

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
              <input
                type="text"
                name="search"
                className="input-deco"
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sort" className="h3">
                Sort
              </label>
              <select
                name="status"
                id="piece-status"
                className="input-deco"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
              >
                <option value="">---Sort---</option>
                {sortCriteriaList}
              </select>
            </div>
            <div>
              <label className="p">
                <input
                  type="checkbox"
                  checked={filterStatuses.includes("Active")}
                  onChange={() => {
                    toggleStatus("Active");
                  }}
                />
                Active
              </label>

              <label className="p">
                <input
                  type="checkbox"
                  checked={filterStatuses.includes("Completed")}
                  onChange={() => {
                    toggleStatus("Completed");
                  }}
                />
                Completed
              </label>

              <label className="p">
                <input
                  type="checkbox"
                  checked={filterStatuses.includes("Planned")}
                  onChange={() => {
                    toggleStatus("Planned");
                  }}
                />
                Planned
              </label>
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
