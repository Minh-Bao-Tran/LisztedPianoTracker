import { useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";

export default function ResourcesSection() {
  const {
    resources,
    setPopup,
    handleAddResource,
    handleDeleteResource,
    handleUpdateResource,
  } = useOutletContext<{
    resources: ResourceData[];
    setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
    handleAddResource: (newResource: Omit<ResourceData, "id">) => void;
    handleUpdateResource: (
      resourceId: string,
      newResource: Omit<ResourceData, "id">,
    ) => void;
    handleDeleteResource: (resourceId: string) => void;
  }>();

  function openAddNewResource() {
    setPopup({
      type: "addResource",
      currentValues: {},
      closeForm: () => {
        setPopup(undefined);
      },
      handleFormPredicate: (newResource: Omit<ResourceData, "id">) => {
        handleAddResource(newResource);
      },
    });
  }

  function openUpdateResource({
    currentValues,
    resourceId,
  }: {
    currentValues: Omit<ResourceData, "id">;
    resourceId: string;
  }) {
    setPopup({
      type: "editResource",
      currentValues: currentValues,
      closeForm: () => {
        setPopup(undefined);
      },
      handleFormPredicate: (newResource: Omit<ResourceData, "id">) => {
        handleUpdateResource(resourceId, newResource);
      },
      handleDeletePredicate: () => {
        console.log("here");
        handleDeleteResource(resourceId);
      },
    });
  }

  let allResources: ResourceData[] = [];
  if (resources) {
    console.log(resources);
    allResources = resources;
  }

  const resourceElements = allResources.map((resource, index) => {
    return (
      <li
        key={index}
        className="card-box"
        onClick={() => {
          openUpdateResource({
            currentValues: { ...resource },
            resourceId: resource.id,
          });
        }}
      >
        <p>{resource.resourceType}</p>
        <p>{resource.resourceLink} minutes</p>
        <p>{resource.notes ?? "N/A"}</p>
        {/* Transform this into a star rating later */}
      </li>
    );
  });

  return (
    <>
      <button className="btn-blue" onClick={openAddNewResource}>
        +Add New Resource
      </button>
      <section>{resources && resourceElements}</section>
    </>
  );
}
