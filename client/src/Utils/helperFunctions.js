import axios from "axios"
import { FaListCheck } from "react-icons/fa6"

/* Converts ISO_A2 country codes into full country name */
export function getCountryName(code) {
  // Check if the Intl.DisplayNames API is supported
  if (Intl && Intl.DisplayNames) {
    // Create a new instance for 'en' (English) with 'region' type
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
    // Use the `of()` method to get the country name
    return regionNames.of(code.toUpperCase())
  }
  return undefined
}

/* Converts full date of format yyyy-mm-dd to yyyy only */
export function getReleaseYear(release_date) {
  const date = new Date(release_date)
  const year = date.getFullYear()

  if (isNaN(year) || year < 1800 || year > 3000) {
    return "N/A"
  } else {
    return year
  }
}

/* Converts date of format yyyy-mm (e.g. 2025-10) to Month Year string (e.g. October 2025)*/
export function getNiceMonthYear(dateString) {
  const [year, month] = dateString.split("-")
  const inputDate = new Date(year, month - 1)
  const currentDate = new Date()

  if (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth()
  ) {
    return "This Month"
  } else if (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth() - 1
  ) {
    return "Last Month"
  } else {
    return inputDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }
}

/* Converts date of format yyyy-mm-dd (e.g. 2025-10-25) to Month Date Year string (e.g. October 25, 2025)*/
export function getNiceMonthDateYear(dateString) {
  const [year, month, date] = dateString.split("-")
  const inputDate = new Date(year, month - 1, date)
  // const [year, month, date] = dateString.split("-")
  // const currentDate = new Date()
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Intl.DateTimeFormat("en-US", options).format(inputDate)
}

/* Calculate age from birthday and deathday in the string format yyyy-mm-dd. If deathday left empty, person is not deceased -> use current year. */
export function getAge(birthday, deathday) {
  const birth = new Date(birthday)
  if (deathday) {
    const death = new Date(deathday)
    return death.getFullYear() - birth.getFullYear()
  } else {
    const currentDate = new Date()
    return currentDate.getFullYear() - birth.getFullYear()
  }
}

export function getNameParts(fullName) {
  if (!fullName || typeof fullName !== "string") return ""

  const nameParts = fullName.trim().split(/\s+/) // Handles multiple spaces

  const lastName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : ""

  const firstNameInitial =
    nameParts.length > 0 && nameParts[0].length > 0
      ? nameParts[0][0].toUpperCase()
      : ""

  return { firstNameInitial, lastName }
}

/* Query for films from TMDB (search with provided input)
@params:
- searchInput: A useState object containing the search input
- setSearchResult: A useState function that updates the search result  */
export function queryFilmFromTMDB(searchInput, setSearchResult) {
  const searchUrl = "https://api.themoviedb.org/3/search/movie"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(searchUrl, {
      params: {
        query: searchInput,
        api_key: apiKey,
        include_adult: false,
        append_to_response: "credits",
      },
    })
    .then((response) => {
      const original_results = response.data.results
      const filtered_results = original_results.filter(
        (movie) => !(movie.backdrop_path === null || movie.poster_path === null)
      )
      // .filter((movie) => movie.popularity > 1 || movie.vote_count > 10)
      const sorted_filtered_results = filtered_results.sort(
        (a, b) => b.popularity - a.popularity
      )
      setSearchResult(sorted_filtered_results)
      // console.log("Filtered results:", sorted_filtered_results)
      return response.data
    })
    .catch((err) => {
      console.log("Error: ", err)
      throw err
    })
}

/* Fetch info of one film (with known id) from TMDB
@params:
- tmdbId: unique TMDB id assigned to film
- set...: useState() methods that updates the corresponding values in the calling component
*/
export function fetchFilmFromTMDB(tmdbId, setMovieDetails, setDirectors) {
  const movieDetailsUrl = "https://api.themoviedb.org/3/movie/"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(
      `${movieDetailsUrl}${tmdbId}?append_to_response=credits,videos,watch/providers&api_key=${apiKey}`
    )
    .then((response) => {
      const directorsList = response.data.credits.crew.filter(
        (crewMember) => crewMember.job === "Director"
      )

      setMovieDetails(response.data)
      setDirectors(directorsList)
      return response.data
    })
    .catch((err) => {
      console.log("Client: Error fetching film from TMDB", err)
      throw err
    })
}

export function queryDirectorFromTMDB(searchInput, setSearchResult) {
  const searchPersonUrl = "https://api.themoviedb.org/3/search/person"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(searchPersonUrl, {
      params: {
        query: searchInput,
        api_key: apiKey,
        include_adult: false,
      },
    })
    .then((response) => {
      const directorResult = response.data.results.filter(
        (person) => person.known_for_department === "Directing"
      )
      // console.log("All Directors Found: ", directorResult)
      setSearchResult(directorResult)
    })
    .catch((err) => {
      console.log("Client: Error querying director from TMDB", err)
      throw err
    })
}

export function fetchDirectorFromTMDB(
  tmdbId,
  setDirectorDetails,
  setDirectedFilms
) {
  const personDetailsUrl = "https://api.themoviedb.org/3/person/"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(
      `${personDetailsUrl}${tmdbId}?append_to_response=movie_credits&api_key=${apiKey}`
    )
    .then((response) => {
      // Filter out films where the director's job is not 'director'
      const directedFilms = response.data.movie_credits.crew.filter(
        (film) => film.job === "Director"
      )

      // Filter out films without backdrop or poster path
      let filteredDirectedFilms = directedFilms.filter(
        (film) => !(film.backdrop_path === null || film.poster_path === null)
      )

      // If director is deceased, filter out films released after their deathdate
      if (response.data.deathday !== null) {
        const deathDate = new Date(response.data.deathday)
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

      setDirectorDetails(response.data)
      setDirectedFilms(sortedDirectedFilms)
      return response.data
    })
    .catch((err) => {
      console.log("Client: Error fetching film from TMDB", err)
      throw err
    })
}

export function queryTopRatedFilmByCountryTMDB({
  countryCode = null,
  setSearchResult = null,
  sortBy = null,
  ratingRange = null,
  voteCountRange = null,
} = {}) {
  const searchUrl = "https://api.themoviedb.org/3/discover/movie"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(searchUrl, {
      params: {
        api_key: apiKey,
        with_origin_country: countryCode,
        region: countryCode,
        include_adult: false,
        include_video: false,
        "with_runtime.gte": 80, //pick films > 85 minutes
        "vote_count.gte": voteCountRange[1],
        "vote_average.gte": ratingRange[1],
        // "vote_average.lte": ratingRange[1],
        sort_by: sortBy,
      },
    })
    .then((response) => {
      const original_results = response.data.results
      const filtered_results = original_results.filter(
        (movie) => !(movie.backdrop_path === null || movie.poster_path === null)
      )
      setSearchResult(filtered_results)
      return response.data
    })
    .catch((err) => {
      console.log("Error: ", err)
      throw err
    })
}

export function fetchListByParams({
  queryString = null,
  sortBy = null,
  sortDirection = null,
  numStars = null,
  setUserFilmList = null,
  countryCode = null,
} = {}) {
  return axios
    .get(`http://localhost:3002/profile/me/${queryString}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
      params: {
        sortBy: sortBy,
        sortDirection: sortDirection,
        numStars: numStars,
        countryCode: countryCode,
      },
    })
    .then((response) => {
      setUserFilmList(response.data)
      return response.data
    })
    .catch((err) => {
      console.log("Error: ", err)
      throw err
    })
}

/* Check the Like status of a film for logged in users from App's DB
@params:
- tmdbId: unique TMDB id assigned to film
- setLike: useState() method that updates the like status in the calling component
*/
export function checkLikeStatus(tmdbId, setIsLiked, setOfficialRating) {
  return axios
    .get(`http://localhost:3002/profile/me/watched/${tmdbId}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.log("Server: ", response.data.error)
      } else {
        setIsLiked(response.data.liked)
        setOfficialRating(response.data.stars)
      }
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error checking like status", err)
      throw err
    })
}

/* Check the Saved status of a film for logged in users from App's DB
@params:
- tmdbId: unique TMDB id assigned to film
- setLike: useState() method that updates the like status in the calling component
*/
export function checkSaveStatus(tmdbId, setIsSaved) {
  return axios
    .get(`http://localhost:3002/profile/me/watchlisted/${tmdbId}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.log("Server: ", response.data.error)
      } else {
        if (response.data.saved) {
          setIsSaved(true)
        } else {
          setIsSaved(false)
        }
      }
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error checking save status", err)
      throw err
    })
}
