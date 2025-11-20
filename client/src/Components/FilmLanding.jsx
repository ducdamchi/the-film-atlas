/* Libraries */
import React, { useEffect, useState, useContext, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"

/* Custom functions */
import {
  getCountryName,
  getReleaseYear,
  getLuminance,
  getContrastRatio,
  ensureContrast,
} from "../Utils/helperFunctions"
import { fetchFilmFromTMDB } from "../Utils/apiCalls"
import useCommandK from "../Hooks/useCommandK"
import { AuthContext } from "../Utils/authContext"

/* Components */
import NavBar from "./Shared/Navigation-Search/NavBar"
import LoadingPage from "./Shared/Navigation-Search/LoadingPage"
import QuickSearchModal from "./Shared/Navigation-Search/QuickSearchModal"
import InteractionConsole from "./Shared/Buttons/InteractionConsole"
import PersonList from "./Shared/LandingPage/PersonList"

import { MdSunny, MdOutlineTimelapse } from "react-icons/md"
import { IoMdCalendar, IoIosTimer } from "react-icons/io"

export default function FilmLanding() {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const [isLoading, setIsLoading] = useState(false)
  const [movieDetails, setMovieDetails] = useState({})
  const [directors, setDirectors] = useState([]) //director
  const [dops, setDops] = useState([]) //director of photography
  const [mainCast, setMainCast] = useState([]) //top 5 cast
  const [backdropList, setBackdropList] = useState([])
  const [posterList, setPosterList] = useState([])
  const [trailerLink, setTrailerLink] = useState(null)
  const [overlayColor, setOverlayColor] = useState([0, 0, 0])
  const [overlayTextColor, setOverlayTextColor] = useState([255, 255, 255])

  const { authState, searchModalOpen, setSearchModalOpen } =
    useContext(AuthContext)
  const { tmdbId } = useParams()
  const navigate = useNavigate()
  // const overviewRef = useRef(null)
  const posterRef = useRef(null)
  // const castRef = useRef(null)

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
    return () => {
      clearTimeout(timer)
    }
  }, [isLoading])

  /* Fetch film info for Landing Page */
  useEffect(() => {
    const fetchPageData = async () => {
      if (tmdbId) {
        try {
          setSearchModalOpen(false) // close search modal if it's somehow open
          setIsLoading(true)
          const result = await fetchFilmFromTMDB(tmdbId)
          setMovieDetails(result)
        } catch (err) {
          console.error("Error loading film data: ", err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchPageData()
  }, [tmdbId])

  useEffect(() => {
    // console.log("movieDetails: ", movieDetails)
    if (movieDetails.credits) {
      const directorsList = movieDetails.credits.crew.filter(
        (crewMember) => crewMember.job === "Director"
      )
      const dopsList = movieDetails.credits.crew.filter(
        (crewMember) => crewMember.job === "Director of Photography"
      )

      const backdropList = movieDetails.images.backdrops.slice(
        0,
        Math.min(movieDetails.images.backdrops.length, 5)
      )

      const posterList = movieDetails.images.posters.slice(
        0,
        Math.min(movieDetails.images.posters.length, 5)
      )

      // Pick top 5 cast
      const mainCastList = movieDetails.credits.cast.slice(
        0,
        Math.min(5, movieDetails.credits.cast.length)
      )

      // Filter for YouTube trailers only
      const trailerLinks = movieDetails.videos.results.filter((video) => {
        return (
          // (video.site === "YouTube" || video.site === "Vimeo") &&
          video.type === "Trailer"
        )
      })
      // Sort trailers by newest to oldest
      const sortedTrailerLinks = trailerLinks.sort((a, b) => {
        const dateA = new Date(a.published_at)
        const dateB = new Date(b.published_at)
        return dateB - dateA
      })
      console.log("Trailers:", sortedTrailerLinks)

      setDirectors(directorsList)
      setDops(dopsList)
      setMainCast(mainCastList)
      setBackdropList(backdropList)
      setPosterList(posterList)
      if (sortedTrailerLinks.length >= 1) {
        setTrailerLink(sortedTrailerLinks[0].key) // pick newest trailer
      } else {
        setTrailerLink(null)
      }
    }

    /* Once movie detail loads, set the overlay color based on poster dominant color */
    try {
      const poster = new Image()
      poster.crossOrigin = "anonymous"
      const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`)}`
      poster.src = proxyUrl2

      poster.onload = () => {
        const colorThief2 = new ColorThief()
        let domColor2 = colorThief2.getColor(poster)
        const bgColor = domColor2
        let textColor = [
          255 - domColor2[0],
          255 - domColor2[1],
          255 - domColor2[2],
        ]
        textColor = ensureContrast(bgColor, textColor)

        setOverlayTextColor(textColor)
        setOverlayColor(bgColor)
      }
    } catch (err) {
      console.log(err)
    }
  }, [movieDetails])

  if (!movieDetails) {
    return <div>Error loading film. Please try again.</div>
  }

  return (
    <div className="font-primary">
      {isLoading && <LoadingPage />}

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
        />
      )}

      {/* Landing Page content */}
      <div className="w-screen h-auto flex flex-col justify-center ">
        <div className="border-red-500 w-[100%] h-[90%] top-[5%] text-stone-200 text-[14px]">
          <NavBar />

          <div className="hidden overflow-hidden">
            <img
              className="w-screen aspect-16/9 object-cover scale-[1.02]"
              src={
                movieDetails.backdrop_path !== null
                  ? `${imgBaseUrl}${movieDetails.backdrop_path}`
                  : `backdropnotfound.jpg`
              }
              alt=""
            />
          </div>

          <div className="landing-main-img-container">
            <img
              className="landing-main-img"
              src={
                movieDetails.backdrop_path !== null
                  ? `${imgBaseUrl}${movieDetails.backdrop_path}`
                  : `posternotfound.png`
              }
              alt=""
            />
            <div className="landing-transparent-layer"></div>
            <div className="">
              <div className="landing-img-text-container">
                {/* Title */}
                {movieDetails.title && (
                  <div className="landing-page-title font-heading">
                    {movieDetails.title}
                  </div>
                )}

                {/* Release Date */}
                <div className="landing-img-text-belowTitle gap-2">
                  {movieDetails.release_date && (
                    <div className="flex gap-1 items-center">
                      <IoMdCalendar />
                      <span className="">{`${getReleaseYear(movieDetails.release_date)}`}</span>
                    </div>
                  )}
                  {movieDetails.runtime && (
                    <div className="flex gap-1 items-center">
                      <IoIosTimer />
                      <span className="">{`${movieDetails.runtime} minutes`}</span>
                    </div>
                  )}
                </div>

                {/* Director name(s) */}
                {directors.length > 0 && (
                  <div className="landing-img-text-right">
                    {/* <span className="font-black text-base">|&nbsp;</span> */}
                    <span className="landing-img-text-right-title">
                      directed by
                    </span>
                    {directors.map((director, key) => {
                      return (
                        <span key={key}>
                          <span
                            className="landing-img-text-right-content"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              navigate(`/directors/${director.id}`)
                            }}>{`${director.name}`}</span>
                          {/* Add a comma if it's not the last country on the list */}
                          {/* {key !== directors.length - 1 && <span>,&nbsp;</span>} */}
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Origin Country */}
                {movieDetails.origin_country &&
                  movieDetails.origin_country.length > 0 && (
                    <div className="landing-img-text-right">
                      <span className="landing-img-text-right-title">
                        origin
                      </span>

                      {movieDetails.origin_country.map((country, key) => {
                        return (
                          <span key={key} className="whitespace-nowrap">
                            <span className="landing-img-text-right-content">{`${getCountryName(country)}`}</span>
                            {/* Add a comma if it's not the last country on the list */}
                            {/* {key !== movieDetails.origin_country.length - 1 && (
                              <span className="inline-block">,&nbsp;</span>
                            )} */}
                          </span>
                        )
                      })}
                    </div>
                  )}
              </div>
            </div>
            <div className="landing-transparent-layer-bottom"></div>
            <div className="absolute bottom-0 w-full flex items-center justify-center mb-1">
              <InteractionConsole
                tmdbId={tmdbId}
                directors={directors}
                movieDetails={movieDetails}
                setIsLoading={setIsLoading}
                css={{
                  textColor: "oklch(92.3% 0.003 48.717)",
                  hoverBg: "oklch(92% 0.004 286.32 / 0.3)",
                  hoverTextColor: "oklch(42.4% 0.199 265.638)",
                  fontSize: "11px",
                  likeSize: "1rem",
                  saveSize: "1.5rem",
                  starSize: "1.3rem",
                  flexGap: "10px",
                  likeColor: "white",
                  saveColor: "white",
                  likedBgColor: "oklch(44.4% 0.177 26.899)",
                  savedBgColor: "oklch(44.8% 0.119 151.328)",
                  buttonPadding: "0px",
                  paddingTopBottom: "0px",
                  paddingLeftRight: "12px",
                  buttonHeight: "2.3rem",
                }}
                showOverview={false}
              />
            </div>
          </div>

          <div
            // id="landing-bg-1"
            // ref={overviewRef}
            className="flex flex-col items-start p-4 text-stone-900 gap-2 relative bg-stone-100">
            <div className="flex">
              <div className="flex flex-col items-start justify-start">
                {movieDetails.overview && (
                  <div className="p-4 pt-2">
                    {/* <span className="font-bold uppercase">Overview:&nbsp;</span> */}
                    <div className="uppercase font-extralight text-[11px] mb-1">
                      overview
                    </div>
                    <div className="text-[17px]/6 font-extrabold text-balance">
                      {movieDetails.overview}
                    </div>
                  </div>
                )}
                <div className="p-4 pt-1">
                  <img
                    ref={posterRef}
                    className=" w-[12rem] aspect-2/3 object-cover scale-[1] mb-5 border-0 rounded-md z-30 inset-shadow-white inset-shadow-sm drop-shadow-2xl"
                    src={
                      movieDetails.poster_path !== null
                        ? `${imgBaseUrl}${movieDetails.poster_path}`
                        : `posternotfound.png`
                    }
                    alt=""
                  />
                </div>
              </div>
              <div className="flex flex-col items-end justify-start gap-0">
                {mainCast.length > 0 && (
                  <PersonList
                    title="main cast"
                    listOfPeople={mainCast}
                    overlayColor={overlayColor}
                    overlayTextColor={overlayTextColor}
                  />
                )}
                {dops.length > 0 && (
                  <PersonList
                    title="d.o.p."
                    listOfPeople={dops}
                    overlayColor={overlayColor}
                    overlayTextColor={overlayTextColor}
                  />
                )}
              </div>
            </div>
            {trailerLink !== null && (
              <div className="w-full aspect-16/9 md:h-[30rem] border-0 p-4 mb-10">
                <div className="uppercase font-extralight text-[11px] text-stone-900 bg-stone-100 p-0 pb-2">
                  trailer
                </div>
                <iframe
                  className="rounded-md"
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailerLink}`}
                  title="YouTube video player"
                  allowFullScreen></iframe>
              </div>
            )}
          </div>

          {/* <div
            // id="landing-bg-2"
            // ref={posterRef}
            className="h-[40rem] w-screen relative z-20"></div> */}
        </div>
      </div>
    </div>
  )
}
