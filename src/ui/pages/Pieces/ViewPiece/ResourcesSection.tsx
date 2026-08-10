import { useOutletContext } from "react-router";
export default function ResourcesSection() {
  const props: { resources: ResourceData[] } = useOutletContext<{
    resources: ResourceData[];
  }>();

  let resources: ResourceData[] = [];
  if (props.resources) {
    console.log(props.resources);
    resources = props.resources;
  }

  const resourceElements = resources.map((resource, index) => {
    return (
      <li key={index} className="card-box">
        <p>{resource.resourceType}</p>
        <p>{resource.resourceLink} minutes</p>
        <p>{resource.notes ?? "N/A"}</p>
        {/* Transform this into a star rating later */}
      </li>
    );
  });

  return <>{resources && resourceElements}</>;
}
