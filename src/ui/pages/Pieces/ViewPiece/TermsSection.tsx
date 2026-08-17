import { useOutletContext } from "react-router";

import styles from "./TermsSection.module.css";

import MusicTermComponent from "../../../shared/MusicTermComponent";
export default function TermsSection() {
  const props: { terms: TermData[] } = useOutletContext<{
    terms: TermData[];
  }>();

  let terms: TermData[] = [];
  if (props.terms) {
    console.log(props.terms);
    terms = props.terms;
  }

  const termElements = terms.map((term, index) => {
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
        <button className="btn-blue">+Link New Term</button>
      </div>
      <ul>{terms && termElements}</ul>
    </section>
  );
}
