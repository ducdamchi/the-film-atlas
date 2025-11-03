import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getReleaseYear } from "../../Utils/helperFunctions"

export default function FilmTMDB_Gallery({ listOfFilmObjects }) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const navigate = useNavigate()

  return (
    <div>
      {listOfFilmObjects.length === 0 && (
        <div className="mt-10">No films found.</div>
      )}

      {listOfFilmObjects.length > 0 && (
        <div className="flex flex-col justify-center gap-0 mt-10">
          <div className="grid grid-cols-1 gap-6">
            {listOfFilmObjects.map((filmObject, key) => (
              /* Each film item */
              <div
                key={key}
                className="film-item w-[30rem] min-w-[20rem] aspect-16/10 flex flex-col justify-center items-start gap-0 bg-zinc-200">
                {/* Poster */}
                <div className="group/thumbnail overflow-hidden">
                  <img
                    className="w-[30rem] min-w-[20rem] aspect-16/10 object-cover transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03]"
                    src={
                      filmObject.backdrop_path !== null
                        ? `${imgBaseUrl}${filmObject.backdrop_path}`
                        : `backdropnotfound.jpg`
                    }
                    alt=""
                    onClick={() => {
                      navigate(
                        `/films/${filmObject.id}`
                        //   {
                        //   state: {
                        //     currentViewMode: queryString,
                        //   },
                        // }
                      )
                    }}
                  />
                </div>

                {/* Text below poster */}
                <div className="text-black w-full p-3  flex justify-between">
                  {/* Left side - Title, year, directors name*/}
                  <div className="border-amber-400 flex flex-col items-start justify-center gap-0">
                    {/* Film Title */}
                    <div>
                      <span
                        onClick={() => {
                          navigate(
                            `/films/${filmObject.id}`
                            //   {
                            //   state: {
                            //     currentViewMode: queryString,
                            //   },
                            // }
                          )
                        }}
                        className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-lg ">
                        {`${filmObject.title.slice(0, 30)}`}
                      </span>
                      {filmObject.title.length >= 30 && (
                        <span className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-lg">
                          ...
                        </span>
                      )}
                    </div>
                    {/* Release year & Director's name */}
                    <div className="flex items-center uppercase text-sm gap-1">
                      {filmObject.release_date && (
                        <span className="">
                          {`${getReleaseYear(filmObject.release_date)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
