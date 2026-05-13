import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

const BEST_TIME_KEY = "tenzies-best-time"
const BEST_ROLLS_KEY = "tenzies-best-rolls"

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = String(totalSeconds % 60).padStart(2, "0")

    return `${minutes}:${seconds}`
}

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [rollCount, setRollCount] = useState(0)
    const [time, setTime] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)
    const [bestTime, setBestTime] = useState(() => {
        const savedBestTime = localStorage.getItem(BEST_TIME_KEY)

        return savedBestTime ? Number(savedBestTime) : null
    })
    const [bestRolls, setBestRolls] = useState(() => {
        const savedBestRolls = localStorage.getItem(BEST_ROLLS_KEY)

        return savedBestRolls ? Number(savedBestRolls) : null
    })
    const [windowSize, setWindowSize] = useState(() => ({
        width: window.innerWidth,
        height: window.innerHeight
    }))
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

    useEffect(() => {
        function updateWindowSize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener("resize", updateWindowSize)

        return () => window.removeEventListener("resize", updateWindowSize)
    }, [])

    useEffect(() => {
        if (!hasStarted || gameWon) return

        const intervalId = setInterval(() => {
            setTime(prevTime => prevTime + 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [hasStarted, gameWon])

    useEffect(() => {
        if (!gameWon) return

        setBestTime(prevBestTime => {
            if (prevBestTime !== null && prevBestTime <= time) {
                return prevBestTime
            }

            localStorage.setItem(BEST_TIME_KEY, String(time))
            return time
        })

        setBestRolls(prevBestRolls => {
            if (prevBestRolls !== null && prevBestRolls <= rollCount) {
                return prevBestRolls
            }

            localStorage.setItem(BEST_ROLLS_KEY, String(rollCount))
            return rollCount
        })
    }, [gameWon, time, rollCount])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
        if (!gameWon) {
            setHasStarted(true)
            setRollCount(prevCount => prevCount + 1)
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
            setRollCount(0)
            setTime(0)
            setHasStarted(false)
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
            disabled={gameWon}
        />
    ))

    const formattedTime = formatTime(time)
    const formattedBestTime = bestTime === null ? "--" : formatTime(bestTime)
    const formattedBestRolls = bestRolls === null ? "--" : bestRolls

    return (
        <main>
            {gameWon && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    style={{ position: "fixed" }}
                />
            )}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="stats" aria-label="Game stats">
                <div className="stat-card">
                    <span className="stat-label">Time</span>
                    <span className="stat-value">{formattedTime}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Rolls</span>
                    <span className="stat-value">{rollCount}</span>
                </div>
            </div>
            <div className="best-stats" aria-label="Best scores">
                <p>Best Time: {formattedBestTime}</p>
                <p>Best Rolls: {formattedBestRolls}</p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
            {gameWon && (
                <p className="win-message">
                    {"\u{1F389}"} You won in {formattedTime} with {rollCount} rolls!
                </p>
            )}
        </main>
    )
}
