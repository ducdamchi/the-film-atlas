import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getCountryName,
  getReleaseYear,
  getNameParts,
} from "../../../Utils/helperFunctions"
import { fetchFilmFromTMDB } from "../../../Utils/apiCalls"

import InteractionConsole from "../Buttons/InteractionConsole"
import LaptopInteractionConsole from "../Buttons/LaptopInteractionConsole"

export default function FilmUser_Card({ filmObject, queryString }) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const navigate = useNavigate()
  const [hoverId, setHoverId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [movieDetails, setMovieDetails] = useState({})
  const [directors, setDirectors] = useState([])
  const [overlayColor, setOverlayColor] = useState(`rgba(0,0,0)`)

  useEffect(() => {
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

  useEffect(() => {
    const filmCard = document.getElementById(`film-card-${filmObject.id}`)
    const console = document.getElementById(`console-${filmObject.id}`)
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

        // console.style.backgroundColor = `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.6)`
        /* If bg dark enough, font can be white */
        if (brightness > 194) {
          // filmCard.style.backgroundColor = `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.4)`
          setOverlayColor(
            `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.4)`
          )
          // console.style.backgroundColor = `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.3)`
          /* If bg a little light, reduce each rgb value by 33% */
        } else if (130 < brightness <= 194) {
          // filmCard.style.backgroundColor = `rgba(${domColor[0] * 1.2}, ${domColor[1] * 1.2}, ${domColor[2] * 1.2}, 0.4)`
          setOverlayColor(
            `rgba(${domColor[0] * 1.2}, ${domColor[1] * 1.2}, ${domColor[2] * 1.2}, 0.4)`
          )
          // console.style.backgroundColor = `rgba(${domColor[0] * 1.2}, ${domColor[1] * 1.2}, ${domColor[2] * 1.2}, 0.3)`
          /* If bg too light, reduce each rgb value by 66% */
        } else {
          // filmCard.style.backgroundColor = `rgba(${domColor[0] * 1.8}, ${domColor[1] * 1.8}, ${domColor[2] * 1.8}, 0.4)`
          setOverlayColor(
            `rgba(${domColor[0] * 1.8}, ${domColor[1] * 1.8}, ${domColor[2] * 1.8}, 0.4)`
          )
          // console.style.backgroundColor = `rgba(${domColor[0] * 1.8}, ${domColor[1] * 1.8}, ${domColor[2] * 1.8}, 0.3)`
        }
      } catch (err) {
        console.log(err)
      }
    }
  }, [])

  return (
    <div
      id={`film-card-${filmObject.id}`}
      className="film-item w-[20rem] aspect-16/10 flex flex-col justify-center items-center gap-0 bg-gray-200 text-black rounded-none pt-0 relative">
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
          className="w-[20rem]  min-w-[20rem] aspect-16/10 object-cover transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03]"
          src={
            filmObject.backdrop_path !== null
              ? `${imgBaseUrl}${filmObject.backdrop_path}`
              : `backdropnotfound.jpg`
          }
          alt=""
          onClick={() => {
            navigate(`/films/${filmObject.id}`)
          }}
        />

        <div className="">
          <LaptopInteractionConsole
            hoverId={hoverId}
            filmObject={filmObject}
            directors={directors}
            movieDetails={movieDetails}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            hasOverview={false}
          />
        </div>
      </div>

      {/* Text below poster */}
      <div className="md:absolute md:bottom-0 md:left-0 md:p-3 md:bg-gradient-to-t md:from-black/80 md:to-transparent md:text-stone-100 w-full pt-1 pb-1 flex justify-between p-2">
        {/* Left side - Title, year, directors name*/}
        <div className="border-amber-400 flex flex-col items-start justify-center gap-0 ml-1">
          {/* Film Title */}
          <div className="max-w-[18rem] text-wrap">
            <span
              onClick={() => {
                navigate(`/films/${filmObject.id}`)
              }}
              className="text-sm font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800">
              {`${filmObject.title.slice(0, 25)}`}
            </span>
            {filmObject.title.length >= 25 && (
              <span className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-sm">
                ...
              </span>
            )}
          </div>
          {/* Release year & Director's name */}
          <div className="flex items-center uppercase text-[10px] font-light gap-1">
            {filmObject.release_date && (
              <span className="">
                {`${getReleaseYear(filmObject.release_date)}`}
              </span>
            )}
            {queryString && filmObject.origin_country && (
              <span className="">
                <span className="flex gap-1">
                  <span>|</span>
                  {filmObject.origin_country.map((country, key) => {
                    return key < 2 ? (
                      <span key={key}>
                        <span>{`${getCountryName(country)}`}</span>
                        {/* Add a comma if it's not the last country on the list */}
                        {key < 1 && filmObject.origin_country.length > 1 && (
                          <span>,</span>
                        )}
                        {key === 1 && <span> ...</span>}
                      </span>
                    ) : (
                      <span key={key} className="hidden"></span>
                    )
                  })}
                </span>
              </span>
            )}
          </div>
        </div>
        {/* Right side - director's photo*/}
        <div className="flex flex-col items-center justify-center gap-1 max-w-[20rem] mr-1">
          {queryString && filmObject.directors && (
            <div className="border-amber-400 flex items-start gap-1 justify-center">
              {filmObject.directors.map((dir, key) => {
                return key < 2 ? (
                  <div
                    key={key}
                    className="flex flex-col items-center justify-center gap-1">
                    <div className="relative max-w-[8rem] h-[2rem] aspect-1/1 overflow-hidden rounded-full">
                      <img
                        className="object-cover grayscale transform -translate-y-1 hover:scale-[1.05] transition-all duration-300 ease-out"
                        src={
                          dir.profile_path !== null
                            ? `${imgBaseUrl}${dir.profile_path}`
                            : "profilepicnotfound.jpg"
                        }
                        onClick={() => navigate(`/directors/${dir.tmdbId}`)}
                      />
                    </div>
                    <div className="text-[9px] text-center">
                      {`${getNameParts(dir.name)?.firstNameInitial}. ${getNameParts(dir.name)?.lastName}`}
                    </div>
                  </div>
                ) : (
                  <span key={key} className="hidden"></span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE <768px, interaction console at bottom */}
      <div
        className="md:hidden w-full pb-5 pt-3"
        id={`console-${filmObject.id}`}>
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
