import { dbService } from 'fbase';
import React, { useState } from "react";

const Mweet = ({mweetObject, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newMweet, setNewMweet] = useState(mweetObject.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this mweet?");
    if(ok) {
      await dbService.doc(`mweets/${mweetObject.id}`).delete();
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
    <div>
      {
        editing ? (
          <>
        <form onSubmit={onSubmit}> 
          <input type="text" placeholder="Edit your mweet" value={newMweet} required onChange={onChange} />
          <input type="submit" value="Update Mweet" />
        </form>
        <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
      <>
        <h4>{mweetObject.text}</h4>
        {isOwner && (
        <>
          <button onClick={onDeleteClick}>Delete Mweet</button>
          <button onClick={toggleEditing}>Edit Mweet</button>
        </>
      )}
      </>
      )}
    </div>
  );
};


export default Mweet;