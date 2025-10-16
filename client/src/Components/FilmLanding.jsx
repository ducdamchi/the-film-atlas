/* Libraries */
import { React, useEffect, useState, useContext, useRef } from "react"
import { useLocation, useParams, Link } from "react-router-dom"
import axios from "axios"

/* Custom functions */
import {
  getCountryName,
  getReleaseYear,
  fetchFilmFromTMDB,
  checkLikeStatus,
  checkSaveStatus,
} from "../Utils/helperFunctions"
import { AuthContext } from "../Utils/authContext"
import useCommandK from "../Utils/useCommandK"

/* Components */
import NavBar from "./Shared/NavBar"
import LoadingPage from "./Shared/LoadingPage"
import QuickSearchModal from "./Shared/QuickSearchModal"

/* Icons */
import { BiListPlus, BiListCheck, BiHeart, BiSolidHeart } from "react-icons/bi"

export default function FilmLanding() {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"

  const [movieDetails, setMovieDetails] = useState({})
  const [directors, setDirectors] = useState([]) //director
  const [dops, setDops] = useState([]) //director of photography
  const [mainCast, setMainCast] = useState([]) //top 5 cast
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [returnToPage, setReturnToPage] = useState("/")

  const { authState, loading } = useContext(AuthContext)
  const { tmdbId } = useParams()
  const location = useLocation()

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

  /* Create the request body for API call to App's DB when user 'like' a film */
  function createReqBody() {
    const req = {
      tmdbId: movieDetails.id,
      title: movieDetails.title,
      runtime: movieDetails.runtime,
      poster_path: movieDetails.poster_path,
      backdrop_path: movieDetails.backdrop_path,
      origin_country: movieDetails.origin_country,
      release_date: movieDetails.release_date,
      director: directors,
    }
    return req
  }

  /* Make API call to App's DB when user 'like' a film */
  function likeFilm() {
    const req = createReqBody()
    axios
      .post(`http://localhost:3002/profile/me/liked-films`, req, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Server: ", response.data.error)
        } else {
          setIsLiked(true)
        }
      })
      .catch((err) => {
        console.error("Client: Error liking film", err)
      })
  }

  /* Make API call to App's DB when user 'unlike' a film */
  function unlikeFilm() {
    axios
      .delete(`http://localhost:3002/profile/me/liked-films`, {
        data: {
          tmdbId: movieDetails.id,
        },
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Server: ", response.data.error)
          console.log(authState)
        } else {
          setIsLiked(false)
        }
      })
      .catch((err) => {
        console.error("Client: Error unliking film", err)
      })
  }

  /* Make API call to App's DB when user 'like' a film */
  function saveFilm() {
    const req = createReqBody()
    axios
      .post(`http://localhost:3002/profile/me/watchlist`, req, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Server: ", response.data.error)
        } else {
          setIsSaved(true)
        }
      })
      .catch((err) => {
        console.error("Client: Error liking film", err)
      })
  }

  /* Handle user Like/Unlike interaction */
  function handleLike() {
    /* If user is logged in, they can like/unlike. */
    if (authState.status) {
      /* If film has not been liked */
      if (!isLiked) {
        likeFilm()
        /* If film has already been liked */
      } else {
        unlikeFilm()
      }
      /* If user not logged in, alert */
    } else {
      alert("Sign In to Like Movies!")
    }
  }

  /* Make API call to App's DB when user 'unlike' a film */
  function unsaveFilm() {
    axios
      .delete(`http://localhost:3002/profile/me/watchlist`, {
        data: {
          tmdbId: movieDetails.id,
        },
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Server: ", response.data.error)
          console.log(authState)
        } else {
          setIsSaved(false)
        }
      })
      .catch((err) => {
        console.error("Client: Error unliking film", err)
      })
  }

  function handleSave() {
    /* If user is logged in, they can like/unlike. */
    if (authState.status) {
      /* If film has not been liked */
      if (!isSaved) {
        saveFilm()
        /* If film has already been liked */
      } else {
        unsaveFilm()
      }
      /* If user not logged in, alert */
    } else {
      alert("Sign In to Like Movies!")
    }
  }

  /* Fetch film info for Landing Page */
  useEffect(() => {
    if (tmdbId) {
      setSearchModalOpen(false)
      fetchFilmFromTMDB(
        tmdbId,
        setMovieDetails,
        setDirectors,
        setDops,
        setMainCast
      )
      checkLikeStatus(tmdbId, setIsLiked)
      checkSaveStatus(tmdbId, setIsSaved)
    }
  }, [tmdbId])

  useEffect(() => {
    if (location.state) {
      const { fromPage } = location.state || {}
      console.log("Location.state:", location.state)
      console.log("From Page:", fromPage)
      if (fromPage === "liked-films") {
        setReturnToPage("/")
      } else {
        setReturnToPage("/watchlist")
      }
    }
  }, [location.state])

  if (!movieDetails) {
    return <div>Error loading film. Please try again.</div>
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <>
      {/* Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
          returnToPage={returnToPage}
        />
      )}

      {/* Landing Page content */}
      <div className="w-screen h-auto flex flex-col justify-center">
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
        <div className="border-2 border-red-500 w-[100%] h-[90%] top-[5%] bg-zinc-50 text-black">
          <NavBar />

          <img
            className="w-[20rem] min-w-[20rem] aspect-2/3 object-cover transition-all duration-300 ease-out border-2 border-blue-500"
            src={
              movieDetails.poster_path !== null
                ? `${imgBaseUrl}${movieDetails.poster_path}`
                : `posternotfound.png`
            }
            alt=""
          />

          <div className="flex items-center gap-5">
            <button
              alt="Add to feed"
              title="Add to feed"
              className="hover:text-blue-800 transition-all duration-200 ease-out hover:bg-zinc-200 p-3"
              onClick={handleLike}>
              {isLiked ? (
                <div className="flex items-center gap-1">
                  <BiSolidHeart className="text-red-800 text-3xl" />
                  <span className="text-red-800 text-xl">Watched</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <BiHeart className="text-3xl" />
                  <span className="text-xl">Watched</span>
                </div>
              )}
            </button>
            <button
              alt="Add to watchlist"
              title="Add to watchlist"
              className="hover:text-blue-800 transition-all duration-200 ease-out"
              onClick={handleSave}>
              {isSaved ? (
                <div className="flex items-center gap-1">
                  <BiListCheck className="text-green-800 text-5xl" />
                  <span className="text-green-800 text-xl">Watchlist</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <BiListPlus className="text-5xl" />
                  <span className=" text-xl">Watchlist</span>
                </div>
              )}
            </button>
          </div>

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
                    <span>{`${director.name}`}</span>
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
        </div>
      </div>
    </>
  )
}
