import { NavLink } from "react-router";

import appIcon from "../../assets/icon/App_icon.svg";
import homeIcon from "../../assets/icon/Home_icon.svg";
import pieceIcon from "../../assets/icon/Piece_icon.svg";
import sessionIcon from "../../assets/icon/Session_icon.svg";
import glossaryIcon from "../../assets/icon/Glossary_icon.svg";

import "./MainNav.css";

export default function MainNav() {
  return (
    <aside className="main-nav">
      <nav>
        {" "}
        <NavLink to="/" className="app-logo">
          <img src={appIcon} alt="" />
        </NavLink>
        <ul>
          <li key={0}>
            <NavLink to="/">
              <img src={homeIcon} alt="" />
            </NavLink>
          </li>
          <li key={1}>
            <NavLink to="/pieces">
              <img src={pieceIcon} alt="" />
            </NavLink>
          </li>
          <li key={2}>
            <NavLink to="/sessions">
              <img src={sessionIcon} alt="" />
            </NavLink>
          </li>
          <li key={3}>
            <NavLink to="/glossary">
              <img src={glossaryIcon} alt="" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
