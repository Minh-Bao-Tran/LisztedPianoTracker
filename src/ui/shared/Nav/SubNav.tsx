import { NavLink } from "react-router";

import "./SubNav.css";

type SubNavData = { url: string; title: string; end?: boolean };

export default function SubNav(props: { subNavData: SubNavData[] }) {
  function indicateCurrentPage({
    isActive,
  }: {
    isActive: boolean;
  }): { textDecoration: string; fontWeight: string } | {} {
    const activeStyle = { textDecoration: "underline", fontWeight: "bold" };
    return isActive ? activeStyle : {};
  }

  const subNavElements = props.subNavData.map((subNavElementData, index) => {
    return (
      <li key={index}>
        <NavLink
          to={subNavElementData.url}
          end={subNavElementData.end ?? false}
          style={indicateCurrentPage}
        >
          {subNavElementData.title}
        </NavLink>
      </li>
    );
  });

  return (
    <nav className="sub-nav">
      <ul>{...subNavElements}</ul>
      <hr />
    </nav>
  );
}
