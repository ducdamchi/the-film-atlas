import { useEffect, useEffectEvent, useLayoutEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getReleaseYear } from "../../Utils/helperFunctions"

export default function DirectorTMDB_Gallery({
  listOfDirectorObjects,
  queryString,
}) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const navigate = useNavigate()

  useEffect(() => {
    console.log(listOfDirectorObjects)
  }, [listOfDirectorObjects])

  return (
    <div>
      {listOfDirectorObjects.length === 0 && (
        <div className="mt-10">No directors found.</div>
      )}

      {listOfDirectorObjects.length > 0 && (
        <div className="flex flex-col justify-center gap-0 mt-10">
          <div className="grid grid-cols-1 gap-6">
            {listOfDirectorObjects.map((directorObject, key) => (
              /* Each film item */
              <div
                key={key}
                className="relative film-item w-[25rem] min-w-[20rem] aspect-10/13 flex flex-col justify-center items-start gap-0 bg-zinc-200">
                {/* Profile */}
                <div className="relative group/thumbnail aspect-10/13 overflow-hidden w-[25rem] min-w-[20rem] border-3">
                  <img
                    className="object-cover w-full transition-all duration-300 ease-out group-hover/thumbnail:scale-[1.03] grayscale transform -translate-y-1/10 z-10 brightness-110"
                    src={
                      directorObject.profile_path !== null
                        ? `${imgBaseUrl}${directorObject.profile_path}`
                        : `profilepicnotfound.jpg`
                    }
                    alt=""
                    onClick={() => {
                      navigate(`/directors/${directorObject.id}`)
                    }}
                  />
                  <div className="border-red-500 absolute bottom-0 left-0 h-[15rem] w-full bg-gradient-to-t from-black/90 to-transparent"></div>
                  <div className=" border-green-500 absolute bottom-0 left-0 h-[15rem] w-full flex flex-col items-center justify-end p-6 gap-1 transition-all duration-200 ease-out group">
                    {directorObject.name.split(" ").map((word, key) => (
                      <div
                        key={key}
                        className="w-full font-extrabold text-white uppercase text-3xl group/hover:text-blue-800">
                        {word}
                      </div>
                    ))}
                    <div className="w-full border-white text-white text-sm italic mt-1 text-left">
                      {directorObject.known_for.map((filmObject, key) => (
                        <span key={key}>
                          <span className="">
                            {filmObject?.title ||
                              filmObject?.name ||
                              filmObject?.original_title}
                          </span>
                          {key !== directorObject.known_for.length - 1 && (
                            <span className="">,&nbsp;</span>
                          )}
                        </span>
                      ))}
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

/* Right side - director's photo*/
// {
//   queryString && directorObject.directors && (
//     <div className=" border-amber-400 flex items-center gap-1 justify-center">
//       {directorObject.directors.map((dir, key) => {
//         return (
//           <img
//             className="max-w-[3.5rem] aspect-square object-cover rounded-full grayscale"
//             key={key}
//             src={
//               dir.profile_path !== null
//                 ? `${imgBaseUrl}${dir.profile_path}`
//                 : "profilepicnotfound.jpg"
//             }
//           />
//         )
//       })}
//     </div>
//   )
// }

/* Release year & Director's name */
{
  /* <div className="flex items-center uppercase text-sm gap-1">
  {directorObject.release_date && (
    <span className="">{`${getReleaseYear(directorObject.release_date)}`}</span>
  )}
  {queryString && directorObject.directors && (
    <span className="">
      <span className="flex gap-1">
        <span>|</span>
        {directorObject.directors.map((dir, key) => {
          return (
            <span key={key}>
              <span>{`${dir.name}`}</span>
              
              {key !== directorObject.directors.length - 1 && <span>,</span>}
            </span>
          )
        })}
      </span>
    </span>
  )}
</div> */
}
