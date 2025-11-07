/* Libraries */
import React, { useEffect, useState, useContext, useRef } from "react"
import { useLocation, useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"

/* Custom functions */
import {
  getCountryName,
  getReleaseYear,
  fetchFilmFromTMDB,
  checkLikeStatus,
  checkSaveStatus,
} from "../../Utils/helperFunctions"
import { AuthContext } from "../../Utils/authContext"

import TripleStarRating from "./TripleStarRating"

/* Icons */
import {
  BiListPlus,
  BiListCheck,
  BiHeart,
  BiSolidHeart,
  BiStar,
  BiSolidStar,
} from "react-icons/bi"
import { AiFillClockCircle } from "react-icons/ai"

export default function InteractionConsole({
  tmdbId,
  directors,
  movieDetails,
  setIsLoading,
  isLoading,
  css,
}) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [officialRating, setOfficialRating] = useState(null) //0 for liked but unrated; 1, 2, 3 for corresponding stars; null when film unliked
  const [requestedRating, setRequestedRating] = useState(-1) //-1 when neutral (no requests), 0 for unrated; 1, 2, 3 for stars.
  // const [isLoading, setIsLoading] = useState(false)

  const { authState, loading } = useContext(AuthContext)

  /* Create the request body for API call to App's DB when user 'like' a film */
  function createReqBody(requestString) {
    const directorsList = directors.map((director) => ({
      tmdbId: director.id,
      name: director.name,
      profile_path: director.profile_path,
    }))
    const directorNamesForSorting = directors
      .map((director) => director.name)
      .join(", ")

    let req
    switch (requestString) {
      case "like":
      case "save":
        req = {
          tmdbId: movieDetails.id,
          title: movieDetails.title,
          runtime: movieDetails.runtime,
          poster_path: movieDetails.poster_path,
          backdrop_path: movieDetails.backdrop_path,
          origin_country: movieDetails.origin_country,
          release_date: movieDetails.release_date,
          directors: directorsList,
          directorNamesForSorting: directorNamesForSorting,
        }
        break
      case "rate":
        req = {
          tmdbId: movieDetails.id,
          directors: directorsList,
          stars: requestedRating,
        }
    }

    return req
  }
  /* Make API call to App's DB when user 'like' a film */
  function likeFilm(requestedRating) {
    const req = createReqBody("like")
    req["stars"] = requestedRating ? requestedRating : 0

    return axios
      .post(`http://localhost:3002/profile/me/watched`, req, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Server: ", response.data.error)
          throw new Error(response.data.error)
        } else {
          setIsLiked(response.data.liked)
          setOfficialRating(response.data.stars)
          setRequestedRating(-1)
          setIsSaved(false) //positively "unsave" film on client side. upon reload this value will get updated with actual Save status.
          return response.data
        }
      })
      .catch((err) => {
        console.error("Client: Error liking film", err)
        throw err
      })
  }
  /* Make API call to App's DB when user 'unlike' a film */
  function unlikeFilm() {
    return axios
      .delete(`http://localhost:3002/profile/me/watched`, {
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
          throw new Error(response.data.error)

          // console.log(authState)
        } else {
          setIsLiked(response.data.liked)
          setOfficialRating(response.data.stars)
          return response.data
        }
      })
      .catch((err) => {
        console.error("Client: Error unliking film", err)
        throw err
      })
  }
  /* Make API call to App's DB when user 'like' a film */
  function saveFilm() {
    const req = createReqBody("save")
    return axios
      .post(`http://localhost:3002/profile/me/watchlisted`, req, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Server: ", response.data.error)
          throw new Error(response.data.error)
        } else {
          setIsSaved(response.data.saved)
          //positively "unlike" film on client side. upon reload this value will get updated with actual Like status (incl ratings).
          setIsLiked(false)
          setOfficialRating(null)
          return response.data
        }
      })
      .catch((err) => {
        console.error("Client: Error saving film", err)
        throw err
      })
  }
  /* Make API call to App's DB when user 'unlike' a film */
  function unsaveFilm() {
    return axios
      .delete(`http://localhost:3002/profile/me/watchlisted`, {
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
          throw new Error(response.data.error)
        } else {
          setIsSaved(response.data.saved)
          return response.data
        }
      })
      .catch((err) => {
        console.error("Client: Error unliking film", err)
        throw err
      })
  }
  /* Make API call to App's DB to rate a film that has already been liked */
  function rateFilm(rating) {
    const req = createReqBody("rate")
    req["stars"] = rating
    return axios
      .put(`http://localhost:3002/profile/me/watched`, req, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Server: ", response.data.error)
          throw new Error(response.data.error)
        } else {
          setOfficialRating(response.data.stars)
          setRequestedRating(-1) //neutral state
          return response.data
        }
      })
      .catch((err) => {
        console.error("Client: Error rating film", err)
        throw err
      })
  }

  /* Handle user Like/Unlike interaction */
  async function handleLike() {
    /* If user is logged in, they can like/unlike. */
    if (authState.status) {
      setIsLoading(true)

      try {
        if (!isLiked) {
          await likeFilm()
        } else {
          await unlikeFilm()
        }
      } catch (err) {
        alert("Error liking/unliking film, please try again.")
        console.error("Error in handleLike(): ", err)
      } finally {
        setIsLoading(false)
      }
      /* If user not logged in, alert */
    } else {
      // alert("Log in to interact with films!")
    }
  }
  async function handleSave() {
    /* If user is logged in, they can save/unsave */
    if (authState.status) {
      setIsLoading(true)
      try {
        if (!isSaved) {
          await saveFilm()
        } else {
          await unsaveFilm()
        }
      } catch (err) {
        alert("Error saving/unsaving film, please try again.")
        console.error("Error in handleSave(): ", err)
      } finally {
        setIsLoading(false)
      }

      /* If user not logged in, alert */
    } else {
      // alert("Log in to interact with films!")
    }
  }
  async function handleRate() {
    /* If user is logged in, they can like/unlike. */
    if (authState.status) {
      try {
        /* Only take action if requested rating differs from official rating */
        if (requestedRating !== officialRating) {
          /* Rate film if requested rating is in valid range */
          if (requestedRating >= 0 && requestedRating <= 3) {
            /* IMPORTANT: If a film has not been liked when it is rated, send a like request with the requested Rating */
            if (!isLiked) {
              await likeFilm(requestedRating)
            } else {
              await rateFilm(requestedRating)
            }
          } else if (requestedRating == -1) {
            // console.log("Requested rating: back to neutral (-1)")
          } else {
            console.error("Requested rating out of range.")
          }
        }
      } catch (err) {
        alert("Error rating/unrating film, please try again.")
        console.error("Error in handleRate(): ", err)
      } finally {
        setIsLoading(false)
      }
      /* If user not logged in, alert */
    } else {
      // alert("Log in to interact with films!")
    }
  }

  useEffect(() => {
    handleRate()
  }, [requestedRating])

  /* Fetch film info for Landing Page */
  useEffect(() => {
    const fetchPageData = async () => {
      if (tmdbId) {
        // setSearchModalOpen(false)
        setIsLoading(true)
        try {
          checkLikeStatus(tmdbId, setIsLiked, setOfficialRating)
          checkSaveStatus(tmdbId, setIsSaved)
        } catch (err) {
          console.error("Error loading film data: ", err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchPageData()
  }, [tmdbId])

  return (
    <>
      {!isLoading && (
        <div
          className={`flex flex-col text-${css.textColor} z-30 items-center justify-center gap-0`}>
          <div className="text-white w-[85%] text-justify pr-4 pl-4 pb-2">
            <span className="">{movieDetails.overview?.slice(0, 200)}</span>
            {movieDetails.overview?.length >= 200 && <span>{`...`}</span>}
          </div>

          {/* <div className="text-white w-[85%] flex items-center justify-center gap-2 pr-4 pl-4 pb-4">
            <AiFillClockCircle />
            <span className="">{`${movieDetails.runtime} minutes`}</span>
          </div> */}

          <div
            className={`flex items-center gap-${css.flexGap} h-[4rem] justify-center w-[85%]`}>
            <button
              alt="Add to watched"
              title="Add to watched"
              className={`hover:${css.hoverTextColor} transition-all duration-200 ease-out hover:${css.hoverBg} p-3 h-full flex items-center`}
              onClick={handleLike}>
              {isLiked ? (
                <div className="flex items-center gap-1">
                  <BiSolidHeart
                    className={`text-${css.likeColor} text-${css.likeSize}`}
                  />
                  <span
                    className={`text-${css.likeColor} text-${css.fontSize}`}>
                    Watched
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <BiHeart className={`text-${css.likeSize}`} />
                  <span className={`text-${css.fontSize}`}>Watched</span>
                </div>
              )}
            </button>
            <button
              alt="Add to watchlist"
              title="Add to watchlist"
              className={`hover:${css.hoverTextColor} transition-all duration-200 ease-out hover:${css.hoverBg} p-3 h-full flex items-center`}
              onClick={handleSave}>
              {isSaved ? (
                <div className="flex items-center gap-1">
                  <BiListCheck
                    className={`text-${css.saveColor} text-${css.saveSize}`}
                  />
                  <span
                    className={`text-${css.saveColor} text-${css.fontSize}`}>
                    Watchlist
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <BiListPlus className={`text-${css.saveSize}`} />
                  <span className={`text-${css.fontSize}`}>Watchlist</span>
                </div>
              )}
            </button>
            <TripleStarRating
              officialRating={officialRating}
              setRequestedRating={setRequestedRating}
              css={css}
            />
          </div>
        </div>
      )}
    </>
  )
}
