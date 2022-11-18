import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Heart from './assets/Heart'


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
  const [collection, setCollection] = useState([]);
  const [gameData, setgameData] = useState({
    points: 0,
    lifes: 0,
    timeRemaining: 0,
    highScore: 0,
    currentQuestion: null,
    playing: false,
    fetchCount: 0
  })
  const ReqController = new AbortController()

  const generateQuestion = () => {
    if(collection.length <= 4){
      setgameData(e => ({...e, fetchCount: e.fetchCount + 1}))
    }

    setCollection(c => c.slice(4, c.length))
    console.log(collection.length)     
    const Random = Math.floor(Math.random() * 4)
    const fourItems = collection.slice(0,4)
    const tempdata = {bread: fourItems[Random].split("/")[4], photos: fourItems,answer: Random}
    return tempdata
  }


  const startGame = () => {   
    setgameData(e => ({...e, playing : true, timeRemaining : 30, points : 0, strickes : 0, currentQuestion : generateQuestion() })) 
  }

  const checkAns = (index) => {
    if(!gameData.playing) return

    if(gameData.lifes > 2)
      {
        return setgameData({...gameData, playing: false})
      }

    if(gameData.currentQuestion?.answer === index){
      setgameData(e => ({...e, points: e.points+1, currentQuestion: generateQuestion()}))
      console.log("true")
      console.log(gameData)
    } else {
      setgameData(e => ({...e, lifes: e.lifes + 1 }))
      console.log("false")
      
      
    }
  }


  
  useEffect(() => {
    async function GetData (){
      try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random/10", {signal: ReqController.signal});
        const json = await res.json();
        const uniqPics = getUniqueBreeds(json.message);
        setCollection(uniqPics)
      } catch (error) {
        console.log("Our request was Cancelled")
      }
    }
    GetData();
    // return () => {
    //   ReqController.abort();
    // }
  },[gameData.fetchCount])

 
  return (
    <div>
      {gameData?.currentQuestion &&
        <>
          <p className="flex justify-center gap-4 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className={gameData.playing && "animate-spin"} viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
            </svg>
            <span className="text-4xl">{"0:" + gameData.timeRemaining}</span>
            {[...Array(3 - gameData.lifes)].map((item, index) => {
              return <Heart key={index} classNames=" text-red-600"/>
            })}
            {[...Array(gameData.lifes)].map((item, index) => {
              return <Heart key={index} classNames=" text-red-300"/>
            })}
          </p>
          <h1 className="font-bold text-4xl pb-10 pt-2 md:text-7xl">{gameData.currentQuestion.bread}</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 px-5">
            {gameData.currentQuestion.photos.map((photo, index) => {
              return <div onClick={() => checkAns(index)} key={index} className="rounded-lg h-40 lg:h-80 bg-cover bg-center w-48" style={{backgroundImage: `url(${photo})`}}></div>
            })}
            <button onClick={() => startGame()}>reset</button>
          </div>
        </>
      }
      {gameData?.playing == false && Boolean(collection.length) && !gameData?.currentQuestion &&
        (
          <p>
            <button className="text-white bg-gradient-to-b from-indigo-500 to-indigo-800 px-5 py-4 rounded text-2xl font-bold" onClick={() => startGame()}>Play</button>
          </p>
        )
      }



      {gameData.timeRemaining <= 0 || gameData.lifes >= 3 && gameData.currentQuestion && 
      (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-black/90 text-white flex items-center justify-center">
          <div>
            {gameData.lifes >= 3 && <p className="text-4xl font-bold my-5">Game Over</p>}
            {gameData.timeRemaining <= 0 && <p className="text-4xl font-bold">Time Over</p>}
            <p> Your Score is : {gameData.points}</p>
            <button className="text-white bg-gradient-to-b from-green-500 to-green-800 px-5 py-4 rounded text-xl font-bold my-4" onClick={() => startGame()}>Play Again</button>
          </div>     

        </div>
      )}
    </div>
  )
}

export default App
