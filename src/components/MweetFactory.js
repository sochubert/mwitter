import React, { useState } from "react";
import {v4 as uuidv4 } from "uuid";
import {storageService, dbService} from "fbase";

const MweetFactory = ({userObject}) => {
  const [mweet, setMweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if(attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObject.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const mweetObject = {
      text: mweet,
      createdAt: Date.now(),
      creatorId: userObject.uid,
      attachmentUrl,
  };
    await dbService.collection("mweets").add(mweetObject);
    setMweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setMweet(value);
  };
  const onFileChange = (event) => {
    const { target:{files},
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: {result},
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
  return (
    <form onSubmit={onSubmit}>
      <input value={mweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Mweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  )
}
export default MweetFactory;