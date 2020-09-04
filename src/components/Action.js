import React from 'react'

export default function Action({ type, id, onActionClick }) {

  const handleClick = () => {
    onActionClick(id, type)
  }

  return (
    <span>
      <i className="material-icons"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}>{type}
      </i>
    </span>
  )
}
