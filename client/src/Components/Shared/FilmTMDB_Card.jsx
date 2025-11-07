import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getCountryName,
  getReleaseYear,
  fetchFilmFromTMDB,
  getNameParts,
} from "../../Utils/helperFunctions"

import InteractionConsole from "./InteractionConsole"
import { MdStars } from "react-icons/md"
import { MdPeople } from "react-icons/md"

export default function FilmTMDB_Card({ filmObject, queryString }) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const navigate = useNavigate()
  const [isDirectorHover, setIsDirectorHover] = useState(false)
  const [hoverId, setHoverId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [movieDetails, setMovieDetails] = useState({})
  const [directors, setDirectors] = useState([]) //director
  // const img = document.getElementById(`thumbnail-${filmObject.id}`)
  // const filmCard = document.getElementById(`film-card-${filmObject.id}`)

  useEffect(() => {
    const fetchPageData = async () => {
      if (hoverId) {
        setIsLoading(true)
        try {
          fetchFilmFromTMDB(hoverId, setMovieDetails, setDirectors)
        } catch (err) {
          console.error("Error loading film data: ", err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchPageData()
  }, [hoverId])

  useEffect(() => {
    const filmCard = document.getElementById(`film-card-${filmObject.id}`)
    const img = new Image()
    img.crossOrigin = "anonymous"

    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://image.tmdb.org/t/p/w500${filmObject.backdrop_path}`)}`
    img.src = proxyUrl

    img.onload = () => {
      const colorThief = new ColorThief()
      let domColor
      let brightness
      try {
        domColor = colorThief.getColor(img)
        /* Check brightness of dominant color to ensure readability 
        Formula: https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx */
        brightness = Math.round(
          Math.sqrt(
            domColor[0] * domColor[0] * 0.241 +
              domColor[1] * domColor[1] * 0.691 +
              domColor[2] * domColor[2] * 0.068
          )
        )
        /* If bg dark enough, font can be white */
        if (brightness > 194) {
          filmCard.style.backgroundColor = `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.4)`
          /* If bg a little light, reduce each rgb value by 33% */
        } else if (130 < brightness <= 194) {
          filmCard.style.backgroundColor = `rgba(${domColor[0] * 1.2}, ${domColor[1] * 1.2}, ${domColor[2] * 1.2}, 0.4)`
          /* If bg too light, reduce each rgb value by 66% */
        } else {
          filmCard.style.backgroundColor = `rgba(${domColor[0] * 1.8}, ${domColor[1] * 1.8}, ${domColor[2] * 1.8}, 0.4)`
        }
      } catch (err) {
        console.log(err)
      }
    }
    // console.log(filmCard)
  }, [])

  return (
    <div
      id={`film-card-${filmObject.id}`}
      className="film-item w-[30rem] min-w-[20rem] aspect-16/10 flex flex-col justify-center items-start gap-0 bg-zinc-200">
      {/* Poster */}
      <div
        className="group/thumbnail overflow-hidden relative"
        onMouseEnter={() => {
          setHoverId(filmObject.id)
        }}
        onMouseLeave={() => {
          setHoverId(null)
        }}>
        <img
          id={`thumbnail-${filmObject.id}`}
          className="w-[30rem] min-w-[20rem] aspect-16/10 object-cover transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03]"
          src={
            filmObject.backdrop_path !== null
              ? `${imgBaseUrl}${filmObject.backdrop_path}`
              : `backdropnotfound.jpg`
          }
          alt=""
          onClick={() => {
            navigate(
              `/films/${filmObject.id}`
              //   {
              //   state: {
              //     currentViewMode: queryString,
              //   },
              // }
            )
          }}
        />
        {hoverId === filmObject.id && (
          <div className="border-red-500 absolute bottom-0 left-0 w-[30rem] min-w-[20rem] aspect-16/10 object-cover bg-black/70 flex items-center justify-center">
            <InteractionConsole
              tmdbId={hoverId}
              directors={directors}
              movieDetails={movieDetails}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              css={{
                textColor: "white",
                hoverBg: "bg-zinc-200/30",
                hoverTextColor: "text-blue-200",
                fontSize: "base",
                likeSize: "2xl",
                saveSize: "4xl",
                starSize: "3xl",
                flexGap: "2",
                likeColor: "red-800",
                saveColor: "green-800",
              }}
            />
            <div
              className="border-red-500 absolute w-full h-full z-10"
              onClick={() => {
                navigate(`/films/${filmObject.id}`)
              }}></div>
          </div>
        )}
      </div>

      {/* Text below poster */}
      <div className="text-black w-full p-4 flex justify-between">
        {/* Left side - Title, year*/}
        <div className="border-amber-400 flex flex-col items-start justify-center gap-0 ml-1">
          {/* Film Title */}
          <div>
            <span
              onClick={() => {
                navigate(
                  `/films/${filmObject.id}`
                  //   {
                  //   state: {
                  //     currentViewMode: queryString,
                  //   },
                  // }
                )
              }}
              className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-lg ">
              {`${filmObject.title.slice(0, 25)}`}
            </span>
            {filmObject.title.length >= 25 && (
              <span className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-lg">
                ...
              </span>
            )}
          </div>
          {/* Release year & Director's name */}
          <div className="flex items-center uppercase text-sm gap-1">
            {filmObject.release_date && (
              <span className="">
                {`${getReleaseYear(filmObject.release_date)}`}
              </span>
            )}
          </div>
        </div>
        {/* Right side - TMDB rating and vote count */}
        <div className="flex items-center gap-5 justify-center mr-1">
          <div className="flex items-center justify-center gap-1">
            <MdStars className="text-xl" />
            <div>{Number(filmObject.vote_average).toFixed(1)}</div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <MdPeople className="text-2xl" />
            <div>{filmObject.vote_count}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// {
//   queryString && filmObject.directors && (
//     <span className="">
//       <span className="flex gap-1 uppercase text-xs italic font-semibold">
//         {/* <span>|</span> */}
//         {filmObject.directors.map((dir, key) => {
//           return (
//             <span key={key}>
//               <span>{`${dir.name}`}</span>
//               {/* Add a comma if it's not the last country on the list */}
//               {key !== filmObject.directors.length - 1 && (
//                 <span>,</span>
//               )}
//             </span>
//           )
//         })}
//       </span>
//     </span>
//   )
// }
