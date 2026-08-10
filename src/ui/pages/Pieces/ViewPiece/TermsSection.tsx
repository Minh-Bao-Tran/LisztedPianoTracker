import { useOutletContext } from "react-router";

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

  return <>{terms && termElements}</>;
}
