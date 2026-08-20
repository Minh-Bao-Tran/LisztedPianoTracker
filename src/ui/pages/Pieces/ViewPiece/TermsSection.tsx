// Purpose: lists linked music terms for a piece and allows linking/unlinking.
import { useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";

import MusicTermComponent from "../../../shared/MusicTermComponent";
import styles from "./TermsSection.module.css";

export default function TermsSection() {
  const { terms, setPopup, handleLinkTerm, handleUnlinkTerm } =
    useOutletContext<{
      terms: TermData[];
      setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
      handleLinkTerm: (termId: string) => void;
      handleUnlinkTerm: (termId: string) => void;
    }>();

  function openLinkMusicTerm() {
    setPopup({
      type: "linkMusicTerm",
      currentValues: terms,
      closeForm: () => {
        setPopup(undefined);
      },
      handleFormPredicate: (termId: string) => {
        console.log("here");
        handleLinkTerm(termId);
      },
    });
  }

  function openViewMusicTerm(term: TermData) {
    setPopup({
      type: "viewMusicTerm",
      currentValues: term,
      closeForm: () => {
        setPopup(undefined);
      },
      handleDeletePredicate: () => {
        handleUnlinkTerm(term.id);
      },
    });
  }

  let pieceTerms: TermData[] = [];
  if (terms) {
    console.log(terms);
    pieceTerms = terms;
  }

  const termElements = pieceTerms.map((term, index) => {
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
    <section className={styles.termSection}>
      <div className={styles.buttonDiv}>
        <h3>Linked Music Terms</h3>
        <button className="btn-blue" onClick={openLinkMusicTerm}>
          +Link New Term
        </button>
      </div>
      <ul>{pieceTerms.length > 0 ? termElements : <p>No Terms Linked yet</p>}</ul>
    </section>
  );
}
