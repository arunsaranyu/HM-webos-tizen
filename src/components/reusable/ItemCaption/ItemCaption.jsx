import React from 'react';
import dot from "../../../assets/images/dot.svg";

const ItemCaption = (captions) => {
  if (!captions) return null;

  // Extract raw caption string or array from various possible structures
  let rawCaption = "";
  if (typeof captions === "string") {
    rawCaption = captions;
  } else if (Array.isArray(captions)) {
    rawCaption = captions;
  } else if (typeof captions === "object") {
    rawCaption =
      captions?.item_captions ||
      captions?.item_caption ||
      captions?.last_episode?.item_captions ||
      captions?.last_episode?.item_caption ||
      captions?.captions ||
      captions?.caption ||
      captions?.data?.item_captions ||
      captions?.data?.last_episode?.item_captions ||
      captions?.secondarytitle ||
      "";
  }

  // Parse into parts array
  let parts = [];
  if (Array.isArray(rawCaption)) {
    parts = rawCaption.map((p) => String(p).trim()).filter(Boolean);
  } else if (typeof rawCaption === "string" && rawCaption.trim()) {
    parts = rawCaption
      .split(/\s*[\.·•\|]\s*|\s*,\s*/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  if (!parts.length) return null;

  return parts.map((part, index) => {
    const isLast = index === parts.length - 1;
    return (
      <React.Fragment key={index}>
        <span
          style={{
            color: "#E1E1E2",
            display: "inline-flex",
            fontFamily: "euclid-semibold",
            whiteSpace: "nowrap",
          }}
        >
          {part}
        </span>
        {!isLast && (
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <img className="dot-style" src={dot} alt="" />
          </span>
        )}
      </React.Fragment>
    );
  });
};

export default ItemCaption;
