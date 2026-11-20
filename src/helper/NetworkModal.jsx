import React from 'react'

const NetworkModal = () => {
  return (
    <div className="main_banner">
    <div className="alerts">
      <p>{alert}</p>
      <h1 style={{ width: "auto" }}>{alertType}</h1>
    </div>
    <div className="Details">
      {image != "" ? <img src={image} alt="" /> : ""}
      <h1>{heading}</h1>
      <p>{Description}</p>
      <div className="ButtonsDisplay">
        {ButtonsArray?.map((_, i) => (
          <Button buttonText={ButtonTextArray[i]} direction={direction} from={from} reloadApp={reloadApp} closeApp={closeApp} cancelClose={cancelClose} networkStatus={networkStatus} />
          // <button>{ButtonTextArray[i]}</button>
        ))}
      </div>
    </div>
  </div>
  )
}

export default NetworkModal