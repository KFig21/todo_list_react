import React from "react";
import "./delete.scss";
// icons

export default function Delete({
  handleDeleteTask,
  showDelete,
  setShowDelete,
}) {
  const handleDelete = () => {
    handleDeleteTask();
    setShowDelete((showDelete) => !showDelete);
  };

  const handleCancel = () => {
    setShowDelete((showDelete) => !showDelete);
  };

  return (
    <div className="delete-item">
      <button className="cancel" onClick={() => handleCancel()}>
        Cancel
      </button>
      <button className="delete" onClick={() => handleDelete()}>
        Delete
      </button>
    </div>
  );
}
