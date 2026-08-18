import { useState, useEffect } from "react";

import { NavLink, useLocation, useOutletContext } from "react-router";

import MusicTermComponent from "../../shared/MusicTermComponent";
import type { PopupData } from "../../Layout";

import styles from "./Glossary.module.css";

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

  const [allTerms, setAllTerms] = useState<TermData[]>([]);

  //Load all pieces
  useEffect(() => {
    async function loadTerms() {
      const data = await window.electron.getAllTerms();
      setAllTerms(data);
    }
    loadTerms();
  }, [location.pathname]);

  let terms: TermData[] = [];
  if (allTerms) {
    terms = allTerms;
  }

  const termElements = terms.map((term, index) => {
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
          <li>
            <label htmlFor="search" className="h3">
              Search
            </label>
            <input type="text" name="search" className="input-deco" />
          </li>
          <li>
            <label htmlFor="sort" className="h3">
              Sort
            </label>
            <input type="text" name="sort" className="input-deco" />
          </li>
          <li>
            <label htmlFor="TimeFrame" className="h3">
              Timeframe
            </label>
            <input type="text" name="TimeFrame" className="input-deco" />
          </li>
        </ul>
        <hr />
      </header>
      <main className={styles.main}>
        <section style={{ paddingTop: "2rem" }}>
          <ul>{terms.length && termElements}</ul>
        </section>
      </main>
    </>
  );
}
