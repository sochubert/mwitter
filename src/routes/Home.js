import { dbService, storageService } from 'fbase';
import React, {useEffect, useState} from "react"
import Mweet from "components/Mweet";
import MweetFactory from "components/MweetFactory";

const Home = ({userObject}) => {
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


return (
  <div className="container">
    <MweetFactory userObject={userObject} />
    <div style={{marginTop: 30}}>
      {mweets.map((mweet) => (
        <Mweet key={mweet.id} mweetObject={mweet} isOwner={mweet.creatorId === userObject.uid } />
      ))}
    </div>
  </div>
  );
};
export default Home;