import axios from "axios"

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

export function getReleaseYear(release_date) {
  const date = new Date(release_date)
  const year = date.getFullYear()

  if (isNaN(year) || year < 1800 || year > 3000) {
    return "N/A"
  } else {
    return year
  }
}

/* Query for films from TMDB (search with provided input)
@params:
- searchInput: A useState object containing the search input
- setSearchResult: A useState function that updates the search result  */
export function queryFilmFromTMDB(searchInput, setSearchResult) {
  const searchUrl = "https://api.themoviedb.org/3/search/movie"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  axios
    .get(searchUrl, {
      params: {
        query: searchInput,
        api_key: apiKey,
      },
    })
    .then((response) => {
      // console.log("Response:", response.data.results)
      setSearchResult(response.data.results)
    })
    .catch((err) => {
      console.log("Error: ", err)
    })
}

/* Fetch info of one film (with known id) from TMDB
@params:
- tmdbId: unique TMDB id assigned to film
@return: Object with
{movieDetails, directorsList, dopsList, mainCastList}
*/
// export async function fetchFilmFromTMDB(tmdbId) {
//   const movieDetailsUrl = "https://api.themoviedb.org/3/movie/"
//   const apiKey = "14b22a55c02218f84058041c5f553d3d"

//   try {
//     const response = await axios.get(
//       `${movieDetailsUrl}${tmdbId}?append_to_response=credits&api_key=${apiKey}`
//     )

//     const directorsList = response.data.credits.crew.filter(
//       (crewMember) => crewMember.job === "Director"
//     )
//     const dopsList = response.data.credits.crew.filter(
//       (crewMember) => crewMember.job === "Director of Photography"
//     )
//     const mainCastList = response.data.credits.cast.slice(0, 5)
//     return {
//       movieDetails: response.data,
//       directorsList: directorsList,
//       dopsList: dopsList,
//       mainCastList: mainCastList,
//     }
//   } catch (err) {
//     console.log("Client: Error fetching film from TMDB", err)
//   }
// }

/* Fetch info of one film (with known id) from TMDB
@params:
- tmdbId: unique TMDB id assigned to film
- set...: useState() methods that updates the corresponding values in the calling component
*/
export function fetchFilmFromTMDB(
  tmdbId,
  setMovieDetails,
  setDirectors,
  setDops,
  setMainCast
) {
  const movieDetailsUrl = "https://api.themoviedb.org/3/movie/"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  axios
    .get(
      `${movieDetailsUrl}${tmdbId}?append_to_response=credits&api_key=${apiKey}`
    )
    .then((response) => {
      const directorsList = response.data.credits.crew.filter(
        (crewMember) => crewMember.job === "Director"
      )
      const dopsList = response.data.credits.crew.filter(
        (crewMember) => crewMember.job === "Director of Photography"
      )
      const mainCastList = response.data.credits.cast.slice(0, 5)

      setMovieDetails(response.data)
      setDirectors(directorsList)
      setDops(dopsList)
      setMainCast(mainCastList)
    })
    .catch((err) => {
      console.log("Client: Error fetching film from TMDB", err)
    })
}

/* Check the Like status of a film for logged in users from App's DB
@params:
- tmdbId: unique TMDB id assigned to film
- setLike: useState() method that updates the like status in the calling component
*/
export function checkLikeStatus(tmdbId, setIsLiked) {
  axios
    .get(`http://localhost:3002/profile/me/liked-films/${tmdbId}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.log("Server: ", response.data.error)
      } else {
        if (response.data.liked) {
          setIsLiked(true)
        } else {
          setIsLiked(false)
        }
      }
    })
    .catch((err) => {
      console.error("Client: Error checking like status", err)
    })
}

/* Check the Saved status of a film for logged in users from App's DB
@params:
- tmdbId: unique TMDB id assigned to film
- setLike: useState() method that updates the like status in the calling component
*/
export function checkSaveStatus(tmdbId, setIsSaved) {
  axios
    .get(`http://localhost:3002/profile/me/watchlist/${tmdbId}`, {
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
    })
    .catch((err) => {
      console.error("Client: Error checking like status", err)
    })
}
