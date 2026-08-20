// Purpose: visual star-rating renderer mapping a numeric score to star icons.
import filledStarIcon from "../assets/icon/Filled_Star_Icon.svg";
import halfFilledStarIcon from "../assets/icon/Half_filled_Star_Icon.svg";
import emptyStarIcon from "../assets/icon/Empty_Star_Icon.svg";

export default function Ratings({ ratings }: { ratings: number }) {
  const starList: string[] = [];

  const filledStarNumber: number = (ratings - (ratings % 20)) / 20;
  for (let i = 0; i < filledStarNumber; i++) {
    starList.push(filledStarIcon);
  }

  if (ratings % 20 >= 10) {
    starList.push(halfFilledStarIcon);
  }

  for (let i = starList.length; i < 5; i++) {
    starList.push(emptyStarIcon);
  }

  const starElements = starList.map((starSrc, index) => (
    <img
      key={index}
      src={starSrc}
      style={{ width: "30px", height: "auto" }}
    ></img>
  ));

  return (
    <div style={{ alignItems: "center" }}>
      {starElements.length && (
        <ul style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
          {starElements}
        </ul>
      )}
    </div>
  );
}
