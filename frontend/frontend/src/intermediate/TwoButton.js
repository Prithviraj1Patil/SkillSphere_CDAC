import React from "react"
import CardButton from "./CardButton"
import "./TwoButton"

function TwoButton(props) {
  return (
    <div className="centered-container">
      <CardButton to="/" title="Main" description="Move to Main Page" />
      <CardButton
        to="/user/dashboard"
        title="Create post"
        description="to create new post"
      />
    </div>
  )
}

export default TwoButton
