/* Libraries */
import axios from "axios"
import { useEffect, useState, useContext } from "react"
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
      })
      .then((response) => {
        setUserFilmList(response.data)
      })
      .catch((err) => {
        console.log("Error: ", err)
      })
  }, [])

  return (
    <>
      {/* Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
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

        {/* If user logged in and is not searching, show them list of liked films */}
        {!isSearching && authState.status && (
          <FilmGalleryDisplay
            listOfFilmObjects={userFilmList}
            queryString={queryString}
          />
        )}

        {/* If user is searching (even when they're not logged in), show them list of search results */}
        {isSearching && <FilmGalleryDisplay listOfFilmObjects={searchResult} />}
      </div>
    </>
  )
}
