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
  fetchDirectorFromTMDB,
  getNiceMonthDateYear,
  getAge,
} from "../Utils/helperFunctions"
import { AuthContext } from "../Utils/authContext"
import useCommandK from "../Utils/useCommandK"

/* Components */
import NavBar from "./Shared/NavBar"
import LoadingPage from "./Shared/LoadingPage"
import QuickSearchModal from "./Shared/QuickSearchModal"
import TripleStarRating from "./Shared/TripleStarRating"

/* Icons */
import {
  BiListPlus,
  BiListCheck,
  BiHeart,
  BiSolidHeart,
  BiStar,
  BiSolidStar,
} from "react-icons/bi"
import { GiLotusFlower } from "react-icons/gi"
import FilmTMDB_Gallery from "./Shared/FilmTmdb_Gallery"

export default function DirectorLanding() {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const [isLoading, setIsLoading] = useState(false)
  // const [movieDetails, setMovieDetails] = useState({})
  const [directorDetails, setDirectorDetails] = useState({})
  const [directedFilms, setDirectedFilms] = useState({})

  // const [directors, setDirectors] = useState([]) //director
  // const [dops, setDops] = useState([]) //director of photography
  // const [mainCast, setMainCast] = useState([]) //top 5 cast
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [returnToViewMode, setReturnToViewMode] = useState("")
  const [officialRating, setOfficialRating] = useState(null) //0 for liked but unrated; 1, 2, 3 for corresponding stars; null when film unliked
  const [requestedRating, setRequestedRating] = useState(-1) //-1 when neutral (no requests), 0 for unrated; 1, 2, 3 for stars.

  const { authState, loading } = useContext(AuthContext)
  const { tmdbId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)
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
        alert("Error handling Like/Unlike, please try again.")
        console.error("Error in handleLike(): ", err)
      } finally {
        setIsLoading(false)
      }
      /* If user not logged in, alert */
    } else {
      alert("Sign In to Like Movies!")
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
        alert("Error handling Save/Unsave, please try again.")
        console.error("Error in handleSave(): ", err)
      } finally {
        setIsLoading(false)
      }

      /* If user not logged in, alert */
    } else {
      alert("Sign In to Save Movies!")
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
        alert("Error handling Rate, please try again.")
        console.error("Error in handleRate(): ", err)
      } finally {
        setIsLoading(false)
      }
      /* If user not logged in, alert */
    } else {
      alert("Sign In to Rate Movies!")
    }
  }

  useEffect(() => {
    handleRate()
  }, [requestedRating])

  /* Fetch film info for Landing Page */
  useEffect(() => {
    const fetchPageData = async () => {
      if (tmdbId) {
        setSearchModalOpen(false)
        setIsLoading(true)
        try {
          fetchDirectorFromTMDB(tmdbId, setDirectorDetails, setDirectedFilms)
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
    console.log(directorDetails)
    console.log(directedFilms)
  }, [directorDetails, directedFilms])

  // useEffect(() => {
  //   if (location.state) {
  //     const { currentViewMode } = location.state || {}
  //     console.log("Location.state:", location.state)
  //     console.log("Current View Mode:", currentViewMode)
  //     setReturnToViewMode(currentViewMode)
  //   }
  // }, [location.state])

  if (!directorDetails) {
    return <div>Error loading director. Please try again.</div>
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
      <NavBar />
      {/* <div>{`DirectorId: ${tmdbId}`}</div> */}

      {/* Director's Info */}
      <div>
        <div className="font-bold uppercase text-3xl border-1">
          {directorDetails.name}
        </div>
        <div className="border-1 flex flex-col items-center">
          <div className="relative group/thumbnail aspect-10/13 overflow-hidden w-[25rem] min-w-[20rem] border-3">
            <img
              className="object-cover w-full transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03] grayscale transform -translate-y-1/10 z-10 brightness-110"
              src={
                directorDetails.profile_path !== null
                  ? `${imgBaseUrl}${directorDetails.profile_path}`
                  : `profilepicnotfound.jpg`
              }
              alt=""
            />
          </div>

          <div className="flex italic">
            {directorDetails.birthday && (
              <div className="">
                {/* <span className="font-bold uppercase">Birthday:&nbsp;</span> */}
                <span>{`${getNiceMonthDateYear(directorDetails.birthday)}`}</span>
              </div>
            )}

            {directorDetails.deathday && (
              <div className="">
                <span className="font-bold uppercase">
                  &nbsp;&nbsp;-&nbsp;&nbsp;
                </span>
                <span>{`${getNiceMonthDateYear(directorDetails.deathday)}`}</span>
              </div>
            )}
          </div>

          <div className="flex gap-1">
            {directorDetails.deathday !== null && (
              <span className="font-bold uppercase">Aged:</span>
            )}
            {directorDetails.deathday === null && (
              <span className="font-bold uppercase">Age:</span>
            )}
            <span>{`${getAge(directorDetails.birthday, directorDetails.deathday)}`}</span>
          </div>
        </div>

        {directorDetails.biography && (
          <div className="border-1">
            <span className="font-bold uppercase">Biography:&nbsp;</span>
            <span>{`${directorDetails.biography}`}</span>
          </div>
        )}

        {directorDetails.place_of_birth && (
          <div className="border-1">
            <span className="font-bold uppercase">Birth Place:&nbsp;</span>
            <span>{`${directorDetails.place_of_birth}`}</span>
          </div>
        )}
      </div>

      {/* Directed Films */}
      <FilmTMDB_Gallery listOfFilmObjects={directedFilms} />
    </>
  )
}

// ;<div className="w-screen h-auto flex flex-col justify-center">
//   <div className="overflow-hidden">
//     <img
//       className="w-screen aspect-16/9 object-cover scale-[1.02]"
//       src={
//         movieDetails.backdrop_path !== null
//           ? `${imgBaseUrl}${movieDetails.backdrop_path}`
//           : `backdropnotfound.jpg`
//       }
//       alt=""
//     />
//   </div>
//   <div className="border-2 border-red-500 w-[100%] h-[90%] top-[5%] bg-zinc-50 text-black">
//     <NavBar />
//     <button
//       onClick={() => {
//         navigate("/", {
//           state: {
//             returnToViewMode: returnToViewMode,
//           },
//         })
//       }}>
//       BACK TO FILMS
//     </button>
//     <img
//       className="w-[20rem] min-w-[20rem] aspect-2/3 object-cover transition-all duration-300 ease-out border-2 border-blue-500"
//       src={
//         movieDetails.poster_path !== null
//           ? `${imgBaseUrl}${movieDetails.poster_path}`
//           : `posternotfound.png`
//       }
//       alt=""
//     />

//     <div className="flex items-center gap-5 border-1 h-[4rem]">
//       <button
//         alt="Add to watched"
//         title="Add to watched"
//         className="hover:text-blue-800 transition-all duration-200 ease-out hover:bg-zinc-200/30 p-3 h-full flex items-center"
//         onClick={handleLike}>
//         {isLiked ? (
//           <div className="flex items-center gap-1">
//             <BiSolidHeart className="text-red-800 text-3xl" />
//             <span className="text-red-800 text-xl">Watched</span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-1">
//             <BiHeart className="text-3xl" />
//             <span className="text-xl">Watched</span>
//           </div>
//         )}
//       </button>
//       <button
//         alt="Add to watchlist"
//         title="Add to watchlist"
//         className="hover:text-blue-800 hover:bg-zinc-200/30 transition-all duration-200 ease-out p-3 h-full flex items-center"
//         onClick={handleSave}>
//         {isSaved ? (
//           <div className="flex items-center gap-1">
//             <BiListCheck className="text-green-800 text-5xl" />
//             <span className="text-green-800 text-xl">Watchlist</span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-1">
//             <BiListPlus className="text-5xl" />
//             <span className=" text-xl">Watchlist</span>
//           </div>
//         )}
//       </button>
//       <TripleStarRating
//         officialRating={officialRating}
//         setRequestedRating={setRequestedRating}
//       />
//     </div>

//     {movieDetails.overview && (
//       <div className="border-1">
//         <span className="font-bold uppercase">Overview:&nbsp;</span>
//         <span>{movieDetails.overview}</span>
//       </div>
//     )}

//     {movieDetails.runtime && (
//       <div className="border-1">
//         <span className="font-bold uppercase">Runtime:&nbsp;</span>
//         <span>{`${movieDetails.runtime} minutes`}</span>
//       </div>
//     )}

//     {movieDetails.release_date && (
//       <div className="border-1">
//         <span className="font-bold uppercase">Year:&nbsp;</span>
//         <span>{`${getReleaseYear(movieDetails.release_date)}`}</span>
//       </div>
//     )}

//     {movieDetails.origin_country && (
//       <div className="border-1">
//         <span className="font-bold uppercase">Origin:&nbsp;</span>
//         {movieDetails.origin_country.map((country, key) => {
//           return (
//             <span key={key}>
//               <span>{`${getCountryName(country)}`}</span>
//               {/* Add a comma if it's not the last country on the list */}
//               {key !== movieDetails.origin_country.length - 1 && (
//                 <span>,&nbsp;</span>
//               )}
//             </span>
//           )
//         })}
//       </div>
//     )}

//     {directors.length > 0 && (
//       <div className="border-1">
//         <span className="font-bold uppercase">Director:&nbsp;</span>
//         {directors.map((director, key) => {
//           return (
//             <span key={key}>
//               <span>{`${director.name}`}</span>
//               {/* Add a comma if it's not the last country on the list */}
//               {key !== directors.length - 1 && <span>,&nbsp;</span>}
//             </span>
//           )
//         })}
//       </div>
//     )}

//     {dops.length > 0 && (
//       <div className="border-1">
//         <span className="font-bold uppercase">D.O.P.:&nbsp;</span>
//         {dops.map((dop, key) => {
//           return (
//             <span key={key}>
//               <span>{`${dop.name}`}</span>
//               {/* Add a comma if it's not the last country on the list */}
//               {key !== dops.length - 1 && <span>,&nbsp;</span>}
//             </span>
//           )
//         })}
//       </div>
//     )}

//     {mainCast.length > 0 && (
//       <div className="border-1">
//         <span className="font-bold uppercase">Main cast:&nbsp;</span>
//         {mainCast.map((actor, key) => {
//           return (
//             <span key={key}>
//               <span>{`${actor.name}`}</span>
//               {/* Add a comma if it's not the last country on the list */}
//               {key !== mainCast.length - 1 && <span>,&nbsp;</span>}
//             </span>
//           )
//         })}
//       </div>
//     )}
//   </div>
// </div>
