import { useState, useEffect } from "react";

import { useLocation, useOutletContext } from "react-router";

import MusicTermComponent from "../../shared/MusicTermComponent";

import SearchIcon from "../../assets/icon/Search_Icon.svg";
import SortIcon from "../../assets/icon/Sort_Icon.svg";
import FilterIcon from "../../assets/icon/Filter_Icon.svg";

import type { PopupData } from "../../Layout";

import styles from "./Glossary.module.css";

const MUSIC_TERM_TYPES: string[] = [
  "Tempo",
  "Technique",
  "Dynamic",
  "Chord",
  "Expression",
  "Others",
] as const;

const avalSortCriteria = {
  az: "A to Z",
  za: "Z to A",
};

const sortFunctions: Record<
  keyof typeof avalSortCriteria,
  (termList: TermData[]) => TermData[]
> = {
  az: (termList) => {
    return [...termList].sort((a, b) => a.term.localeCompare(b.term));
  },
  za: (termList) => {
    return [...termList].sort((a, b) => b.term.localeCompare(a.term));
  },
};

export default function GlossaryPage() {
  const location = useLocation();
  const { setPopup } = useOutletContext<{
    setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
  }>();

  function openViewMusicTerm(term: TermData) {
    setPopup({
      type: "viewMusicTerm",
      currentValues: term,
      closeForm: () => {
        setPopup(undefined);
      },
    });
  }

  const [terms, setTerms] = useState<TermData[]>([]);

  const [searchCriteria, setSearchCriteria] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  //Load all pieces
  useEffect(() => {
    async function loadTerms() {
      const data = await window.electron.getAllTerms();
      setTerms(data);
    }
    loadTerms();
  }, [location.pathname]);

  let allTerms: TermData[] = [];
  if (terms) {
    allTerms = terms;
  }

  //Filter Piece
  let filteredTerms: TermData[] = allTerms.filter((term) => {
    return filterType === "" || filterType === term.type;
  });

  //Search Piece
  const searchedTerms = filteredTerms.filter((term) => {
    if (searchCriteria === "") return true;
    return (
      term.term.toLowerCase().slice(0, searchCriteria.length) ===
      searchCriteria.toLowerCase()
    );
  });

  //Sort Piece
  const sortTerms: TermData[] = sortCriteria
    ? sortFunctions[sortCriteria](searchedTerms)
    : searchedTerms;

  //----Render Components----
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
  //Create TermCards
  const termElements = sortTerms.map((term, index) => {
    return (
      <>
        <MusicTermComponent
          term={term}
          key={index}
          onClick={() => openViewMusicTerm(term)}
        />
        <hr />
      </>
    );
  });
  return (
    <>
      <header className={styles.header}>
        <div>
          <h2>Glossary</h2>
        </div>
        <ul>
          <div style={{ display: "flex", gap: "3rem" }}>
            <div className={styles.actionDiv}>
              <img src={SortIcon} alt="" />
              <select
                name="status"
                id="piece-status"
                className="input-deco"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
              >
                <option value="">None</option>
                {sortCriteriaList}
              </select>
            </div>
            <div className={styles.actionDiv}>
              <img src={FilterIcon} alt="" />
              <select
                name="status"
                id="piece-status"
                className="input-deco"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">None</option>
                {MUSIC_TERM_TYPES.map((type) => {
                  return (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className={styles.actionDiv}>
            <input
              type="text"
              name="search"
              className="input-deco"
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
            />
            <img src={SearchIcon} alt="" />
          </div>
        </ul>
        <hr />
      </header>
      <main className={styles.main}>
        <section style={{ paddingTop: "2rem" }}>
          {termElements.length > 0 ? (
            <ul>{terms.length && termElements}</ul>
          ) : (
            <p>No Terms found</p>
          )}
        </section>
      </main>
    </>
  );
}
