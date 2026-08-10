import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet } from "react-router";

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
          alert("No Analytics found");
          throw new Error("No Analytics found");
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
          alert("No Analytics found");
          throw new Error("No Analytics found");
        }
        setSubsessions(data);
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
  const [subsessions, setSubsessions] = useState<
    ExtendedSubsessionData[] | undefined
  >([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | undefined>(
    undefined,
  );

  //Fetch the Piece
  useEffect(() => {
    loadPieces();
    loadGoals();
    loadResources();
    loadSubsessions();
    loadAnalytics();
  }, [pieceId]);

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/pieces" className="small">
          &lt; Back
        </NavLink>
        <div className={`card-box ${styles.pieceCard}`}>
          <div className={styles.pieceTitle}>
            <div>
              <h2>{piece && piece.name}</h2>
              <em className={`class-tag`}>Active </em>
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
            context={{ piece, analytics, goals, subsessions, resources }}
          />
        </section>
      </main>
    </>
  );
}
