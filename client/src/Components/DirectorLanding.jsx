/* Libraries */
import React, { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"

/* Custom functions */
import { AuthContext } from "../Utils/authContext"

import { getNiceMonthDateYear, getAge } from "../Utils/helperFunctions"
import { fetchDirectorFromTMDB, checkDirectorStatus } from "../Utils/apiCalls"
import useCommandK from "../Hooks/useCommandK"
import { usePersistedState } from "../Hooks/usePersistedState"

/* Components */
import NavBar from "./Shared/Navigation-Search/NavBar"
import LoadingPage from "./Shared/Navigation-Search/LoadingPage"
import QuickSearchModal from "./Shared/Navigation-Search/QuickSearchModal"
import FilmTMDB_Gallery from "./Shared/Films/FilmTMDB_Gallery"

export default function DirectorLanding() {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const [isLoading, setIsLoading] = useState(false)
  const [directorDetails, setDirectorDetails] = useState({})
  const [directedFilms, setDirectedFilms] = useState({})
  // const [searchModalOpen, setSearchModalOpen] = useState(false)
  const { tmdbId } = useParams()
  const [scrollPosition, setScrollPosition] = usePersistedState(
    "directorLanding-scrollPosition",
    0
  )
  const [numWatched, setNumWatched] = useState(0)
  const [numStarred, setNumStarred] = useState(0)
  const [highestStar, setHighestStar] = useState(0)
  const [score, setScore] = useState(0)
  const [avgRating, setAvgRating] = useState(0)

  const { authState, searchModalOpen, setSearchModalOpen } =
    useContext(AuthContext)

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

  async function fetchPageData() {
    try {
      setSearchModalOpen(false)
      setIsLoading(true)
      const result = await fetchDirectorFromTMDB(tmdbId)
      // Filter out films where the director's job is not 'director'
      const directedFilms = result.movie_credits.crew.filter(
        (film) => film.job === "Director"
      )

      // Filter out films without backdrop or poster path
      let filteredDirectedFilms = directedFilms.filter(
        (film) => !(film.backdrop_path === null || film.poster_path === null)
      )

      // If director is deceased, filter out films released after their deathdate
      if (result.deathday !== null) {
        const deathDate = new Date(result.deathday)
        filteredDirectedFilms = filteredDirectedFilms.filter((film) => {
          if (!film.release_date) return false
          const filmDate = new Date(film.release_date)
          return filmDate <= deathDate
        })
      }

      // Sort by most recent release date -> least recent
      const sortedDirectedFilms = filteredDirectedFilms.sort((a, b) => {
        const dateA = parseInt(a.release_date?.replace("-", ""))
        const dateB = parseInt(b.release_date?.replace("-", ""))
        return dateB - dateA
      })

      setDirectorDetails(result)
      setDirectedFilms(sortedDirectedFilms)
    } catch (err) {
      console.error("Error loading film data: ", err)
    } finally {
      setIsLoading(false)
    }
  }
  async function fetchUserInteraction() {
    try {
      setIsLoading(true)
      const result = await checkDirectorStatus(tmdbId)

      if (result.error) {
        console.error("Server: ", saveResult.error)
      } else {
        setNumWatched(result.watched)
        setNumStarred(result.starred)
        setHighestStar(result.highest_star)
        setScore(result.score)
        setAvgRating(result.avg_rating)
      }
    } catch (err) {
      console.error("Error loading director data: ", err)
    } finally {
      setIsLoading(false)
    }
  }

  /* Hook for scroll restoration */
  useEffect(() => {
    // console.log("Loading state: ", isLoading)
    if (!isLoading) {
      if (scrollPosition) {
        // use setTimeout as a temporary solution to make sure page content fully loads before scroll restoration starts. When watched/rated films become a lot, the 300ms second might not be enough and a new solution will be required.
        setTimeout(() => {
          window.scrollTo(0, parseInt(scrollPosition, 10))
        }, 50)
      } else {
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 0)
      }

      const handleScroll = () => {
        setScrollPosition(window.scrollY)
      }

      const scrollTimer = setTimeout(() => {
        window.addEventListener("scroll", handleScroll)
      }, 500)

      return () => {
        clearTimeout(scrollTimer)
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [isLoading])

  /* Fetch director's info for Landing Page, and fetch user interaction from app's DB if user is logged in. */
  useEffect(() => {
    if (tmdbId) {
      fetchPageData()
      if (authState.status) {
        fetchUserInteraction()
      }
    }
    // setScrollPosition(0)
  }, [tmdbId])

  if (!directorDetails) {
    return <div>Error loading director. Please try again.</div>
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
      <NavBar />

      {/* Text over backdrop */}
      <div className="landing-main-img-container">
        <img
          className="landing-main-img transform translate-y-0"
          src={
            directorDetails.profile_path !== null
              ? `${imgBaseUrl}${directorDetails.profile_path}`
              : `profilepicnotfound.jpg`
          }
          alt=""
        />
        <div className="landing-transparent-layer"></div>
        <div className="">
          <div className="landing-img-text-container">
            {/* Title */}
            {directorDetails.name && (
              <div className="landing-page-title font-heading">
                {directorDetails.name}
              </div>
            )}

            {/* Birthday, deathday, age */}
            <div className="landing-img-text-belowTitle gap-0">
              {directorDetails.birthday && (
                <div className="">
                  <span>{`${getNiceMonthDateYear(directorDetails.birthday)}`}</span>
                </div>
              )}

              {directorDetails.deathday && (
                <div className="">
                  <span className="">&nbsp;-&nbsp;</span>
                  <span>{`${getNiceMonthDateYear(directorDetails.deathday)}`}</span>
                </div>
              )}

              <span>
                &nbsp;
                {`(${getAge(directorDetails.birthday, directorDetails.deathday)})`}
              </span>
            </div>

            {/* Birthplace*/}
            {directorDetails.place_of_birth && (
              <div className="landing-img-text-right">
                <span className="landing-img-text-right-title">born in</span>

                <span className="landing-img-text-right-content">
                  {`${directorDetails.place_of_birth.slice(0, 40)}`}
                  {directorDetails.place_of_birth.length >= 40 && (
                    <span>...</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="landing-transparent-layer-bottom"></div>
        <div className="absolute bottom-0 w-full flex items-center justify-center gap-2 text-stone-200 text-[10px] mb-4">
          <div className="border-1 p-2 rounded-full">{`Watched: ${numWatched}`}</div>
          <div className="border-1 p-2 rounded-full">{`Starred: ${numStarred}`}</div>
          <div className="border-1 p-2 rounded-full">{`Avg. Stars: ${avgRating}`}</div>
          <div className="border-1 p-2 rounded-full">{`Score: ${score}`}</div>
        </div>
      </div>

      {/* Text below backdrop */}
      <div className="flex p-4 text-stone-900 bg-stone-100">
        {directorDetails.biography && (
          <div className="flex flex-col items-start justify-start p-4 pt-2">
            <div className="uppercase font-extralight text-[11px] mb-1 ">
              Biography
            </div>
            <div className="text-[17px]/6 font-extrabold p-2">{`${directorDetails.biography}`}</div>
          </div>
        )}
      </div>

      {/* Directed Films */}
      <div className=" w-screen flex flex-col items-center justify-start bg-stone-100">
        <div className="uppercase font-extralight text-[11px] mb-[-0.3rem] self-start pl-8">
          filmography
        </div>
        <FilmTMDB_Gallery listOfFilmObjects={directedFilms} />
      </div>
    </div>
  )
}
