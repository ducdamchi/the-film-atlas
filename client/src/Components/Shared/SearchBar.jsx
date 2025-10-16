import React from "react"
import { BiSearchAlt2 } from "react-icons/bi"

export default function SearchBar({ searchInput, setSearchInput }) {
  return (
    <>
      <div className="flex items-center justify-center gap-4 mt-10 w-full h-auto ">
        <div className="relative w-[50%] min-w-[10rem] max-w-[40rem] border-1 h-[2.5rem] p-2 flex items-center gap-2">
          <BiSearchAlt2 />
          <input
            className="h-[2.5rem] w-full border-0 focus:outline-0 input:bg-none"
            type="text"
            name="search-bar"
            autoComplete="off"
            placeholder="Search by title..."
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
