/* Libraries */
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

/* Custom functions */
import { getNiceMonthDateYear, getAge } from "../Utils/helperFunctions"
import { fetchDirectorFromTMDB } from "../Utils/apiCalls"
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
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const { tmdbId } = useParams()
  const [scrollPosition, setScrollPosition] = usePersistedState(
    "directorLanding-scrollPosition",
    0
  )

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

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

  /* Fetch film info for Landing Page */
  useEffect(() => {
    const fetchPageData = async () => {
      if (tmdbId) {
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
            (film) =>
              !(film.backdrop_path === null || film.poster_path === null)
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
    }
    fetchPageData()
  }, [tmdbId])

  if (!directorDetails) {
    return <div>Error loading director. Please try again.</div>
  }

  return (
    <>
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
