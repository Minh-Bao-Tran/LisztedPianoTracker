import LinkIcon from "../../../../assets/icon/Link_Icon.svg";
import SheetIcon from "../../../../assets/icon/Sheet_Icon.svg";
import RecordingIcon from "../../../../assets/icon/Recording_Icon.svg";
import GuidesIcon from "../../../../assets/icon/Guides_Icon.svg";

import EditIcon from "../../../../assets/icon/Edit_icon.svg";

import styles from "./ResourceCard.module.css";

const resourceIconMapping: Record<ResourceType, string> = {
  "Sheet Music": SheetIcon,
  Guides: GuidesIcon,
  Recording: RecordingIcon,
  Others: LinkIcon,
};

export default function ResourceCard({
  index,
  resource,
  onClick,
}: {
  index: number;
  resource: ResourceData;
  onClick: () => void;
}) {
  return (
    <div key={index} className={styles.resourceCard}>
      <img
        src={resourceIconMapping[resource.resourceType]}
        alt=""
        className={styles.resourceIcon}
      />
      <div>
        <h3>{resource.resourceType}</h3>
        <p>{resource.resourceLink}</p>
      </div>
      <img src={EditIcon} alt="" onClick={onClick} />
    </div>
  );
}
