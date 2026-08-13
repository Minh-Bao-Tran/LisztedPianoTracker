import { NavLink } from "react-router";

import styles from "./AllSession.module.css";

export default function AllSessionsPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <h2>All Sessions</h2>
          <NavLink to="/" className="btn-blue">
            +Create New Session
          </NavLink>
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
    </>
  );
}
