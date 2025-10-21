import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { getReleaseYear } from "../../Utils/helperFunctions"
import { group } from "d3"

export default function FilmGalleryDisplay({
  listOfFilmObjects,
  queryString,
  sortDirection,
}) {
  const [groupedFilms, setGroupedFilms] = useState([])
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const navigate = useNavigate()

  useEffect(() => {
    /* User reduce() to group list of films by year */
    const grouped = listOfFilmObjects.reduce((groups, film) => {
      const year = getReleaseYear(film.release_date)
      if (!groups[year]) {
        groups[year] = []
      }
      groups[year].push(film)
      return groups
    }, {})
    // console.log(grouped)

    /* Convert grouped list to array and sort based on sortDirection */
    const sorted = Object.entries(grouped).sort(([a], [b]) => {
      return sortDirection === "desc" ? b - a : a - b
    })

    // console.log(sorted)

    setGroupedFilms(sorted)
  }, [listOfFilmObjects])

  // useEffect(() => {
  //   const groupedFilmsHolder = listOfFilmObjects.reduce((groups, film) => {
  //     // currentDate = new Date()
  //     // currentYear = currentDate.getFullYear()
  //     const year = getReleaseYear(film.release_date)
  //     if (!groups[year]) {
  //       groups[year] = []
  //     }
  //     groups[year].push(film)
  //     return groups
  //   }, {})
  //   if (sortDirection === "desc") {
  //     Object.entries(groupedFilms).sort(([a], [b]) => b - a)
  //   } else {
  //     Object.entries(groupedFilms).sort(([b], [a]) => a - b)
  //   }
  //   setGroupedFilms(groupedFilmsHolder)
  //   // console.log(groupedFilms)
  // }, [listOfFilmObjects, sortDirection])

  return (
    <div>
      {listOfFilmObjects.length === 0 && (
        <div className="mt-10">No films found.</div>
      )}

      {listOfFilmObjects.length > 0 && (
        <div className="flex flex-col justify-center gap-10 mt-10">
          {groupedFilms.map(([year, films]) => {
            return (
              <div key={`${year}`} className="flex flex-col gap-2">
                <div className="font-bold text-2xl">{year}</div>
                <div className="grid grid-cols-1 gap-6">
                  {films.map((filmObject, key) => (
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
                            navigate(`/films/${filmObject.id}`, {
                              state: {
                                fromPage: queryString,
                              },
                            })
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
                                navigate(`/films/${filmObject.id}`)
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
                            {queryString && filmObject.directors && (
                              <span className="">
                                <span className="flex gap-1">
                                  <span>|</span>
                                  {filmObject.directors.map((dir, key) => {
                                    return (
                                      <span key={key}>
                                        <span>{`${dir.name}`}</span>
                                        {/* Add a comma if it's not the last country on the list */}
                                        {key !==
                                          filmObject.directors.length - 1 && (
                                          <span>,</span>
                                        )}
                                      </span>
                                    )
                                  })}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Right side - director's photo*/}
                        {queryString && filmObject.directors && (
                          <div className=" border-amber-400 flex items-center gap-1 justify-center">
                            {filmObject.directors.map((dir, key) => {
                              return (
                                <img
                                  className="max-w-[3.5rem] aspect-square object-cover rounded-full grayscale"
                                  key={key}
                                  src={
                                    dir.profile_path !== null
                                      ? `${imgBaseUrl}${dir.profile_path}`
                                      : "profilepicnotfound.jpg"
                                  }
                                />
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // return (
  //   <div>
  //     {listOfFilmObjects.length === 0 && (
  //       <div className="mt-10">No films found.</div>
  //     )}

  //     {listOfFilmObjects.length > 0 && (
  //       <div className="flex flex-col justify-center gap-0 mt-10">
  //         <div className="grid grid-cols-1 gap-6">
  //           {listOfFilmObjects.map((filmObject, key) => (
  //             /* Each film item */
  //             <div
  //               key={key}
  //               className="film-item w-[30rem] min-w-[20rem] aspect-16/10 flex flex-col justify-center items-start gap-0 bg-zinc-200">
  //               {/* Poster */}
  //               <div className="group/thumbnail overflow-hidden">
  //                 <img
  //                   className="w-[30rem] min-w-[20rem] aspect-16/10 object-cover transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03]"
  //                   src={
  //                     filmObject.backdrop_path !== null
  //                       ? `${imgBaseUrl}${filmObject.backdrop_path}`
  //                       : `backdropnotfound.jpg`
  //                   }
  //                   alt=""
  //                   onClick={() => {
  //                     navigate(`/films/${filmObject.id}`, {
  //                       state: {
  //                         fromPage: queryString,
  //                       },
  //                     })
  //                   }}
  //                 />
  //               </div>

  //               {/* Text below poster */}
  //               <div className="text-black w-full p-3  flex justify-between">
  //                 {/* Left side - Title, year, directors name*/}
  //                 <div className="border-amber-400 flex flex-col items-start justify-center gap-0">
  //                   {/* Film Title */}
  //                   <div>
  //                     <span
  //                       onClick={() => {
  //                         navigate(`/films/${filmObject.id}`)
  //                       }}
  //                       className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-lg ">
  //                       {`${filmObject.title.slice(0, 30)}`}
  //                     </span>
  //                     {filmObject.title.length >= 30 && (
  //                       <span className="font-bold uppercase transition-all duration-200 ease-out hover:text-blue-800 text-lg">
  //                         ...
  //                       </span>
  //                     )}
  //                   </div>
  //                   {/* Release year & Director's name */}
  //                   <div className="flex items-center uppercase text-sm gap-1">
  //                     {filmObject.release_date && (
  //                       <span className="">
  //                         {`${getReleaseYear(filmObject.release_date)}`}
  //                       </span>
  //                     )}
  //                     {queryString && filmObject.directors && (
  //                       <span className="">
  //                         <span className="flex gap-1">
  //                           <span>|</span>
  //                           {filmObject.directors.map((dir, key) => {
  //                             return (
  //                               <span key={key}>
  //                                 <span>{`${dir.name}`}</span>
  //                                 {/* Add a comma if it's not the last country on the list */}
  //                                 {key !== filmObject.directors.length - 1 && (
  //                                   <span>,</span>
  //                                 )}
  //                               </span>
  //                             )
  //                           })}
  //                         </span>
  //                       </span>
  //                     )}
  //                   </div>
  //                 </div>
  //                 {/* Right side - director's photo*/}
  //                 {queryString && filmObject.directors && (
  //                   <div className=" border-amber-400 flex items-center gap-1 justify-center">
  //                     {filmObject.directors.map((dir, key) => {
  //                       return (
  //                         <img
  //                           className="max-w-[3.5rem] aspect-square object-cover rounded-full grayscale"
  //                           key={key}
  //                           src={
  //                             dir.profile_path !== null
  //                               ? `${imgBaseUrl}${dir.profile_path}`
  //                               : "profilepicnotfound.jpg"
  //                           }
  //                         />
  //                       )
  //                     })}
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // )
}
