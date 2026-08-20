// Purpose: displays past sessions and allows navigation to session details.
import { useNavigate, useOutletContext } from "react-router";

import type { Column } from "../../../shared/Table/MainTable";

import Table from "../../../shared/Table/MainTable";

import Ratings from "../../../shared/Ratings";

export default function SessionsSection() {
  const navigate = useNavigate();
  const props: { subsessions: ExtendedSubsessionData[] } = useOutletContext<{
    subsessions: ExtendedSubsessionData[];
  }>();

  let subsessions = [];
  if (props.subsessions) {
    console.log(props.subsessions);
    subsessions = props.subsessions.map((subsession) => {
      return {
        ...subsession,
        onClick: () => {
          const confirm = window.confirm("Navigate to this session?");
          if (!confirm) return;
          navigate(`/session/${subsession.sessionId}/view`);
        },
      };
    });
  }

  const subsessionColumns: Column<ExtendedSubsessionData>[] = [
    {
      header: "Title",
      render: (subsession) => <p>{subsession.title}</p>,
    },
    {
      header: "Date",
      render: (subsession) => (
        <p>
          {subsession.date ? subsession.date.toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }) : "N/A"}
        </p>
      ),
    },
    {
      header: "Duration",
      render: (subsession) => <p>{`${subsession.totalTime} min.`}</p>,
    },
    {
      header: "Rating",
      render: (subsession) => <Ratings ratings={subsession.ratings} />,
    },
  ];

  return (
    <>
      {subsessions.length > 0 ? (
        <Table data={subsessions} columns={subsessionColumns} />
      ) : (
        <p>No Session to be shown</p>
      )}
    </>
  );
}
