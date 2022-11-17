import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'


function getUniqueBreeds(data) {
  const uniqueBreeds = []
  const uniquePics = data.filter(pic => {
    const breed = pic.split("/")[4];
    if(!uniqueBreeds.includes(breed) && !pic.includes(" ")) {
      uniqueBreeds.push(breed);
      return true
    }
  })
  return uniquePics.slice(0, Math.floor(uniquePics.length / 4) * 4)
}

function App() {
  const [gameData, setgameData] = useState({
    points: 0,
    strickes: 0,
    timeRemaining: 0,
    highScore: 0,
    bigCollection: [],
    currentQuestion: null,
    playing: false,
    fetchCount: 0
  })
  const ReqController = new AbortController()

  const startGame = () => {
    const generateQuestion = () => {
      //if(gameData.currentQuestion){
      
      //}
      const temp = gameData.bigCollection.slice(4, gameData.bigCollection.length);
      console.log(temp.length)
      setgameData({...gameData, bigCollection: temp})
      console.log(gameData.bigCollection.length)
      
      const Random = Math.floor(Math.random() * 4);

      const fourItems = gameData.bigCollection.slice(0, 4);
      
      const tempdata = {bread: fourItems[Random].split("/")[4], photos: fourItems,answer: Random}
      return tempdata
    }

    setgameData({...gameData, playing : true, timeRemaining : 30, points : 0, strickes : 0, currentQuestion : generateQuestion() })
    // setgameData({... gameData,  })
    // setgameData({... gameData, })
    // setgameData({... gameData, })
    // setgameData({... gameData, })
    
  }

  


  useEffect(() => {
    const GetData = async () => {
      try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random/50", {signal: ReqController.signal});
        const json = await res.json();
        const uniqPics = getUniqueBreeds(json.message);
        setgameData({...gameData, bigCollection : uniqPics})
      } catch (error) {
        console.log("Our request was Cancelled")
      }
    }
    GetData();

    return () => {
      ReqController.abort();
    }
  },[])

 
  return (
    <div>
      {gameData.currentQuestion &&
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 px-5">
            {gameData.currentQuestion.photos.map((photo, index) => {
              return <div key={index} className="rounde-lg h-40 lg:h-80 bg-cover bg-center w-40" style={{backgroundImage: `url(${photo})`}}></div>
            })}
            <button onClick={() => startGame()}>reset</button>
          </div>
        </>
      }
      {gameData.playing == false && Boolean(gameData.bigCollection.length) && !gameData.currentQuestion &&
        (
          <p>
            <button className="text-white bg-gradient-to-b from-indigo-500 to-indigo-800 px-5 py-4 rounded texr-2xl font-bold" onClick={() => startGame()}>Play</button>
          </p>
        )
      }
    </div>
  )
}

export default App
