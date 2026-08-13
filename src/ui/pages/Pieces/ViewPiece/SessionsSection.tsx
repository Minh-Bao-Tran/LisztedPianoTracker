import { useOutletContext } from "react-router";

import type { Column } from "../../../shared/MainTable";

import Table from "../../../shared/MainTable";

import Ratings from "../../../shared/Ratings";

export default function SessionsSection() {
  const props: { subsessions: ExtendedSubsessionData[] } = useOutletContext<{
    subsessions: ExtendedSubsessionData[];
  }>();

  let subsessions: ExtendedSubsessionData[] = [];
  if (props.subsessions) {
    console.log(props.subsessions);
    subsessions = props.subsessions;
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
      render: (subsession) => <p>{`${subsession.time} min.`}</p>,
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
