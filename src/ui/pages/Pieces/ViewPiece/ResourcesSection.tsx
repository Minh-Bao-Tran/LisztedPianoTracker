import { useOutletContext } from "react-router";

import ResourceCard from "../util/Card/ResourceCard";

import type { PopupData } from "../../../Layout";

import styles from "./ResourcesSection.module.css";

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
      <>
        <ResourceCard
          index={index}
          resource={resource}
          onClick={() => {
            openUpdateResource({
              currentValues: { ...resource },
              resourceId: resource.id,
            });
          }}
        />
        <hr />
      </>
    );
  });

  return (
    <div >
      <section className={styles.resourcesSection}>
        <div className={styles.buttonDiv}>
          <h3>Resources</h3>
          <button className="btn-blue" onClick={openAddNewResource}>
            +Add New Resource
          </button>
        </div>
        <ul>{resources && resourceElements}</ul>
      </section>
    </div>
  );
}
