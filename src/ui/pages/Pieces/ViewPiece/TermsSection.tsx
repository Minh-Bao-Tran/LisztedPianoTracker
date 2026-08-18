import { useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";

import MusicTermComponent from "../../../shared/MusicTermComponent";
import styles from "./TermsSection.module.css";

export default function TermsSection() {
  const { terms, setPopup, handleLinkTerm } = useOutletContext<{
    terms: TermData[];
    setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
    handleLinkTerm: (termId: string) => void;
  }>();

  function openlinkMusicTerm() {
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

  let pieceTerms: TermData[] = [];
  if (terms) {
    console.log(terms);
    pieceTerms = terms;
  }

  const termElements = pieceTerms.map((term, index) => {
    return (
      <>
        <MusicTermComponent term={term} key={index} />
        <hr />
      </>
    );
  });

  return (
    <section className={styles.termSection}>
      <div className={styles.buttonDiv}>
        <h3>Linked Music Terms</h3>
        <button className="btn-blue" onClick={openlinkMusicTerm}>
          +Link New Term
        </button>
      </div>
      <ul>{pieceTerms && termElements}</ul>
    </section>
  );
}
