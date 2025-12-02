import React, { useContext } from "react"
import NavBar from "./Shared/Navigation-Search/NavBar"
import QuickSearchModal from "./Shared/Navigation-Search/QuickSearchModal"
import { GoSquareFill } from "react-icons/go"
import { AuthContext } from "../Utils/authContext"
import { RiProgress8Line, RiProgress4Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

export default function Docs() {
  const navigate = useNavigate()
  const { searchModalOpen, setSearchModalOpen } = useContext(AuthContext)
  return (
    <div className="font-primary mt-20 mb-20">
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
        />
      )}
      <div className="flex flex-col items-center">
        <NavBar />
        <div className="font-heading page-title mb-10">GUIDE</div>

        <div className="md:p-10 max-w-[40rem]">
          {/* Getting started - Create account */}
          <section className="flex flex-col p-5 gap-10 mb-20">
            <div className="uppercase flex flex-col gap-2">
              <div className="guide-sectionCategory">Getting started</div>
              <div className="guide-sectionTitle">Creating an account</div>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Enjoy All Features</div>
                <div className="font-light">
                  An account is needed for The Film Atlas to keep track of your
                  interactions with films. These interactions are crucial for
                  creating a heat map of the world, compiling a list of your
                  watched directors, and maintaining a personal collection of
                  watched, rated, or watchlisted films. Note that we do not ask
                  for email addresses in order to simplify the log in process
                  and maintain the anynomity of users.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Account-less Features</div>
                <div className="font-light">
                  While it is highly recommended to create an account, users can
                  still enjoy some features of The Film Atlas without one. These
                  features include browsing films in Discovery mode on the Map
                  Page, looking up details from a film or director, and viewing
                  the filmography of a director or actor.
                </div>
              </div>
            </div>
            {/* <div className="border-1 h-[1px] w-[80%] self-center mt-5"></div> */}
          </section>

          {/* Getting started - At a glance*/}
          <section className="flex flex-col p-5 gap-10 mb-20">
            <div className="uppercase flex flex-col gap-2">
              <div className="guide-sectionCategory">Getting started</div>
              <div className="guide-sectionTitle">AT A GLANCE</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div
                  className="guide-subtitle hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/maps")
                  }}>
                  Map
                </div>
                <div className="font-light">
                  Once users start adding films to their watched list, their map
                  will be colored based on the corresponding origin countries of
                  the watched films.
                </div>
                <img
                  src="/mapexample1.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="guide-img"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="guide-subtitle hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/films")
                  }}>
                  Films
                </div>
                <div className="font-light">
                  Automatically, collections of films (watched, watchlist,
                  rated) will also appear on the{" "}
                  <span
                    className="text-blue-800"
                    onClick={() => {
                      navigate("/films")
                    }}>
                    FILMS
                  </span>{" "}
                  main page, which can be sorted and displayed in several ways.
                </div>
                <img
                  src="/filmsexample1.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="guide-img"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="guide-subtitle hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/directors")
                  }}>
                  Directors
                </div>
                <div className="font-light">
                  A list of directors whose films users have watched will also
                  be formed.
                </div>
                <img
                  src="/directorsexample1.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="guide-img"
                />
              </div>
            </div>
          </section>

          {/* Feature highlights - MAP page*/}
          <section className="flex flex-col p-5 gap-10 mb-20 font-light">
            <div className="uppercase flex flex-col gap-2">
              <div className="guide-sectionCategory">Feature Highlights</div>
              <div className="guide-sectionTitle">MAP PAGE</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Select A Region</div>
                <div className="">
                  Clicking on a country will trigger a small popup window
                  displaying how many films you've seen from that country. More
                  importantly, this action will also set the target country for
                  other features, such as discovering films or viewing films
                  you've watched from that country. If an invalid region is
                  clicked on (e.g. Atlantic Ocean), no films data will be
                  available for that region. By default, the map page will
                  display "Select Region" for first time visitors, as no region
                  has been selected on the map.
                </div>
                <img
                  src="/map1.png"
                  alt="Image of a popup container displaying how many films user has watched from selected country."
                  className="guide-img"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Discover Mode</div>
                <div className="font-light">
                  In Discover Mode, you will be able to view a list of films
                  from your currently selected country. This list is provided
                  via an API call to{" "}
                  <a
                    href="https://www.themoviedb.org/?language=en-US"
                    className="text-blue-800">
                    The Movie Database
                  </a>{" "}
                  (TMDB), and currently we include three sort options:
                </div>
                <ul className="guide-list">
                  <li className="">
                    <span>
                      <GoSquareFill className="text-lg inline mb-1" />
                      &nbsp;<span className="font-bold">RANDOM:</span> films
                      will be shuffled in an arbitrary order.
                    </span>
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;<span className="font-bold">AVG. RATING:</span> films
                    with the highest average rating (according to TMDB records)
                    will appear first.
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;<span className="font-bold">VOTE COUNT:</span> films
                    with the highest vote count (according to TMDB records) will
                    appear first.
                  </li>
                </ul>
                <img
                  src="/map4.png"
                  alt="Discover Mode with three sort options: Random, Average Rating, and Vote Count."
                  className="guide-img"
                />
              </div>

              <div className="flex flex-col gap-2 font-light">
                <div className="guide-subtitle">Filter Console</div>
                <div className="">
                  By default, the Filter sliders are set to filter out films
                  that are rated below 7 and has less than 100 votes. We highly
                  recommend users to adjust these values for different
                  countries, as{" "}
                  <span className="text-blue-800 inline">voting biases</span>{" "}
                  may be present within the database that we use.
                </div>
                <img
                  src="/map2.png"
                  alt="Showing films from Iran that has average rating
                  greater than or equal to 5.8, vote count greater than or equal
                  to 80, with highest-rated films being displayed first."
                  className="guide-img"
                />
                <div className="italic">
                  Example: Showing films from Iran that has average rating
                  greater than or equal to 5.8, vote count greater than or equal
                  to 80, with highest-rated films being displayed first.{" "}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Watched/Rated Films</div>
                <div className="">
                  On the Map page, users are also able to view films they've
                  watched or rated that belongs to a selected country on the
                  map. For more details refer to the Films console.
                </div>
              </div>
            </div>
          </section>

          {/* Feature highlights - FILMS page*/}
          <section className="flex flex-col p-5 gap-10 mb-20 font-light">
            <div className="uppercase flex flex-col gap-2">
              <div className="guide-sectionCategory">Feature Highlights</div>
              <div className="guide-sectionTitle">FILMS PAGE</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Films Console</div>
                <div className="">
                  With the Films console, you can view films that you've
                  watched, rated, or added to a watchlist. Films in the Watched
                  or Watchlist collection can be sorted by how recently they
                  were added, or by their release year. An additional 'rating'
                  filter can be applied to films in the Rated collection. Refer
                  to{" "}
                  <span className="text-blue-800 cursor-pointer">
                    this section
                  </span>{" "}
                  for more details on the rating system.
                </div>
                <img
                  src="/films3.png"
                  alt="Image of films console."
                  className="guide-img"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Search Bar (Films)</div>
                <div className="">
                  This search bar allows you to search for a film by its title.
                  When you are actively typing, the page will enter Search mode,
                  which automatically hides the films console (see above). In
                  order to exit Search mode and view the console again, simply
                  clear the search bar. Note that you can only search for films
                  with this search bar. Use the{" "}
                  <span className="text-blue-800 cursor-pointer">
                    director page's search bar
                  </span>{" "}
                  if you want to search for directors instead.
                </div>
                <img
                  src="/films1.png"
                  alt="Image of Films Page when search bar is being actively used."
                  className="guide-img"
                />
              </div>
            </div>
          </section>

          {/* Feature highlights - DIRECTORS page*/}
          <section className="flex flex-col p-5 gap-10 mb-20 font-light">
            <div className="uppercase flex flex-col gap-2">
              <div className="guide-sectionCategory">Feature Highlights</div>
              <div className="guide-sectionTitle">DIRECTORS PAGE</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Directors Console</div>
                <div className="">
                  The Directors console differs from the Films console in that
                  you will always be looking at a comprehensive list of the
                  directors you've watched without any filter options. However,
                  the sorting options give you a convenient way to index these
                  directors and rearrange them in several ways:
                </div>
                <img
                  src="/directors1.png"
                  alt="Image of directors console."
                  className="guide-img"
                />
                <ul className="guide-list">
                  <li className="">
                    <span>
                      <GoSquareFill className="text-lg inline mb-1" />
                      &nbsp;<span className="font-bold">NAME:</span> Directors
                      can be arranged in alphabetical or reverse alphabetical
                      order. Note that our system uses the first word in a
                      director's full name for sorting, as TMDB does not have
                      separate fields for first and last names.
                    </span>
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;<span className="font-bold">SCORE:</span> Directors
                    can be arranged in descending or ascending order of their
                    assigned score (1-10) based on the user's interactions.
                    Refer to{" "}
                    <span className="text-blue-800 cursor-pointer">
                      this section
                    </span>{" "}
                    for more details on our directors scoring system.
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;
                    <span className="font-bold">STARS:</span> Directors can be
                    arranged in descending or ascending order of the highest
                    star they've received from the user for a film (0-3). Refer
                    to{" "}
                    <span className="text-blue-800 cursor-pointer">
                      this section
                    </span>{" "}
                    for more details on our films starring system.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Search Bar (Directors)</div>
                <div className="">
                  This search bar allows you to search for a director by their
                  name. Most times, you will need to spell the director's full
                  name correctly for the desired result to show up. This happens
                  because we are directly querrying for results from TMDB, and
                  their search algorithm for cast and crew are rather limited
                  for an API request.
                </div>
                <img
                  src="/directors2.png"
                  alt="Directors search result for Kelly Rei."
                  className="guide-img"
                />
                <div>
                  Similar to the search bar for films, you can start typing to
                  enter Search mode, and simply clear the search bar to exit it.
                  Note that you can only search for directors with this search
                  bar. Use the{" "}
                  <span className="text-blue-800 cursor-pointer">
                    film page's search bar
                  </span>{" "}
                  if you want to search for films instead.
                </div>
              </div>
            </div>
          </section>

          {/* Curation system - Stars*/}
          <section className="flex flex-col p-5 gap-10 mb-20 font-light">
            <div className="uppercase flex flex-col gap-2">
              <div className="guide-sectionCategory">Curation system</div>
              <div className="guide-sectionTitle">STARS (FILMS)</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Rating A Film</div>
                <div className="">
                  You can rate a film by giving it either 1, 2, or 3 stars. A
                  useful guide would be to think of it in terms of Michelin
                  stars. In order for a restaurant to get just one star, it must
                  have been delivering distinctly rich flavors and creating a
                  wonderful culinary experience for its customers. In this line
                  of thought, one can watch a lot of films throughout their
                  lifetime, butreserve the stars only for films they consider
                  most impactful among their cinematic experiences. The
                  requirement for each star is entirely left to the user's
                  imagination, but below is an example:
                </div>
                <ul className="guide-list italic">
                  <li className="">
                    <span>
                      <span className={`text-pink-600 text-3xl inline mr-1`}>
                        &#10048;
                      </span>
                      &nbsp;"Tastefully done, humane in meaning, wonderful cast
                      and crew work, left lingering emotions within the viewer
                      and provoked long-lasting reflections."
                    </span>
                  </li>
                  <li className="">
                    <span>
                      <span className={`text-pink-600 text-3xl inline mr-1`}>
                        &#10048;&#10048;
                      </span>
                      &nbsp;"Extremely well conceived and executed, smoothly
                      presented themes worthy of deep introspection, excellent
                      production quality, instilled in viewer strong convictions
                      for the story being told."
                    </span>
                  </li>
                  <li className="">
                    <span>
                      <span className={`text-pink-600 text-3xl inline mr-1`}>
                        &#10048;&#10048;&#10048;
                      </span>
                      &nbsp;"A phenomenal cinematic experience that shaped
                      worldviews, masterfully created in every aspect of
                      production, creative and boundary-defining, to be thought
                      of and referenced by viewer as a work that has informed,
                      if not defined their taste in films."
                    </span>
                  </li>
                </ul>
                <img
                  src="/rating1.png"
                  alt="Image of the rating console."
                  className="guide-img"
                />
                <div className="">
                  Our team has decided on a 3-star rating system for the
                  following reasons:
                </div>
                <ul className="guide-list">
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;{" "}
                    <span className="font-bold">HANDLES NEUTRALITY:</span> It is
                    common in our psychology that neutral actions accompany
                    neutral feelings (which in most cases translates to 'doing
                    nothing'), whereas strong feelings call for a change in the
                    status quo. This rating system tries to mimic the same
                    behavior. Most of us wouldn't go out of our way to rate a
                    film 3/10. But if we experienced a memorable film, why not
                    encapsulate those emotions with a star encoded with personal
                    meanings?
                  </li>
                  <li className="">
                    <span>
                      <GoSquareFill className="text-lg inline mb-1" />
                      &nbsp;
                      <span className="font-bold">
                        REDUCED GRANULARITY:
                      </span>{" "}
                      Rating systems on a scale of 10 or 5 can be too granular
                      for curatorial purposes. For example, it will be quite
                      challenging to consistently distinguish between a 5/10
                      (2.5/5) and 6/10 (3/5) film--and there are little usage to
                      this categorization even if one manages to do it well.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Watched Vs. Rated</div>
                <div className="">
                  The Rated collection is a subset of the Watched collection. In
                  other words, users can mark a film as watched without rating
                  it, but any film that is rated will automatically be marked as
                  watched. Unrating a rated film will not affect its watched
                  status. Also note that films cannot be in the Rated/Watched
                  and Watchlist collections at the same time.
                </div>
                <img
                  src="/consoledemo.gif"
                  alt="Directors search result for Kelly Rei."
                  className="guide-img"
                />
              </div>
            </div>
          </section>

          {/* Curation system - Stars*/}
          <section className="flex flex-col p-5 gap-10 mb-20 font-light">
            <div className="uppercase flex flex-col gap-2">
              <div className="guide-sectionCategory">Curation system</div>
              <div className="guide-sectionTitle">SCORE (DIRECTORS)</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">
                  Calculating Score For Directors
                </div>
                <div className="">
                  You can rate a film by giving it either 1, 2, or 3 stars. A
                  useful guide would be to think of it in terms of Michelin
                  stars. In order for a restaurant to get just one star, it must
                  have been delivering distinctly rich flavors and creating a
                  wonderful culinary experience for its customers. In this line
                  of thought, one can watch a lot of films throughout their
                  lifetime, butreserve the stars only for films they consider
                  most impactful among their cinematic experiences. The
                  requirement for each star is entirely left to the user's
                  imagination, but below is an example:
                </div>
                <ul className="guide-list italic">
                  <li className="">
                    <span>
                      <span className={`text-pink-600 text-3xl inline mr-1`}>
                        &#10048;
                      </span>
                      &nbsp;"Tastefully done, humane in meaning, wonderful cast
                      and crew work, left lingering emotions within the viewer
                      and provoked long-lasting reflections."
                    </span>
                  </li>
                  <li className="">
                    <span>
                      <span className={`text-pink-600 text-3xl inline mr-1`}>
                        &#10048;&#10048;
                      </span>
                      &nbsp;"Extremely well conceived and executed, smoothly
                      presented themes worthy of deep introspection, excellent
                      production quality, instilled in viewer strong convictions
                      for the story being told."
                    </span>
                  </li>
                  <li className="">
                    <span>
                      <span className={`text-pink-600 text-3xl inline mr-1`}>
                        &#10048;&#10048;&#10048;
                      </span>
                      &nbsp;"A phenomenal cinematic experience that shaped
                      worldviews, masterfully created in every aspect of
                      production, creative and boundary-defining, to be thought
                      of and referenced by viewer as a work that has informed,
                      if not defined their taste in films."
                    </span>
                  </li>
                </ul>
                <img
                  src="/rating1.png"
                  alt="Image of the rating console."
                  className="guide-img"
                />
                <div className="">
                  Our team has decided on a 3-star rating system for the
                  following reasons:
                </div>
                <ul className="guide-list">
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;{" "}
                    <span className="font-bold">HANDLES NEUTRALITY:</span> It is
                    common in our psychology that neutral actions accompany
                    neutral feelings (which in most cases translates to 'doing
                    nothing'), whereas strong feelings call for a change in the
                    status quo. This rating system tries to mimic the same
                    behavior. Most of us wouldn't go out of our way to rate a
                    film 3/10. But if we experienced a memorable film, why not
                    encapsulate those emotions with a star encoded with personal
                    meanings?
                  </li>
                  <li className="">
                    <span>
                      <GoSquareFill className="text-lg inline mb-1" />
                      &nbsp;
                      <span className="font-bold">
                        REDUCED GRANULARITY:
                      </span>{" "}
                      Rating systems on a scale of 10 or 5 can be too granular
                      for curatorial purposes. For example, it will be quite
                      challenging to consistently distinguish between a 5/10
                      (2.5/5) and 6/10 (3/5) film--and there are little usage to
                      this categorization even if one manages to do it well.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <div className="guide-subtitle">Watched Vs. Rated</div>
                <div className="">
                  The Rated collection is a subset of the Watched collection. In
                  other words, users can mark a film as watched without rating
                  it, but any film that is rated will automatically be marked as
                  watched. Unrating a rated film will not affect its watched
                  status. Also note that films cannot be in the Rated/Watched
                  and Watchlist collections at the same time.
                </div>
                <img
                  src="/consoledemo.gif"
                  alt="Directors search result for Kelly Rei."
                  className="guide-img"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// For example,
//                   if the main demographics that vote for films on TMDB are from
//                   the United States, then films from the United States will tend
//                   to get significantly more votes than other regions. This means
//                   that average rating or vote count will have to be lowered for
//                   films from other regions for them to show up in Discover Mode.
