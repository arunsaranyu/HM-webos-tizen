import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useSelector } from "react-redux";

const InfoContent = (props) => {
  const { onArrowPress } = props;
  const { ref } = useFocusable({ onArrowPress });

  const infoData = useSelector((state) => state?.details?.data);

  const sections = infoData?.description
    ? infoData.description
      .replace(/\r\n\s*\r\n/g, "\r\n\r\n")
      .replace(/Cast\s*:\r\n/g, "Cast :\r\n\r\n")
      .replace(/Crew\s*:\r\n/g, "Crew :\r\n\r\n")
      .split(/\r\n\r\n/)
    : [];

  const releaseDate = infoData?.release_date_string
    ? (infoData.release_date_string.includes("T")
      ? infoData.release_date_string.split("T")[0]
      : infoData.release_date_string)
    : (infoData?.release_date || infoData?.released_date || infoData?.release_year || "NA");

  return (
    <div className="lists" ref={ref}>
      {sections.map((section, index) => (
        <div key={index}>
          {section.split("\r\n").map((line, lineIndex) => (
            <p key={lineIndex}>{line}</p>
          ))}
          <br />
        </div>
      ))}
      <h1 style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span>Language :</span>
        <span>{infoData?.language || "NA"}</span>
      </h1>
      <h1 style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span>Initial Release Date :</span>
        <span>{releaseDate}</span>
      </h1>
    </div>
  );
};

export default InfoContent;
