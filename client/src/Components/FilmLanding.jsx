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
import { fetchFilmFromTMDB, fetchFilmFromYTS } from "../Utils/apiCalls"
import useCommandKey from "../Hooks/useCommandKey"
import { AuthContext } from "../Utils/authContext"

/* Components */
import NavBar from "./Shared/Navigation-Search/NavBar"
import LoadingPage from "./Shared/Navigation-Search/LoadingPage"
import QuickSearchModal from "./Shared/Navigation-Search/QuickSearchModal"
import InteractionConsole from "./Shared/Buttons/InteractionConsole"
import PersonList from "./Shared/LandingPage/PersonList"
import TrailerModal from "./Shared/LandingPage/TrailerModal"

import { IoMdCalendar, IoIosTimer } from "react-icons/io"
import { BiPlay } from "react-icons/bi"

export default function FilmLanding() {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const [isLoading, setIsLoading] = useState(false)
  const [movieDetails, setMovieDetails] = useState({})
  const [directors, setDirectors] = useState([]) //director
  const [dops, setDops] = useState([]) //director of photography
  const [crew, setCrew] = useState([]) //director of photography
  const [mainCast, setMainCast] = useState([]) //top 5 cast
  const [backdropList, setBackdropList] = useState([])
  const [posterList, setPosterList] = useState([])
  const [trailerLink, setTrailerLink] = useState(null)
  const [overlayColor, setOverlayColor] = useState([0, 0, 0])
  const [overlayTextColor, setOverlayTextColor] = useState([255, 255, 255])
  const [backdropColor, setBackdropColor] = useState([0, 0, 0])
  const [openTrailer, setOpenTrailer] = useState(false)
  const [torrentVisible, setTorrentVisible] = useState(false)
  const [ytsTorrents, setYtsTorrents] = useState([])

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
  useCommandKey(toggleSearchModal, "k")

  function toggleTorrentView() {
    setTorrentVisible((status) => !status)
  }
  useCommandKey(toggleTorrentView, "j")

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
    console.log("movieDetails: ", movieDetails)

    if (movieDetails.credits) {
      const directorsList = movieDetails.credits.crew.filter(
        (crewMember) => crewMember.job === "Director"
      )

      const crew = movieDetails.credits.crew
      const listOfUniqueCrewMembers = []
      crew.forEach((person) => {
        const crewMember = listOfUniqueCrewMembers.find(
          (member) => member.id === person.id
        )
        if (crewMember !== undefined) {
          crewMember.jobs.push(person.job)
        } else {
          if (person.profile_path !== null) {
            listOfUniqueCrewMembers.push({
              id: person.id,
              name: person.name,
              profile_path: person.profile_path,
              jobs: [person.job],
            })
          }
        }
      })
      // console.log(listOfUniqueCrewMembers)

      // const dopsList = movieDetails.credits.crew.filter(
      //   (crewMember) => crewMember.job === "Director of Photography"
      // )
      // const backdropList = movieDetails.images.backdrops.slice(
      //   0,
      //   Math.min(movieDetails.images.backdrops.length, 5)
      // )
      // const posterList = movieDetails.images.posters.slice(
      //   0,
      //   Math.min(movieDetails.images.posters.length, 5)
      // )

      // Filter out cast who does not have profile pic, then pic top 15
      const castListFiltered = movieDetails.credits.cast.filter(
        (cast) => cast.profile_path !== null
      )
      const mainCastList = castListFiltered.slice(
        0,
        Math.min(15, castListFiltered.length)
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

      // setDops(dopsList)
      // setBackdropList(backdropList)
      // setPosterList(posterList)
      setDirectors(directorsList)
      setCrew(listOfUniqueCrewMembers)
      setMainCast(mainCastList)
      if (sortedTrailerLinks.length >= 1) {
        setTrailerLink(sortedTrailerLinks[0].key) // pick newest trailer
      } else {
        setTrailerLink(null)
      }
    }

    /* Once movie detail loads, set the overlay color based on poster dominant color */
    try {
      const backdrop = new Image()
      const poster = new Image()
      backdrop.crossOrigin = "anonymous"
      poster.crossOrigin = "anonymous"
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`)}`
      const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`)}`
      backdrop.src = proxyUrl
      poster.src = proxyUrl2

      backdrop.onload = () => {
        const colorThief = new ColorThief()
        let domColor = colorThief.getColor(backdrop)
        setBackdropColor(domColor)
      }

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

  useEffect(() => {
    console.log("in uef hook")
    const fetchYtsData = async () => {
      if (torrentVisible && movieDetails.imdb_id) {
        try {
          setIsLoading(true)
          const result = await fetchFilmFromYTS(movieDetails.imdb_id)
          console.log("YTS response:", result.data.movie.torrents)
          setYtsTorrents(result.data.movie.torrents)
        } catch (err) {
          console.error("Error loading YTS data: ", err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchYtsData()
  }, [torrentVisible, movieDetails])

  // useEffect(() => {
  //   console.log("Trailer Link:", trailerLink)
  // }, [trailerLink])

  if (!movieDetails) {
    return <div>Error loading film. Please try again.</div>
  }

  return (
    <div className="font-primary mt-[4.5rem]">
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
        <div className="border-red-500 w-[100%] h-[90%] top-[5%] text-stone-200">
          <NavBar />

          {/* Backdrop section */}
          <div className="landing-main-img-container">
            {/* Main backdrop */}
            <img
              className="landing-main-img"
              src={
                movieDetails.backdrop_path !== null
                  ? `${imgBaseUrl}${movieDetails.backdrop_path}`
                  : `posternotfound.png`
              }
              alt=""
            />

            {/* Transparent layer top */}
            <div className="landing-transparent-layer"></div>

            {/* All the text displayed over main backdrop */}
            <div className="">
              <div className="landing-img-text-container z-30">
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
                  <div className="landing-img-text-right z-100">
                    {/* <span className="font-black text-base">|&nbsp;</span> */}
                    <span className="landing-img-text-right-title">
                      directed by
                    </span>
                    {directors.map((director, key) => {
                      return (
                        <span key={key}>
                          <span
                            className="landing-img-text-right-content hover:text-blue-400 transition-all ease-out duration-200"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              navigate(`/directors/${director.id}`)
                            }}>{`${director.name}`}</span>
                          {/* Add a comma if it's not the last country on the list */}
                          {key !== directors.length - 1 && <span>,&nbsp;</span>}
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
                            {key !== movieDetails.origin_country.length - 1 && (
                              <span className="inline-block">,&nbsp;</span>
                            )}
                          </span>
                        )
                      })}
                    </div>
                  )}
              </div>
              {/* trailer play button */}
              {trailerLink !== null && (
                <div className="absolute w-full h-full border-0 border-red-500 top-0 left-0 flex items-center justify-center">
                  <button
                    onClick={() => {
                      setOpenTrailer(true)
                    }}
                    className="flex items-center z-40 rounded-full p-3 pt-2 pb-2 drop-shadow-lg bg-white text-[var(--backdropColor)] hover:text-white hover:bg-[var(--backdropColor)] transition-all duration-300 ease-out"
                    style={{
                      "--backdropColor": `rgb(${backdropColor[0]}, ${backdropColor[1]}, ${backdropColor[2]})`,
                    }}>
                    <BiPlay className="text-3xl" />
                    <span className="text-base">Trailer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Transparent layer bottom */}
            <div className="landing-transparent-layer-bottom"></div>

            {/* Interaction console */}
            <div className="xl:hidden absolute bottom-0 w-full flex items-center justify-center mb-4">
              <InteractionConsole
                tmdbId={tmdbId}
                directors={directors}
                movieDetails={movieDetails}
                setIsLoading={setIsLoading}
                css={{
                  textColor: "oklch(92.3% 0.003 48.717)",
                  hoverBg: "none",
                  hoverTextColor: "oklch(70.7% 0.165 254.624)",
                  fontSize: "14px",
                  likeSize: "1.1rem",
                  saveSize: "1.6rem",
                  starSize: "1.4rem",
                  flexGap: "10px",
                  likeColor: "white",
                  saveColor: "white",
                  likedBgColor: "oklch(44.4% 0.177 26.899)",
                  savedBgColor: "oklch(44.8% 0.119 151.328)",
                  buttonPadding: "0px",
                  paddingTopBottom: "0px",
                  paddingLeftRight: "10px",
                  buttonHeight: "2.5rem",
                }}
                showOverview={false}
              />
            </div>
            <div className="hidden xl:block absolute bottom-0 w-full flex items-center justify-center mb-6">
              <InteractionConsole
                tmdbId={tmdbId}
                directors={directors}
                movieDetails={movieDetails}
                setIsLoading={setIsLoading}
                css={{
                  textColor: "oklch(92.3% 0.003 48.717)",
                  hoverBg: "none",
                  hoverTextColor: "oklch(70.7% 0.165 254.624)",
                  fontSize: "16px",
                  likeSize: "1.3rem",
                  saveSize: "1.8rem",
                  starSize: "1.6rem",
                  flexGap: "15px",
                  likeColor: "white",
                  saveColor: "white",
                  likedBgColor: "oklch(44.4% 0.177 26.899)",
                  savedBgColor: "oklch(44.8% 0.119 151.328)",
                  buttonPadding: "0px",
                  paddingTopBottom: "10px",
                  paddingLeftRight: "15px",
                  buttonHeight: "3rem",
                }}
                showOverview={false}
              />
            </div>
          </div>

          {/* Section below main backdrop */}
          <div className="flex flex-col items-start text-stone-900 gap-2 relative bg-stone-100 landing-belowBackdropPadding">
            <div className="flex flex-col">
              {/* Torrents will show here */}
              {torrentVisible && (
                <div className="hidden md:flex flex-col items-start justify-start">
                  <div className="p-4 pt-2">
                    <div className="landing-sectionTitle mb-1">torrents</div>
                    {ytsTorrents.length === 0 && (
                      <div className="landing-sectionContent">
                        No torrents found.
                      </div>
                    )}
                    {ytsTorrents.length > 0 && (
                      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        {ytsTorrents.map((torrent, key) => {
                          return (
                            <a key={key} href={torrent.url}>
                              <div className="border-2 flex flex-col items-center justify-center gap-1 p-2 pr-2 pl-2 rounded-none hover:border-blue-800 hover:text-blue-800 transition-all ease-out duration-200 w-auto">
                                <div className="flex items-center justify-center gap-1 border-b-1 pb-1 uppercase">
                                  <span className="">{torrent?.type}</span>
                                  <span className="">{torrent?.quality}</span>
                                  <span>{`[${torrent?.size}]`}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-base">
                                  {/* <span>{`${torrent?.video_codec}`}</span> */}
                                  <span>{`peers: ${torrent?.peers}`}</span>
                                  <span>{`seeds: ${torrent?.seeds}`}</span>
                                </div>
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Overview section */}
              <div className="flex flex-col items-start justify-start ">
                {movieDetails.overview && (
                  <div className="p-4 pt-2">
                    {/* <span className="font-bold uppercase">Overview:&nbsp;</span> */}
                    <div className="landing-sectionTitle mb-1">overview</div>
                    <div className="landing-sectionContent">
                      {movieDetails.overview}
                    </div>
                  </div>
                )}
              </div>
              {/* Cast and crew section */}
              <div className="flex flex-col items-start justify-start gap-2">
                {mainCast.length > 0 && (
                  <PersonList
                    title="main cast"
                    listOfPeople={mainCast}
                    type="cast"
                  />
                )}
                {crew.length > 0 && (
                  <PersonList
                    title="main crew"
                    listOfPeople={crew}
                    type="crew"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Trailer modal */}
          {openTrailer && (
            <TrailerModal
              trailerLink={trailerLink}
              closeModal={() => {
                setOpenTrailer(false)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// {
//   trailerLink !== null && (
//     <div className="hidden md:block h-[15rem] aspect-16/9 border-0">
//       {/* <div className="landing-sectionTitle p-0 pb-2">
//                         trailer
//                       </div> */}
//       <iframe
//         className=""
//         width="100%"
//         height="100%"
//         src={`https://www.youtube.com/embed/${trailerLink}`}
//         title="YouTube video player"
//         allowFullScreen></iframe>
//     </div>
//   )
// }

// ;<div
//   className="absolute top-0 aspect-16/9 w-screen
//            h-screen border-2 border-blue-500 mb-10 bg-stone-100 z-50">
//   <iframe
//     className=""
//     width="100%"
//     height="100%"
//     src={`https://www.youtube.com/embed/${trailerLink}?autoplay=1&mute=1&playsinline=1`}
//     title="YouTube video player"
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//     allowFullScreen></iframe>
// </div>

{
  /* <div className="p-4 pt-1 md:flex md:w-full md:gap-5">
                  <div className="">
                    <img
                      ref={posterRef}
                      className="w-[12rem] md:w-[auto] md:h-[15rem] aspect-2/3 object-cover scale-[1] mb-5 border-0 rounded-none z-30 drop-shadow-sm"
                      src={
                        movieDetails.poster_path !== null
                          ? `${imgBaseUrl}${movieDetails.poster_path}`
                          : `posternotfound.png`
                      }
                      alt=""
                    />
                  </div>
                </div> */
}
