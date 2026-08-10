import styles from "./MusicTermComponent.module.css"

export default function MusicTermComponent({ term }: { term: TermData }) {
  const termTypeColor = {
    Tempo: "#00C6E9",
    Technique: "#001B86",
    Dynamic: "#00E070",
    Chord: "#F5C908",
    Expression: "#BA1616",
    Others: "#5E6263",
  };

  return (
    <div className={styles.termComponent}>
      <h3>{term.term}</h3>
      <p>{term.definition}</p>{" "}
      <em className={`class-tag`} style={{ borderColor: termTypeColor[term.type] }}>
        {term.type}
      </em>
    </div>
  );
}
