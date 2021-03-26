import { dbService, storageService } from 'fbase';
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Mweet = ({mweetObject, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newMweet, setNewMweet] = useState(mweetObject.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this mweet?");
    if(ok) {
      await dbService.doc(`mweets/${mweetObject.id}`).delete();
      await storageService.refFromURL(mweetObject.attachmentUrl).delete();
    }
  };
const toggleEditing = () => setEditing((prev) => !prev);
const onSubmit = async (event) => {
  event.preventDefault();
  await dbService.doc(`mweets/${mweetObject.id}`).update({
    text:newMweet,
  });
  setEditing(false);
} 
const onChange = (event) => {
  const {
    target: {value},
  } = event;
  setNewMweet(value);
}
  return (
    <div className="mweet">
      {
        editing ? (
          <>
        <form onSubmit={onSubmit} className="container mweetEdit"> 
          <input type="text" placeholder="Edit your mweet" value={newMweet} required autoFocus onChange={onChange} className="formInput" />
          <input type="submit" value="Update Mweet" className="formBtn" />
        </form>
        <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
        </span>
        </>
      ) : (
      <>
        <h4>{mweetObject.text}</h4>
        {mweetObject.attachmentUrl && <img src={mweetObject.attachmentUrl} />}
        {isOwner && (
        <div class="mweet__actions">
          <span onClick={onDeleteClick}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
          <span onClick={toggleEditing}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </span>
        </div>
      )}
      </>
      )}
    </div>
  );
};


export default Mweet;