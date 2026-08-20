// Purpose: UI element that displays a music term and its definition.
import EditIcon from "../assets/icon/Edit_icon.svg";

import styles from "./MusicTermComponent.module.css";
const termTypeColor = {
  Tempo: "#00C6E9",
  Technique: "#001B86",
  Dynamic: "#00E070",
  Chord: "#F5C908",
  Expression: "#BA1616",
  Others: "#5E6263",
};

export default function MusicTermComponent({
  index = 0,
  term,
  onClick = null,
}: {
  index?: number;
  term: TermData;
  onClick?: () => void;
}) {
  return (
    <div className={styles.termComponent} key={index}>
      <div>
        <h2>{term.term}</h2>
        <p>{term.definition}</p>
      </div>
      <div>
        <em
          className={`class-tag`}
          style={{ borderColor: termTypeColor[term.type] }}
        >
          {term.type}
        </em>
        {onClick && <img src={EditIcon} alt="" onClick={onClick} />}
      </div>
    </div>
  );
}
