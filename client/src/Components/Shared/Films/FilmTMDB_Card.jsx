import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getReleaseYear } from "../../../Utils/helperFunctions"
import { fetchFilmFromTMDB } from "../../../Utils/apiCalls"

import InteractionConsole from "../Buttons/InteractionConsole"
import { MdStars } from "react-icons/md"
import { MdPeople } from "react-icons/md"

export default function FilmTMDB_Card({ filmObject, setPage }) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const navigate = useNavigate()
  const [hoverId, setHoverId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [movieDetails, setMovieDetails] = useState({})
  const [directors, setDirectors] = useState([]) //director

  /* Fetch TMDB details for a film when it's hovered on --- might become obsolete */
  useEffect(() => {
    // console.log("Hover Id Hook triggered: ", hoverId)
    const fetchPageData = async () => {
      if (hoverId) {
        try {
          setIsLoading(true)
          const result = await fetchFilmFromTMDB(hoverId)
          const directorsList = result.credits.crew.filter(
            (crewMember) => crewMember.job === "Director"
          )
          setMovieDetails(result)
          setDirectors(directorsList)
        } catch (err) {
          console.error("Error loading film data: ", err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchPageData()
  }, [hoverId])

  /* Fetch TMDB details for each film card that shows up on screen */
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true)
        const result = await fetchFilmFromTMDB(filmObject.id)
        const directorsList = result.credits.crew.filter(
          (crewMember) => crewMember.job === "Director"
        )
        setMovieDetails(result)
        setDirectors(directorsList)
      } catch (err) {
        console.error("Error loading film data: ", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPageData()
  }, [])

  // useEffect(() => {
  //   const filmCard = document.getElementById(`film-card-${filmObject.id}`)

  //   const proxyUrl = `https://cors-anywhere.com/${encodeURIComponent(`https://image.tmdb.org/t/p/w500${filmObject.backdrop_path}`)}`

  //   fetch(proxyUrl)
  //     .then((response) => {
  //       console.log(response)
  //       // response.json()
  //     })
  //     .then((data) => {
  //       const base64Image = btoa(data.contents)
  //       const img = new Image()
  //       img.crossOrigin = "anonymous"
  //       img.src = `data:image/jpeg;base64,${base64Image}`
  //       img.onload = () => {
  //         const colorThief = new ColorThief()
  //         let domColor
  //         let brightness
  //         try {
  //           domColor = colorThief.getColor(img)
  //           /* Check brightness of dominant color to ensure readability
  //       Formula: https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx */
  //           brightness = Math.round(
  //             Math.sqrt(
  //               domColor[0] * domColor[0] * 0.241 +
  //                 domColor[1] * domColor[1] * 0.691 +
  //                 domColor[2] * domColor[2] * 0.068
  //             )
  //           )
  //           /* If bg dark enough, font can be white */
  //           if (brightness > 194) {
  //             filmCard.style.backgroundColor = `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.4)`
  //             /* If bg a little light, reduce each rgb value by 33% */
  //           } else if (130 < brightness <= 194) {
  //             filmCard.style.backgroundColor = `rgba(${domColor[0] * 1.2}, ${domColor[1] * 1.2}, ${domColor[2] * 1.2}, 0.4)`
  //             /* If bg too light, reduce each rgb value by 66% */
  //           } else {
  //             filmCard.style.backgroundColor = `rgba(${domColor[0] * 1.8}, ${domColor[1] * 1.8}, ${domColor[2] * 1.8}, 0.4)`
  //           }
  //         } catch (err) {
  //           console.log(err)
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Error fetching image with AllOrigins: ", err)
  //     })

  //   // console.log(filmCard)
  // }, [])

  return (
    <div
      id={`film-card-${filmObject.id}`}
      className="film-item w-[20rem] md:w-[30rem] md:min-w-[20rem] aspect-16/10 flex flex-col justify-center items-center md:items-start gap-0 bg-gray-200 text-black rounded-md">
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
          className="w-[20rem] md:w-[30rem] min-w-[20rem] aspect-16/10 object-cover transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03]"
          src={
            filmObject.backdrop_path !== null
              ? `${imgBaseUrl}${filmObject.backdrop_path}`
              : `backdropnotfound.jpg`
          }
          alt=""
          onClick={() => {
            navigate(`/films/${filmObject.id}`)
            setPage((prevPage) => ({ ...prevPage, loadMore: false }))
          }}
        />

        {/* Laptop Interaction Console */}
        {hoverId === filmObject.id && (
          <div className="hidden border-red-500 absolute bottom-0 left-0 w-[20rem] md:w-[30rem] min-w-[20rem] aspect-16/10 object-cover bg-black/70 flex items-center justify-center">
            <InteractionConsole
              tmdbId={hoverId}
              directors={directors}
              movieDetails={movieDetails}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              css={{
                textColor: "white",
                hoverBg: "oklch(92% 0.004 286.32 / 0.3)",
                hoverTextColor: "oklch(88.2% 0.059 254.128)",
                fontSize: "1rem",
                likeSize: "1.4rem",
                saveSize: "1.8rem",
                starSize: "1.6rem",
                flexGap: "1rem",
                likeColor: "oklch(44.4% 0.177 26.899)",
                saveColor: "oklch(44.8% 0.119 151.328)",
              }}
              showOverview={true}
            />
            <div
              className="border-red-500 absolute w-full h-full z-10"
              onClick={() => {
                navigate(`/films/${filmObject.id}`)
                setPage((prevPage) => ({ ...prevPage, loadMore: false }))
              }}></div>
          </div>
        )}
      </div>

      {/* Text below poster */}
      <div className=" w-full md:p-4 md:pb-4 p-2 pb-0 flex justify-between">
        {/* Left side - Title, year*/}
        <div className="border-amber-400 flex flex-row items-center md:flex-col md:items-start justify-center gap-0 ml-1">
          {/* Film Title - LAPTOP*/}
          <div className="hidden md:block">
            <span
              onClick={() => {
                navigate(`/films/${filmObject.id}`)
                setPage((prevPage) => ({ ...prevPage, loadMore: false }))
              }}
              className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 md:text-lg text-sm">
              {`${filmObject.title.slice(0, 25)}`}
            </span>
            {filmObject.title.length >= 25 && (
              <span className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-lg">
                ...
              </span>
            )}
          </div>

          {/* Film Title - MOBILE*/}
          <div className="md:hidden flex items-center justify-start">
            <span
              onClick={() => {
                navigate(`/films/${filmObject.id}`)
                setPage((prevPage) => ({ ...prevPage, loadMore: false }))
              }}
              className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 md:text-lg text-sm">
              {`${filmObject.title.slice(0, 17)}`}
            </span>
            {filmObject.title.length >= 17 && (
              <span className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-sm">
                ...
              </span>
            )}
            {filmObject.release_date && (
              <span className="ml-1 text-sm font-thin">
                {`${getReleaseYear(filmObject.release_date)}`}
              </span>
            )}
          </div>

          {/* Release year */}
          <div className="hidden md:flex items-center justify-center uppercase text-sm gap-1">
            {filmObject.release_date && (
              <span className="">
                {`${getReleaseYear(filmObject.release_date)}`}
              </span>
            )}
          </div>
        </div>

        {/* Right side - TMDB rating and vote count */}
        <div className="flex items-center gap-2 md:gap-5 justify-center mr-1">
          <div className="flex items-center justify-center gap-1">
            <MdStars className="md:text-xl text-sm" />
            <div className="md:text-base text-xs">
              {Number(filmObject.vote_average).toFixed(1)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <MdPeople className="md:text-2xl text-base" />
            <div className="md:text-base text-xs">{filmObject.vote_count}</div>
          </div>
        </div>
      </div>

      <div className="md:hidden mt-[-5px] pb-4 w-full">
        <div className="p-0 pr-3 pl-3 mb-3 w-full">
          <span className="text-[10px] italic">
            {filmObject.overview?.slice(0, 55)}
          </span>
          {filmObject.overview?.length >= 55 && <span>{`...`}</span>}
        </div>
        <InteractionConsole
          tmdbId={filmObject.id}
          directors={directors}
          movieDetails={movieDetails}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          css={{
            height: "1.4rem",
            textColor: "black",
            hoverBg: "none",
            hoverTextColor: "none",
            fontSize: "10px",
            likeSize: "1.0rem",
            saveSize: "1.4rem",
            starSize: "1.2rem",
            flexGap: "0rem",
            likeColor: "white",
            saveColor: "white",
            likedBgColor: "oklch(44.4% 0.177 26.899)",
            savedBgColor: "oklch(44.8% 0.119 151.328)",
            buttonPadding: "4px",
            paddingTopBottom: "0px",
            paddingLeftRight: "10px",
            buttonHeight: "2rem",
          }}
          showOverview={false}
        />
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
