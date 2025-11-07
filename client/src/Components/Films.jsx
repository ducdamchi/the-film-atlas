/* Libraries */
import axios from "axios"
import React, { useEffect, useState, useContext, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

/* Custom functions */
import { AuthContext } from "../Utils/authContext"
import { queryFilmFromTMDB, fetchListByParams } from "../Utils/helperFunctions"
import useCommandK from "../Utils/useCommandK"

/* Components */
import NavBar from "./Shared/NavBar"
import SearchBar from "./Shared/SearchBar"
import FilmUser_Gallery from "./Shared/FilmUser_Gallery"
import FilmTMDB_Gallery from "./Shared/FilmTmdb_Gallery"
import QuickSearchModal from "./Shared/QuickSearchModal"
import Toggle_Four from "./Shared/Toggle_Four"
import Toggle_Three from "./Shared/Toggle_Three"
import Toggle_Two from "./Shared/Toggle_Two"
import LoadingPage from "./Shared/LoadingPage"

/* Icons */
import { HiMiniBarsArrowDown, HiMiniBarsArrowUp } from "react-icons/hi2"
import { RiSortNumberAsc, RiSortNumberDesc } from "react-icons/ri"
import { FaSortNumericDown, FaSortNumericDownAlt } from "react-icons/fa"

export default function Films() {
  const [searchInput, setSearchInput] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [userFilmList, setUserFilmList] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("added_date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [numStars, setNumStars] = useState(0)

  const [queryString, setQueryString] = useState("watched")
  const { authState } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

  /* Query films from TMDB with Quick Search Modal's Search Input */
  useEffect(() => {
    try {
      // console.log("Location.state:", location.state)
      if (location.state) {
        const { searchInputFromQuickSearch, returnToViewMode } =
          location.state || {}
        // Check if search input is not an empty string or null
        if (typeof searchInputFromQuickSearch === "string") {
          if (searchInputFromQuickSearch.trim().length > 0) {
            setSearchInput(searchInputFromQuickSearch)
          }
        }

        // if (
        //   returnToViewMode === "watched" ||
        //   returnToViewMode === "watchlisted" ||
        //   returnToViewMode === "starred"
        // ) {
        //   console.log("Return to View Mode: ", returnToViewMode)
        //   setQueryString(returnToViewMode)
        // }
      }
    } catch (err) {
      console.log(err)
    }
  }, [location.state])

  /* Query films from TMDB with Search Bar */
  useEffect(() => {
    // console.log("Search Input:", searchInput)
    const queryFilm = async () => {
      try {
        if (searchInput.trim().length === 0 || searchInput === null) {
          setIsSearching(false)
        } else {
          setIsSearching(true)
          queryFilmFromTMDB(searchInput, setSearchResult)
        }
      } catch (err) {
        console.log("Error Querying Film: ", err)
        throw err
      }
    }
    queryFilm()
  }, [searchInput])

  /* Fetch User's film list (liked, watchlisted or starred) from App's DB */
  useEffect(() => {
    // console.log("NumStars: ", numStars)
    // if (authState.status) {
    const fetchUserFilmList = async () => {
      fetchListByParams({
        queryString: queryString,
        sortBy: sortBy,
        sortDirection: sortDirection,
        numStars: numStars,
        setUserFilmList: setUserFilmList,
      })
    }
    fetchUserFilmList()
    // } else {
    //   alert("Log in to interact with films!")
    // }
  }, [sortBy, sortDirection, queryString, numStars])

  return (
    <>
      {/* Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
          queryString={queryString}
        />
      )}
      {/* Wrapper for entire page */}
      <div className="flex flex-col items-center">
        <NavBar />

        <div className="text-black text-3xl mt-10 font-bold uppercase">
          Films
        </div>

        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          placeholderString={"Search by title (or \u2318K) ..."}
        />

        <div className="flex flex-col items-start justify-center mt-20">
          <Toggle_Three
            label="View Mode"
            width={`20rem`}
            height={`2.5rem`}
            state={queryString}
            setState={setQueryString}
            stateDetails={{
              1: { value: "watched", label: "Watched" },
              2: { value: "watchlisted", label: "Watchlist" },
              3: { value: "watched/rated", label: "Rated" },
            }}
          />

          <Toggle_Two
            label="Sort By"
            width={`20rem`}
            height={`2.5rem`}
            state={sortBy}
            setState={setSortBy}
            stateDetails={{
              1: { value: "added_date", label: "Recently Added" },
              2: { value: "released_date", label: "Released Year" },
            }}
          />

          <Toggle_Two
            label="Sort Order"
            width={`10rem`}
            height={`2.5rem`}
            state={sortDirection}
            setState={setSortDirection}
            stateDetails={{
              1: {
                value: "desc",
                label: <FaSortNumericDownAlt className="text-xl mt-0" />,
              },
              2: {
                value: "asc",
                label: <FaSortNumericDown className="text-xl mt-0" />,
              },
            }}
          />

          {queryString === "watched/rated" && (
            <Toggle_Four
              label="Rating"
              width={`20rem`}
              height={`2.5rem`}
              state={numStars}
              setState={setNumStars}
              stateDetails={{
                1: {
                  value: 0,
                  label: <span className="">All</span>,
                },
                2: {
                  value: 3,
                  label: (
                    <span className="text-2xl text-pink-600">
                      &#10048;&#10048;&#10048;
                    </span>
                  ),
                },
                3: {
                  value: 2,
                  label: (
                    <span className="text-2xl text-pink-600">
                      &#10048;&#10048;
                    </span>
                  ),
                },
                4: {
                  value: 1,
                  label: (
                    <span className="text-2xl text-pink-600">&#10048;</span>
                  ),
                },
              }}
            />
          )}
        </div>

        {/* If user logged in and is not searching, show them list of liked films */}
        {!isSearching && authState.status && (
          <div className="mt-10">
            {/* <span>Your Films:</span> */}
            <FilmUser_Gallery
              listOfFilmObjects={userFilmList}
              queryString={queryString}
              sortDirection={sortDirection}
              sortBy={sortBy}
            />
          </div>
        )}
        {/* If user is searching (even when they're not logged in), show them list of search results */}
        {isSearching && (
          <div className="mt-10">
            <span className="font-bold text-2xl">Search Results:</span>
            <FilmTMDB_Gallery listOfFilmObjects={searchResult} />
          </div>
        )}
      </div>
    </>
  )
}
