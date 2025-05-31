import React, { useEffect, useState } from "react"
import type { CountryData } from "../types" // Using type-only import as discussed

// MessageBox Component: Replaces alert() for user feedback
interface MessageBoxProps {
  message: string
  show: boolean
  onClose: () => void
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, show, onClose }) => {
  if (!show) return null // Don't render if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border-2 border-gray-300">
        <p className="text-xl font-semibold mb-6 text-gray-800 ">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out"
        >
          OK
        </button>
      </div>
    </div>
  )
}

// CorrectAnimationBox Component: Displays the fading green "CORRECT!" box
interface CorrectAnimationBoxProps {
  show: boolean
}

const CorrectAnimationBox: React.FC<CorrectAnimationBoxProps> = ({ show }) => {
  if (!show) return null // Don't render if not visible

  return (
    <>
      <div
        className="
        correct-animation-box
        absolute inset-0
        bg-green-500
        flex items-center justify-center
        text-white text-2xl font-bold
        rounded-lg
        pointer-events-none /* Allows clicks to pass through */
        z-40 /* Ensure it's above other content but below message box */
      "
      >
        CORRECT!
      </div>
      <style>{`
        .correct-animation-box {
          animation: fadeAndScale 0.5s ease-in-out forwards;
        }

        @keyframes fadeAndScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.0);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  )
}

export default function CountryQuiz() {
  const [quizData, setQuizData] = useState<CountryData | null>(null)
  const [quizType, setQuizType] = useState<"flags" | "capitals">("flags")
  const [region, setRegion] = useState("All")
  const [quizGuess, setQuizGuess] = useState("")
  const [score, setScore] = useState(0)
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)
  const [showMessageBox, setShowMessageBox] = useState(false)
  const [messageBoxContent, setMessageBoxContent] = useState("")
  const [dropdown, setDropdown] = useState(false)
  useEffect(() => {
    fetchNewQuizCountry()
  }, [region])
  const fetchNewQuizCountry = async () => {
    try {
      const regionLowercase = region.toLowerCase()
      let response
      if (regionLowercase == "all") {
        response = await fetch(
          `https://restcountries.com/v3.1/${regionLowercase}`
        )
      } else {
        response = await fetch(
          `https://restcountries.com/v3.1/region/${regionLowercase}`
        )
      }
      if (!response.ok) {
        throw new Error("Failed to fetch countries for quiz")
      }
      const data: CountryData[] = await response.json()
      setQuizData(data[Math.floor(Math.random() * data.length)])
    } catch (error) {
      console.error("Error fetching quiz country:", error)
      setMessageBoxContent("Failed to load quiz country. Please try again.")
      setShowMessageBox(true)
      setQuizData(null)
    }
  }
  const handleQuizGuess = async () => {
    if (!quizData) {
      setMessageBoxContent("Please get a random country first!")
      setShowMessageBox(true)
      return
    }
    const isCorrect =
      quizGuess.toLowerCase() === quizData.name.common.toLowerCase()
    if (isCorrect) {
      setScore(score + 1)
      setShowCorrectAnimation(true)
      setTimeout(() => setShowCorrectAnimation(false), 500)
      setQuizGuess("")
      await fetchNewQuizCountry()
    } else {
      setMessageBoxContent("WRONG, keep trying or give up if you can't get it")
      setShowMessageBox(true)
      setScore(0)
    }
  }
  const handleGiveUp = async () => {
    if (quizData?.name.common) {
      setMessageBoxContent(`The correct answer was ${quizData.name.common}`)
      setShowMessageBox(true)
    } else {
      setMessageBoxContent(
        "You must first click the button to get a random country"
      )
      setShowMessageBox(true)
    }
    setScore(0)
    setQuizGuess("")
    await fetchNewQuizCountry()
  }
  const closeMessageBox = () => {
    setShowMessageBox(false)
    setMessageBoxContent("")
  }

  return (
    <div className="relative flex items-center justify-center flex-col gap-10 p-4 min-h-screen">
      {/* Render the correct animation box if 'showCorrectAnimation' is true */}
      <CorrectAnimationBox show={showCorrectAnimation} />
      {/* Render the message box if 'showMessageBox' is true */}
      <MessageBox
        message={messageBoxContent}
        show={showMessageBox}
        onClose={closeMessageBox}
      />
      <div className="text-6xl font-bold text-gray-800">
        Quiz your country knowledge below
      </div>
      <div className="text-6xl font-bold text-gray-600">↓</div>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 items-center justify-center">
        <div className="text-3xl font-bold text-gray-700">
          Testing by (click to change):
        </div>
        <p
          onClick={() =>
            setQuizType(quizType === "flags" ? "capitals" : "flags")
          }
          className="text-3xl p-4 rounded-lg shadow-md bg-blue-400 text-white 
                     hover:bg-blue-600 hover:shadow-lg cursor-pointer 
                     transition duration-300 ease-in-out transform hover:scale-105"
        >
          {quizType.charAt(0).toUpperCase() + quizType.slice(1)}{" "}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 items-center justify-center">
        <div className="text-3xl font-bold text-gray-700">
          Region (click to change):
        </div>
        <p>
          {dropdown ? (
            <div
              className="text-3xl p-4 rounded-lg bg-blue-400 text-white 
                         cursor-pointer flex flex-col gap-10"
            >
              <div
                className="border-black border-4 text-center bg-blue-300
                           hover:bg-blue-700 hover:scale-110"
                onClick={() => {
                  setRegion("Asia")
                  setDropdown(!dropdown)
                }}
              >
                Asia
              </div>
              <div
                className="border-black border-4 text-center bg-blue-300
                           hover:bg-blue-700 hover:scale-110"
                onClick={() => {
                  setRegion("Africa")
                  setDropdown(!dropdown)
                }}
              >
                Africa
              </div>
              <div
                className="border-black border-4 text-center bg-blue-300
                           hover:bg-blue-700 hover:scale-110"
                onClick={() => {
                  setRegion("Americas")
                  setDropdown(!dropdown)
                }}
              >
                Americas
              </div>
              <div
                className="border-black border-4 text-center bg-blue-300
                           hover:bg-blue-700 hover:scale-110"
                onClick={() => {
                  setRegion("Europe")
                  setDropdown(!dropdown)
                }}
              >
                Europe
              </div>
              <div
                className="border-black border-4 text-center bg-blue-300
                           hover:bg-blue-700 hover:scale-110"
                onClick={() => {
                  setRegion("Oceania")
                  setDropdown(!dropdown)
                }}
              >
                Oceania
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                setDropdown(!dropdown)
              }}
              className="text-3xl p-4 rounded-lg bg-blue-400 text-white 
                     hover:bg-blue-600 cursor-pointer hover:scale-105"
            >
              {region}
            </div>
          )}
        </p>
      </div>
      {quizType === "flags" ? (
        <div className="text-xl text-gray-700">
          Testing your {region == "All" ? "" : region} flag knowledge!
        </div>
      ) : (
        <div className="text-xl text-gray-700">
          Testing your {region == "All" ? "" : region} capital city knowledge!
        </div>
      )}
      <button
        onClick={fetchNewQuizCountry}
        className="p-6 sm:p-10 border-4 border-black rounded-lg shadow-lg 
                   hover:bg-blue-700 bg-blue-400 text-white font-bold text-xl sm:text-2xl
                   hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl cursor-pointer 
                   transition duration-300 ease-in-out transform hover:scale-105"
      >
        Click here to get a random country for the quiz!
      </button>
      <div className="text-7xl sm:text-9xl font-bold text-gray-900 mt-8 mb-8">
        {quizType === "flags" ? quizData?.flag : quizData?.capital?.[0]}
        {quizType === "capitals" && !quizData?.capital?.[0] && quizData && (
          <span className="text-xl text-red-500">
            No capital data available.
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 w-full max-w-2xl">
        <input
          value={quizGuess}
          onChange={(event) => setQuizGuess(event.target.value)}
          className="flex-1 p-6 sm:p-10 border-4 border-gray-400 rounded-lg shadow-inner 
                     text-lg sm:text-xl placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter guess here"
        />
        <button
          onClick={handleQuizGuess}
          className="flex-1 p-6 sm:p-10 border-4 border-black rounded-lg shadow-lg 
                     bg-green-500 text-white font-bold text-xl sm:text-2xl
                     hover:bg-green-700 cursor-pointer 
                     transform hover:scale-105"
        >
          Test your guess!
        </button>
        <button
          onClick={handleGiveUp}
          className="flex-1 p-6 sm:p-10 border-4 border-black rounded-lg shadow-lg 
                     bg-red-500 text-white font-bold text-xl sm:text-2xl
                     hover:red-700 cursor-pointer 
                     transform hover:scale-105"
        >
          Give up!
        </button>
      </div>
      <div className="text-5xl sm:text-6xl font-bold text-gray-800 mt-8">
        Score (in a row): {score}
      </div>
      <div className="mb-20"></div> {/* Extra spacing at the bottom */}
    </div>
  )
}
