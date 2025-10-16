import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getReleaseYear } from "../../Utils/helperFunctions"

export default function FilmGalleryDisplay({ listOfFilmObjects, queryString }) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const [sortOrder, setSortOrder] = useState(0)

  useEffect(() => {
    console.log(listOfFilmObjects)
  }, [listOfFilmObjects])

  return (
    <div>
      {listOfFilmObjects.length === 0 && (
        <div className="mt-20">No films found.</div>
      )}

      {listOfFilmObjects.length > 0 && (
        <div className="flex flex-col justify-center gap-0 mt-20">
          <div>
            <div>Filter by: </div>
            <ul className="flex flex-col items-start">
              <li>
                <button>{`Recently added (Newest first)`}</button>
              </li>
              <li>
                <button>{`Recently added (Oldest first)`}</button>
              </li>
              <li>
                <button>{`Year (Newest first)`}</button>
              </li>
              <li>
                <button>{`Year (Oldest first)`}</button>
              </li>
              {/* <button>
                <li>{`Decade (Newest first)`}</li>
              </button>
              <button>
                <li>{`Decade (Oldest first)`}</li>
              </button> */}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {listOfFilmObjects.map((filmObject, key) => (
              /* Each film item */
              <div
                key={key}
                className="film-item w-[30rem] min-w-[20rem] aspect-16/10 flex flex-col justify-center items-start gap-0 bg-zinc-200">
                {/* Poster */}
                <div className="group/thumbnail overflow-hidden">
                  <Link
                    className="border-red-500 absolute w-[30rem] h-[18.75rem] z-10"
                    to={`/films/${filmObject.id}`}
                    state={{
                      fromPage: queryString,
                    }}></Link>
                  <img
                    className="w-[30rem] min-w-[20rem] aspect-16/10 object-cover transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03]"
                    src={
                      filmObject.backdrop_path !== null
                        ? `${imgBaseUrl}${filmObject.backdrop_path}`
                        : `backdropnotfound.jpg`
                    }
                    alt=""
                  />
                </div>

                {/* Text below poster */}
                <div className="text-md text-black w-full p-3">
                  <Link
                    className="peer border-red-500 absolute w-[28rem] h-[1.5rem] z-10"
                    to={`/films/${filmObject.id}`}
                    state={
                      {
                        // currentSearchInput: searchInput,
                        // movieId: filmObject.id,
                      }
                    }></Link>
                  <span className="font-bold uppercase transition-all duration-200 ease-out peer-hover:text-blue-800">
                    {`${filmObject.title}`}
                  </span>{" "}
                  <br />
                  {filmObject.release_date && (
                    <span className="">
                      {`${getReleaseYear(filmObject.release_date)}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
