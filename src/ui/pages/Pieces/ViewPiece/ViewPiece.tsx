import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet } from "react-router";

import EditIcon from "../../../assets/icon/Edit_icon.svg";
import SubNav from "../../../shared/SubNav";

import styles from "./ViewPiece.module.css";

export default function ViewPiecePage() {
  const pieceId = useParams().id;

  //Fetching Function
  async function loadPieces() {
    window.electron
      .getOnePiece({
        id: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("No Piece found");
          throw new Error("No piece found");
        }
        setPiece(data);
      });
  }

  async function loadGoals() {
    window.electron
      .getAllPieceGoals({
        pieceId: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("No Piece found");
          throw new Error("No piece found");
        }
        setGoals(data);
      });
  }

  async function loadResources() {
    window.electron
      .getAllPieceResources({
        pieceId: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("No Resources found");
          throw new Error("No Resources found");
        }
        setResources(data);
      });
  }

  async function loadSubsessions() {
    window.electron
      .getAllPieceSubsessions({
        pieceId: pieceId as string,
      })
      .then((data) => {
        if (!data) {
          alert("No Sessions found");
          throw new Error("No Sessions found");
        }
        setSubsessions(data);
      });
  }

  async function loadTerms() {
    window.electron
      .getAllPieceTerms({
        pieceId: pieceId as string,
      })
      .then((data) => {
        if (!data) {
          alert("No Terms found");
          throw new Error("No Terms found");
        }
        setTerms(data);
      });
  }

  async function loadAnalytics() {
    window.electron
      .getAnalytics({
        id: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("No Analytics found");
          throw new Error("No Analytics found");
        }
        setAnalytics(data);
      });
  }

  //---State Management---

  const [piece, setPiece] = useState<ExtendedPieceData | undefined>(undefined);
  const [goals, setGoals] = useState<GoalData[] | undefined>([]);
  const [resources, setResources] = useState<ResourceData[] | undefined>([]);
  const [terms, setTerms] = useState<TermData[] | undefined>([]);
  const [subsessions, setSubsessions] = useState<
    ExtendedSubsessionData[] | undefined
  >([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | undefined>(
    undefined,
  );

  //Fetch the Piece
  useEffect(() => {
    console.log(pieceId);
    loadPieces();
    loadGoals();
    loadResources();
    loadSubsessions();
    loadTerms();
    loadAnalytics();
  }, [pieceId]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topButtonDiv}>
          <NavLink to="/pieces" className="small">
            &lt; Back
          </NavLink>
          <NavLink to={`/piece/${pieceId}/edit`} className="h3" style={{display: "flex", alignItems: "bottom", gap: "10px"}}>
            <img src={EditIcon} alt="" />
            Edit
          </NavLink>
        </div>

        <div className={`card-box ${styles.pieceCard}`}>
          <div className={styles.pieceTitle}>
            <div>
              <h2>{piece && piece.name}</h2>
              <em
                className={`class-tag ${piece && (piece.status === "Completed" ? "alt1" : piece.status === "Planned" ? "alt2" : null)}`}
              >
                {piece && piece.status}
              </em>
            </div>
            <h3>{piece && piece.composer}</h3>
          </div>

          <div className={styles.additionalInfo}>
            <div>
              <h3>
                {piece &&
                  piece.lastPracticeDate?.toLocaleString("en-AU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
              </h3>
              <small>Last Practiced</small>
            </div>
            <div>
              <h3>
                {piece &&
                  piece.freqNumber &&
                  `${piece.freqNumber} times/${piece.freqFrame}`}
              </h3>
              <small>Practice Frequency</small>
            </div>

            <NavLink to="/sessions" className="btn-blue">
              Practice
            </NavLink>
          </div>
        </div>
        <SubNav
          subNavData={[
            { url: `/piece/${pieceId}/view`, title: "Overview", end: true },
            { url: `/piece/${pieceId}/view/goals`, title: "Goals" },
            {
              url: `/piece/${pieceId}/view/sessions`,
              title: "Practiced Sessions",
            },
            { url: `/piece/${pieceId}/view/resources`, title: "Resources" },
            { url: `/piece/${pieceId}/view/terms`, title: "Music Terms" },
            { url: `/piece/${pieceId}/view/analytics`, title: "Analytics" },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section>
          <Outlet
            context={{ piece, analytics, goals, subsessions, resources, terms }}
          />
        </section>
      </main>
    </>
  );
}
