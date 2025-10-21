/* Libraries */
import axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import { useLocation } from "react-router-dom"

/* Custom functions */
import { AuthContext } from "../Utils/authContext"
import { queryFilmFromTMDB } from "../Utils/helperFunctions"
import useCommandK from "../Utils/useCommandK"

/* Components */
import NavBar from "./Shared/NavBar"
import SearchBar from "./Shared/SearchBar"
import FilmGalleryDisplay from "./Shared/FilmGalleryDisplay"
import QuickSearchModal from "./Shared/QuickSearchModal"

/* Icons */
import { HiMiniBarsArrowDown, HiMiniBarsArrowUp } from "react-icons/hi2"

/* A template for displaying films that user either Liked or Added to Watchlist. It also includes a search bar, where user can query for films from the TMDB. 
@props:
- queryString: 'liked-films' for Liked Films, 'watchlist' for Watchlist
*/
export default function UserFilmsTemplate({ queryString }) {
  const [searchInput, setSearchInput] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [userFilmList, setUserFilmList] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState("added_date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [returnToPage, setReturnToPage] = useState("/")

  const { authState } = useContext(AuthContext)

  /* Query films from TMDB with Quick Search Modal's Search Input */
  const location = useLocation()
  const { searchInputFromQuickSearch } = location.state || {}

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

  /* Query films from TMDB with Quick Search Modal's Search Input */
  useEffect(() => {
    try {
      // console.log("Location.state:", location.state)
      if (location.state) {
        // Check if search input is not an empty string or null
        if (
          searchInputFromQuickSearch.trim().length > 0 &&
          searchInputFromQuickSearch !== null
        ) {
          setSearchInput(searchInputFromQuickSearch)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }, [location.state])

  /* Query films from TMDB with Search Bar */
  useEffect(() => {
    // console.log("Search Input:", searchInput)
    if (searchInput.trim().length === 0 || searchInput === null) {
      setIsSearching(false)
    } else {
      setIsSearching(true)
      queryFilmFromTMDB(searchInput, setSearchResult)
    }
  }, [searchInput])

  /* Fetch User's film list (liked or watchlisted) from App's DB */
  useEffect(() => {
    axios
      .get(`http://localhost:3002/profile/me/${queryString}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
        params: {
          sortBy: sortBy,
          sortDirection: sortDirection,
        },
      })
      .then((response) => {
        setUserFilmList(response.data)
      })
      .catch((err) => {
        console.log("Error: ", err)
      })
  }, [sortBy, sortDirection])

  useEffect(() => {
    if (queryString === "liked-films") {
      setReturnToPage("/")
    } else if (queryString === "watchlist") {
      setReturnToPage("/watchlist")
    } else {
      setReturnToPage("/")
    }
  }, [])

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
      {/* Wrapper for entire page */}
      <div className="flex flex-col items-center">
        <NavBar />
        {/* Page title for Liked films*/}
        {queryString === "liked-films" && (
          <div className="text-black mt-20 ">
            <span> Welcome to The Film Atlas</span>
            {authState.status && (
              <span className="font-bold">{`, ${authState.username}`}</span>
            )}
          </div>
        )}
        {/* Page title for Watchlist*/}
        {queryString === "watchlist" && (
          <div className="text-black mt-20 ">
            {authState.status && (
              <div>
                <span className="font-bold">{`${authState.username}`}</span>
                <span>{`'s watchlist`}</span>
              </div>
            )}
          </div>
        )}
        <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />

        <div className="border-1 mt-20 p-3">
          <div>Sort by: </div>
          <ul className="flex flex-col items-start">
            <li className="transition-all duration-200 ease-out hover:text-blue-800">
              <button
                onClick={() => {
                  setSortBy(`added_date`)
                }}>{`Recently added - default`}</button>
            </li>

            <li className="transition-all duration-200 ease-out hover:text-blue-800">
              <button
                onClick={() => {
                  setSortBy(`released_date`)
                }}>{`Released date`}</button>
            </li>

            <li className="transition-all duration-200 ease-out hover:text-blue-800">
              <button
                onClick={() => {
                  setSortBy(`director_name`)
                }}>{`Director's Name`}</button>
            </li>
          </ul>
          <div>
            <button
              className="text-2xl"
              onClick={() => {
                setSortDirection((prevDirection) => {
                  if (prevDirection === "desc") {
                    return "asc"
                  } else if (prevDirection === "asc") {
                    return "desc"
                  } else {
                    return "desc"
                  }
                })
              }}>
              {sortDirection === "desc" ? (
                <HiMiniBarsArrowDown />
              ) : (
                <HiMiniBarsArrowUp />
              )}
            </button>
          </div>
        </div>
        {/* If user logged in and is not searching, show them list of liked films */}
        {!isSearching && authState.status && (
          <div className="mt-10">
            <span>Your Films:</span>
            <FilmGalleryDisplay
              listOfFilmObjects={userFilmList}
              queryString={queryString}
              sortDirection={sortDirection}
            />
          </div>
        )}
        {/* If user is searching (even when they're not logged in), show them list of search results */}
        {isSearching && (
          <div className="mt-10">
            <span>Your Search Result:</span>
            <FilmGalleryDisplay listOfFilmObjects={searchResult} />
          </div>
        )}
      </div>
    </>
  )
}
