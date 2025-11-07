/* Libraries */
import React, { useEffect, useState, useContext, useRef } from "react"
import { useLocation, useParams, useNavigate, Link } from "react-router-dom"

/* Custom functions */
import {
  getCountryName,
  getReleaseYear,
  fetchFilmFromTMDB,
} from "../Utils/helperFunctions"
import useCommandK from "../Utils/useCommandK"
import { AuthContext } from "../Utils/authContext"

/* Components */
import NavBar from "./Shared/NavBar"
import LoadingPage from "./Shared/LoadingPage"
import QuickSearchModal from "./Shared/QuickSearchModal"
import InteractionConsole from "./Shared/InteractionConsole"

export default function FilmLanding() {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const [isLoading, setIsLoading] = useState(false)
  const [movieDetails, setMovieDetails] = useState({})
  const [directors, setDirectors] = useState([]) //director
  const [dops, setDops] = useState([]) //director of photography
  const [mainCast, setMainCast] = useState([]) //top 5 cast
  const [trailerLink, setTrailerLink] = useState(null)
  // const [searchModalOpen, setSearchModalOpen] = useState(false)
  // const [returnToViewMode, setReturnToViewMode] = useState("")

  const { authState, searchModalOpen, setSearchModalOpen } =
    useContext(AuthContext)
  const { tmdbId } = useParams()
  // const location = useLocation()
  const navigate = useNavigate()

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

  /* Fetch film info for Landing Page */
  useEffect(() => {
    const fetchPageData = async () => {
      if (tmdbId) {
        setSearchModalOpen(false)
        setIsLoading(true)
        try {
          fetchFilmFromTMDB(
            tmdbId,
            setMovieDetails,
            setDirectors
            // setDops,
            // setMainCast
          )
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
      const dopsList = movieDetails.credits.crew.filter(
        (crewMember) => crewMember.job === "Director of Photography"
      )

      // Pick top 5 cast
      const mainCastList = movieDetails.credits.cast.slice(0, 5)

      // Filter for YouTube trailers only
      const trailerLinks = movieDetails.videos.results.filter((video) => {
        return video.site === "YouTube" && video.type === "Trailer"
      })
      // Sort trailers by newest to oldest
      const sortedTrailerLinks = trailerLinks.sort((a, b) => {
        const dateA = new Date(a.published_at)
        const dateB = new Date(b.published_at)
        return dateB - dateA
      })

      console.log(sortedTrailerLinks)
      setDops(dopsList)
      setMainCast(mainCastList)
      if (sortedTrailerLinks.length >= 1) {
        setTrailerLink(sortedTrailerLinks[0].key) // pick newest trailer
      } else {
        setTrailerLink(null)
      }
    }
  }, [movieDetails])

  // useEffect(() => {
  //   if (location.state) {
  //     const { currentViewMode } = location.state || {}
  //     console.log("Location.state:", location.state)
  //     console.log("Current View Mode:", currentViewMode)
  //     setReturnToViewMode(currentViewMode)
  //   }
  // }, [location.state])

  if (!movieDetails) {
    return <div>Error loading film. Please try again.</div>
  }

  return (
    <>
      {/* {isLoading && <LoadingPage />} */}

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
        />
      )}

      {/* Landing Page content */}
      <div className="w-screen h-auto flex flex-col justify-center">
        <div className="border-2 border-red-500 w-[100%] h-[90%] top-[5%] bg-zinc-50 text-black">
          <NavBar />
          {/* <button
            onClick={() => {
              navigate("/", {
                state: {
                  returnToViewMode: returnToViewMode,
                },
              })
            }}>
            BACK TO FILMS
          </button> */}
          <div className="overflow-hidden">
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

          <img
            className="w-[20rem] min-w-[20rem] aspect-2/3 object-cover transition-all duration-300 ease-out border-2 border-blue-500"
            src={
              movieDetails.poster_path !== null
                ? `${imgBaseUrl}${movieDetails.poster_path}`
                : `posternotfound.png`
            }
            alt=""
          />

          <InteractionConsole
            tmdbId={tmdbId}
            directors={directors}
            movieDetails={movieDetails}
            setIsLoading={setIsLoading}
            css={{
              textColor: "black",
              hoverBg: "bg-zinc-200/30",
              hoverTextColor: "text-blue-800",
              fontSize: "xl",
              likeSize: "3xl",
              saveSize: "5xl",
              starSize: "4xl",
              flexGap: "5",
              likeColor: "red-800",
              saveColor: "green-800",
            }}
          />

          {movieDetails.overview && (
            <div className="border-1">
              <span className="font-bold uppercase">Overview:&nbsp;</span>
              <span>{movieDetails.overview}</span>
            </div>
          )}

          {movieDetails.runtime && (
            <div className="border-1">
              <span className="font-bold uppercase">Runtime:&nbsp;</span>
              <span>{`${movieDetails.runtime} minutes`}</span>
            </div>
          )}

          {movieDetails.release_date && (
            <div className="border-1">
              <span className="font-bold uppercase">Year:&nbsp;</span>
              <span>{`${getReleaseYear(movieDetails.release_date)}`}</span>
            </div>
          )}

          {movieDetails.origin_country && (
            <div className="border-1">
              <span className="font-bold uppercase">Origin:&nbsp;</span>
              {movieDetails.origin_country.map((country, key) => {
                return (
                  <span key={key}>
                    <span>{`${getCountryName(country)}`}</span>
                    {/* Add a comma if it's not the last country on the list */}
                    {key !== movieDetails.origin_country.length - 1 && (
                      <span>,&nbsp;</span>
                    )}
                  </span>
                )
              })}
            </div>
          )}

          {directors.length > 0 && (
            <div className="border-1">
              <span className="font-bold uppercase">Director:&nbsp;</span>
              {directors.map((director, key) => {
                return (
                  <span key={key}>
                    <span
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

          {dops.length > 0 && (
            <div className="border-1">
              <span className="font-bold uppercase">D.O.P.:&nbsp;</span>
              {dops.map((dop, key) => {
                return (
                  <span key={key}>
                    <span>{`${dop.name}`}</span>
                    {/* Add a comma if it's not the last country on the list */}
                    {key !== dops.length - 1 && <span>,&nbsp;</span>}
                  </span>
                )
              })}
            </div>
          )}

          {mainCast.length > 0 && (
            <div className="border-1">
              <span className="font-bold uppercase">Main cast:&nbsp;</span>
              {mainCast.map((actor, key) => {
                return (
                  <span key={key}>
                    <span>{`${actor.name}`}</span>
                    {/* Add a comma if it's not the last country on the list */}
                    {key !== mainCast.length - 1 && <span>,&nbsp;</span>}
                  </span>
                )
              })}
            </div>
          )}

          {trailerLink !== null && (
            <div className="w-[100%] h-[30rem]">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerLink}`}
                title="YouTube video player"
                allowFullScreen></iframe>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
