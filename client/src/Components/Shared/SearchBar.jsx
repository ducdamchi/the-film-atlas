import React from "react"
import { BiSearchAlt2 } from "react-icons/bi"

export default function SearchBar({
  searchInput,
  setSearchInput,
  placeholderString,
}) {
  return (
    <>
      <div className="flex items-center justify-center gap-4 mt-10 w-full h-auto">
        <div className="relative w-[50%] min-w-[10rem] max-w-[30rem] border-2 h-[2.5rem] p-2 flex items-center gap-2 drop-shadow-xl border-1 rounded-full drop-shadow-sm/50 drop-shadow-black/40">
          <BiSearchAlt2 className="ml-2" />
          <input
            className="h-[2.5rem] w-full border-0 focus:outline-0 input:bg-none"
            type="text"
            name="search-bar"
            autoComplete="off"
            placeholder={placeholderString}
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearchInput(event.target.value)
              }
            }}></input>
        </div>
      </div>
    </>
  )
}
