import React from "react"
import { Link } from "react-router-dom"
import "./CardButton.css"

function CardButton(props) {
  return (
    <div>
      <div className="card-button">
        <Link to={props.to}>
          <div className="card-content">
            <h2>{props.title}</h2>
            <p className="card-description">{props.description}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default CardButton
