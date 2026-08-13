import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet, useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";

import EditIcon from "../../../assets/icon/Edit_icon.svg";
import SubNav from "../../../shared/SubNav";

import styles from "./ViewSession.module.css";

export default function ViewSessionPage() {
  const sessionId = useParams().id;
  // const { setPopup } = useOutletContext<{
  //   setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
  // }>();

  // //Fetching Function
  // async function loadPieces() {
  //   window.electron
  //     .getOnePiece({
  //       id: sessionId as string,
  //     })
  //     .then((data) => {
  //       // console.log(data);
  //       if (!data) {
  //         alert("No Piece found");
  //         throw new Error("No piece found");
  //       }
  //       setPiece(data);
  //     });
  // }
  // //---State Management---
  // const [reloadCount, setReloadCount] = useState<number>(0);

  // const [piece, setPiece] = useState<Sess | undefined>(undefined);


  // //Fetch the Piece
  // useEffect(() => {
  //   console.log(sessionId);
  //   loadPieces();
  // }, [sessionId, reloadCount]);

  // return (
  //   <>
  //     <header className={styles.header}>
  //       <div className={styles.topButtonDiv}>
  //         <NavLink to="/pieces" className="small">
  //           &lt; Back
  //         </NavLink>
  //         <NavLink
  //           to={`/piece/${sessionId}/edit`}
  //           className="h3"
  //           style={{ display: "flex", alignItems: "bottom", gap: "10px" }}
  //         >
  //           <img src={EditIcon} alt="" />
  //           Edit
  //         </NavLink>
  //       </div>

  //       <div className={`card-box ${styles.pieceCard}`}>
  //         <div className={styles.pieceTitle}>
  //           <div>
  //             <h2>{piece && piece.name}</h2>
  //             <em
  //               className={`class-tag ${piece && (piece.status === "Completed" ? "alt1" : piece.status === "Planned" ? "alt2" : null)}`}
  //             >
  //               {piece && piece.status}
  //             </em>
  //           </div>
  //           <h3>{piece && piece.composer}</h3>
  //         </div>

  //         <div className={styles.additionalInfo}>
  //           <div>
  //             <h3>
  //               {piece &&
  //                 piece.lastPracticeDate?.toLocaleString("en-AU", {
  //                   day: "2-digit",
  //                   month: "2-digit",
  //                   year: "2-digit",
  //                 })}
  //             </h3>
  //             <small>Last Practiced</small>
  //           </div>
  //           <div>
  //             <h3>
  //               {piece &&
  //                 piece.freqNumber &&
  //                 `${piece.freqNumber} times/${piece.freqFrame}`}
  //             </h3>
  //             <small>Practice Frequency</small>
  //           </div>

  //           <NavLink to="/sessions" className="btn-blue">
  //             Practice
  //           </NavLink>
  //         </div>
  //       </div>
  //       <SubNav
  //         subNavData={[
  //           { url: `/piece/${pieceId}/view`, title: "Overview", end: true },
  //           { url: `/piece/${pieceId}/view/goals`, title: "Goals" },
  //           {
  //             url: `/piece/${pieceId}/view/sessions`,
  //             title: "Practiced Sessions",
  //           },
  //           { url: `/piece/${pieceId}/view/resources`, title: "Resources" },
  //           { url: `/piece/${pieceId}/view/terms`, title: "Music Terms" },
  //           { url: `/piece/${pieceId}/view/analytics`, title: "Analytics" },
  //         ]}
  //       />
  //     </header>

  //     <main className={styles.main}>
  //       <section>
  //         <Outlet
  //           context={{
  //             piece,
  //             analytics,
  //             goals,
  //             subsessions,
  //             resources,
  //             terms,
  //             setPopup,

  //             //Resource Section
  //             handleAddResource,
  //             handleDeleteResource,
  //             handleUpdateResource,

  //             //Goal Section
  //             handleAddGoal,
  //             handleUpdateGoal,
  //             handleDeleteGoal,
  //           }}
  //         />
  //       </section>
  //     </main>
  //   </>
  // );

  return <h1>{sessionId}</h1>
}
