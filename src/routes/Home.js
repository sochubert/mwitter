import { dbService } from 'fbase';
import React, {useEffect, useState} from "react"
import Mweet from "components/Mweet";

const Home = ({userObject}) => {
  const [mweet, setMweet] = useState("");
  const [mweets, setMweets] = useState([]);
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
    await dbService.collection("mweets").add({
      text: mweet,
      createdAt: Date.now(),
      creatorId: userObject.uid,
    });
    setMweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setMweet(value);
  };
return (
  <div>
    <form onSubmit={onSubmit}>
      <input value={mweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
      <input type="submit" value="Mweet" />
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