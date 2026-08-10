import { Outlet } from "react-router";
import MainNav from "./shared/MainNav"

export default function Layout() {
  return (
    <>
      {" "}
      <MainNav />
      <div className="layout">
        <Outlet />
      </div>
    </>
  );
}
