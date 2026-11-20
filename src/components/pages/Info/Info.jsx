import React, { useCallback, useEffect } from "react";
import tag_exclusive from "../../../assets/images/tag_exclusive.png";
import { useDispatch, useSelector } from "react-redux";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

import "./Info.scss";
import InfoContent from "./InfoContent.jsx";
import dot from "../../../assets/images/dot.svg"
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";

const Info = () => {
  const infoData = useSelector((state) => state?.details?.data);
  const dispatch = useDispatch();

  const { ref, focusKey, focusSelf } = useFocusable({});
  useEffect(() => {
    dispatch(sidebarDisable());
    focusSelf();
  }, []);

  const onScroll = useCallback(
    (direction) => {
      if (direction === "down") {
        ref.current.scrollTop += 300;
      } else if (direction === "up") {
        ref.current.scrollTop -= 300;
      }
    },
    [ref]
  );

  const sections = infoData?.description?.split(/\r\n/);

  var dataObject = {};
  var elements;
  if (infoData) {
    // Iterate through the sections
    sections?.forEach((section) => {
      // Split each section into key and value
      const [key, ...values] = section?.split(/\s*:\s*/);

      // Store the key-value pair in the object
      dataObject[key] = values?.join(", ");
    });
    elements = Object.keys(dataObject).map((key) => {
      const values = dataObject[key]?.split(",").map((part) => part.trim());

      if (values[0] == "") {
        return (
          <p className="lists" key={key}>
            {key}
          </p>
        );
      } else {
        return (
          <ul className="lists" key={key} ref={ref}>
            <b>{key}:</b>
            {values.map((value, index) =>
              values[index] !== "" ? <li key={index}>{value}</li> : "\n"
            )}
          </ul>
        );
      }
    });
  }

  var backgroundImg = '';
  if (infoData && infoData?.thumbnails) {
    if (infoData?.thumbnails?.medium_16_9?.url) {
      backgroundImg = infoData?.thumbnails?.medium_16_9?.url;
    }
  }
  const processCaption = (captions) => {
    if (!!captions && captions?.release_date_string && captions?.item_captions) {
      const date = captions?.release_date_string?.split("T")[0] + " . " + captions?.item_captions

      const parts = date.split(" . ");
      // console.log("date",parts)
      // Prepare an array to hold JSX elements
      const captionElements = [];

      // Loop through parts array and add color to dots
      !!parts && parts.forEach((part, index) => {
        // If it's not the last part, add dot with color

        if (index < parts.length - 1) {
          captionElements.push(<div style={{ color: '#E1E1E2', display: "inline-flex" }}>{part} <div style={{ display: "flex", alignItems: "center" }}> <img class="dot-style" src={dot} alt="" /> </div></div>);
        } else {
          // Otherwise, add the last part without dot
          captionElements.push(<div style={{ color: '#E1E1E2', display: "inline-flex", }}>{part}</div>);
        }

      });
      return captionElements;
    }
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="main-card settings-card"
        style={{
          // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.56), rgba(0, 0, 0, 0.56)),url(${infoData?.thumbnails?.high_16_9?.url})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          marginLeft: "0",
          backgroundImage: `linear-gradient(0deg, rgb(24,29,37), rgba(24,29,37,0)),linear-gradient(90deg, rgb(24,29,37), rgba(24,29,37,0)), url('${backgroundImg}')`,
        }}
      >
        <div className="setting-title" style={{ width: '55%' }}>
          {infoData?.title_image_display == true ? (
            <img id="titleImage" src={infoData?.title_image} alt="titleimage" />
          ) : (
            <p className="Title">{infoData?.title}</p>
          )}

          <p id="sub-title">{processCaption(infoData)}</p>


          <div
            ref={ref}
            className="setting-content-info"
            style={{ position: "relative" }}
          >
            <h1>Info</h1>
            {<InfoContent onArrowPress={onScroll} />}
          </div>
        </div>

        {/* <div
          ref={ref}
          className="setting-content"
          style={{ position: "relative" }}
        >
          <h1>Info</h1>
          {<InfoContent onArrowPress={onScroll} />}
        </div> */}
      </div>
    </FocusContext.Provider>
  );
};

export default Info;
