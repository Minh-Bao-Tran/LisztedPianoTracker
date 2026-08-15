import { useNavigate, useOutletContext } from "react-router";

import type { Column } from "../../../shared/MainTable";

import Table from "../../../shared/MainTable";

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
        onClick: () => navigate(`/session/${subsession.sessionId}/view`),
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
          {subsession.date.toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
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
      {subsessions && <Table data={subsessions} columns={subsessionColumns} />}
    </>
  );
}
