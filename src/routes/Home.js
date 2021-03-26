import { dbService, storageService } from 'fbase';
import {v4 as uuidv4 } from "uuid";
import React, {useEffect, useState} from "react"
import Mweet from "components/Mweet";

const Home = ({userObject}) => {
  const [mweet, setMweet] = useState("");
  const [mweets, setMweets] = useState([]);
  const [attachment, setAttachment] = useState();
  useEffect(() => {
    dbService.collection("mweets").onSnapshot((snapshot) => {
      const mweetArray = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(),
      }));
      setMweets(mweetArray);
    });
  }, []);

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
  <div>
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
    <div key={mweet.id}>
      {mweets.map((mweet) => (
        <Mweet key={mweet.id} mweetObject={mweet} isOwner={mweet.creatorId === userObject.uid } />
      ))}
    </div>
  </div>
  );
};
export default Home;