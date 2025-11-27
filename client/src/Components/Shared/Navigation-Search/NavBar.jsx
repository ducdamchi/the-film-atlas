import { useContext, useState, useRef, useEffect } from "react"
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Utils/authContext"
import { BiSearchAlt2, BiMenu, BiSolidMessageRoundedDots } from "react-icons/bi"
import { MdClose, MdMenu, MdOutlineSettings, MdSearch } from "react-icons/md"
import { TbArrowBigRightLinesFilled } from "react-icons/tb"

import { usePersistedState } from "../../../Hooks/usePersistedState"

export default function NavBar() {
  const { authState, setAuthState, searchModalOpen, setSearchModalOpen } =
    useContext(AuthContext)

  const [menuOpened, setMenuOpened] = usePersistedState(
    "navbar-menuOpened",
    false
  )

  const [laptopMenuOpened, setLaptopMenuOpened] = usePersistedState(
    "navbar-laptopMenuOpened",
    false
  )

  const [settingsOpened, setSettingsOpened] = usePersistedState(
    "navbar-settingsOpened",
    false
  )
  const menuRef = useRef(null)
  const menuBorderBottom = useRef(null)
  const menuBorderRight = useRef(null)
  const laptopMenuRef = useRef(null)
  const laptopMenuBorderBottom = useRef(null)
  const laptopMenuBorderRight = useRef(null)
  const settingsRef = useRef(null)
  const settingsBorderBottom = useRef(null)
  const settingsBorderRight = useRef(null)
  const navigate = useNavigate()

  //unit: rem
  const navbarHeight = 4.5
  const menuHeight = 9.5
  const laptopMenuHeight = 5
  const setttingsHeight_Authed = 2.5
  const setttingsHeight_Unauthed = 4.2
  const borderWidth = 0.3

  function CustomLink({ to, children, exact = true, ...props }) {
    // to: URL path (e.g., "/about", "/contact")
    // children: Content inside the link (text, icons, etc.)
    // ...props: Any other props passed to the component (className, onClick, etc.)
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: exact })
    return (
      <div
        className={
          isActive
            ? "underline decoration-solid decoration-2 underline-offset-4"
            : ""
        }>
        <Link to={to} {...props}>
          {children}
        </Link>
      </div>
    )
  }

  function animateMenu(
    menuState,
    menuRef,
    borderBottomRef,
    borderSideRef,
    translateXValue,
    translateYValue
  ) {
    if (menuRef.current && borderBottomRef.current && borderSideRef.current) {
      // console.log("Menu Opened: ", menuOpened)
      let timer1, timer2
      if (menuState) {
        menuRef.current.style.display = "flex"
        borderBottomRef.current.style.display = "block"
        borderSideRef.current.style.display = "block"
        timer1 = setTimeout(() => {
          menuRef.current.style.transform = "translateY(0px)"
        }, 400)

        timer2 = setTimeout(() => {
          borderBottomRef.current.style.transform = "translateY(0px)"
          borderSideRef.current.style.transform = "translateY(0px)"
        }, 200)
      } else {
        timer1 = setTimeout(() => {
          menuRef.current.style.transform = `translateX(${translateXValue}px)`
        }, 200)
        timer2 = setTimeout(() => {
          menuRef.current.style.display = "none"
          borderBottomRef.current.style.display = "none"
          borderSideRef.current.style.display = "none"
        }, 400)
        borderBottomRef.current.style.transform = `translateX(${translateXValue}px)`
        borderSideRef.current.style.transform = `translateY(${translateYValue}px)`
      }
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }

  const logOut = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("films-searchInput")
    localStorage.removeItem("films-isSearching")
    localStorage.removeItem("films-sortBy")
    localStorage.removeItem("films-sortDirection")
    localStorage.removeItem("films-numStars")
    localStorage.removeItem("films-queryString")
    localStorage.removeItem("films-scrollPosition")
    localStorage.removeItem("map-popupInfo")
    localStorage.removeItem("map-suggestedFilmList")
    localStorage.removeItem("map-sortBy")
    localStorage.removeItem("map-sortDirection")
    localStorage.removeItem("map-queryString")
    localStorage.removeItem("map-numStars")
    localStorage.removeItem("map-discoverBy")
    localStorage.removeItem("map-scrollPosition")
    localStorage.removeItem("map-ratingRange")
    localStorage.removeItem("map-tempRating")
    localStorage.removeItem("map-voteCountRange")
    localStorage.removeItem("map-tempVoteCount")
    localStorage.removeItem("directors-searchInput")
    localStorage.removeItem("directors-isSearching")
    localStorage.removeItem("directors-numStars")
    localStorage.removeItem("directors-sortBy")
    localStorage.removeItem("directors-sortDirection")
    localStorage.removeItem("directors-queryString")
    localStorage.removeItem("directors-scrollPosition")
    localStorage.removeItem("directorLanding-scrollPosition")
    localStorage.removeItem("navbar-menuOpened")
    localStorage.removeItem("navbar-settingsOpened")

    setAuthState({ username: "", id: 0, status: false })
    navigate("/login")
  }

  useEffect(() => {
    animateMenu(
      menuOpened,
      menuRef,
      menuBorderBottom,
      menuBorderRight,
      -500,
      -200
    )
  }, [menuOpened])

  // useEffect(() => {
  //   animateMenu(
  //     laptopMenuOpened,
  //     laptopMenuRef,
  //     laptopMenuBorderBottom,
  //     laptopMenuBorderRight,
  //     -500,
  //     -200
  //   )
  // }, [laptopMenuOpened])

  useEffect(() => {
    animateMenu(
      settingsOpened,
      settingsRef,
      settingsBorderBottom,
      settingsBorderRight,
      500,
      -200
    )
  }, [settingsOpened])

  return (
    <div
      className={`fixed top-0 left-0 font-primary flex items-center justify-between w-screen p-0 md:p-3 md:pl-[2rem] md:pr-[2rem] bg-black text-stone-200 border-b-[0.3rem] border-[#b8d5e5] z-100`}
      style={{ height: `${navbarHeight}rem` }}>
      {/* LEFT SIDE */}
      <div className="flex items-center justify-center gap-3 lg:gap-5 min-w-[12rem] ml-4">
        {/* MOBILE - APP NAME */}
        <div className="md:hidden h-full flex items-center justify-center pt-0 z-30">
          <button className="mr-2">
            {menuOpened ? (
              <MdClose
                className="text-xl mb-[2px]"
                onClick={() => setMenuOpened(false)}
              />
            ) : (
              <MdMenu
                className="text-xl mb-[2px]"
                onClick={() => setMenuOpened(true)}
              />
            )}
          </button>
          <span className="font-logo text-base uppercase font-black flex items-center justify-center p-1">
            The Film Atlas
          </span>
          <button
            className="flex items-center justify-center ml-2 p-[5px] pl-[10px] pr-[10px] rounded-full bg-stone-200 text-stone-900 cursor-pointer"
            onClick={() => {
              setSearchModalOpen(true)
            }}>
            <BiSearchAlt2 className="text-[10px]" />
          </button>
        </div>

        {/* MOBILE - HAMBURGER MENU CONTENT */}
        <div
          className={`hidden absolute z-20 left-0 bg-black border-[#b8d5e5] w-[50vw] pl-5 pb-5 pt- transition-all ease-out duration-200 font-light z-100`}
          style={{
            height: `${menuHeight}rem`,
            top: `${navbarHeight - borderWidth}rem`,
          }}
          ref={menuRef}>
          <ul className="flex flex-col gap-2 text-[13px]">
            <CustomLink
              to="/map"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              MAP
            </CustomLink>
            <CustomLink
              to="/films"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              FILMS
            </CustomLink>
            <CustomLink
              to="/directors"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              DIRECTORS
            </CustomLink>
            <CustomLink
              to="/about"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              ABOUT
            </CustomLink>
            <CustomLink
              to="/contact"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              CONTACT
            </CustomLink>
          </ul>
        </div>
        <div
          className={`hidden absolute left-0 bg-[#d5e5b8] z-20 transition-all ease-out duration-400`}
          style={{
            height: `${borderWidth}rem`,
            width: `calc(50vw + ${borderWidth}rem)`,
            top: `${navbarHeight + menuHeight - borderWidth}rem`,
          }}
          ref={menuBorderBottom}></div>
        <div
          className="hidden absolute w-[0.4rem] h-[6rem] left-[50vw] top-[3rem] bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
          style={{
            height: `${menuHeight}rem`,
            width: `${borderWidth}rem`,
            top: `${navbarHeight - borderWidth}rem`,
          }}
          ref={menuBorderRight}></div>

        {/* LAPTOP - APP NAME*/}
        <div className="hidden md:flex h-full items-center justify-center">
          {/* <button className="mr-2">
            {laptopMenuOpened ? (
              <MdClose
                className="text-2xl mb-0"
                onClick={() => setLaptopMenuOpened(false)}
              />
            ) : (
              <MdMenu
                className="text-2xl mb-0"
                onClick={() => setLaptopMenuOpened(true)}
              />
            )}
          </button> */}
          <span className="font-logo font-black uppercase text-lg lg:text-xl">
            The Film Atlas
          </span>
        </div>

        {/* LAPTOP - HAMBURGER MENU CONTENT */}
        {/* <div
          className={`hidden absolute z-20 left-0 bg-black border-[#b8d5e5] w-[50vw] pl-5 pb-5 pt- transition-all ease-out duration-200 font-light z-100`}
          style={{
            height: `${laptopMenuHeight}rem`,
            top: `${navbarHeight - borderWidth}rem`,
          }}
          ref={laptopMenuRef}>
          <ul className="flex flex-col gap-2 text-[13px]">
            <CustomLink
              to="/about"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setLaptopMenuOpened(false)
                setSettingsOpened(false)
              }}>
              ABOUT
            </CustomLink>
            <CustomLink
              to="/contact"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setLaptopMenuOpened(false)
                setSettingsOpened(false)
              }}>
              CONTACT
            </CustomLink>
          </ul>
        </div>
        <div
          className={`hidden absolute left-0 bg-[#d5e5b8] z-20 transition-all ease-out duration-400`}
          style={{
            height: `${borderWidth}rem`,
            width: `calc(50vw + ${borderWidth}rem)`,
            top: `${navbarHeight + laptopMenuHeight - borderWidth}rem`,
          }}
          ref={laptopMenuBorderBottom}></div>
        <div
          className="hidden absolute w-[0.4rem] h-[6rem] left-[50vw] top-[3rem] bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
          style={{
            height: `${laptopMenuHeight}rem`,
            width: `${borderWidth}rem`,
            top: `${navbarHeight - borderWidth}rem`,
          }}
          ref={laptopMenuBorderRight}></div> */}

        {/* LAPTOP - HORIZONTAL MENU */}
        <div className="hidden md:flex text-sm font-extralight flex h-full mt-1 items-center gap-2 lg:gap-5 pb-1">
          <ul className="flex gap-4 lg:gap-5 p-2">
            <CustomLink to="/map" exact={false}>
              MAP
            </CustomLink>
            <CustomLink to="/films" exact={false}>
              FILMS
            </CustomLink>
            <CustomLink to="/directors" exact={false}>
              DIRECTORS
            </CustomLink>
            <CustomLink to="/about" exact={false}>
              ABOUT
            </CustomLink>
            <CustomLink to="/contact" exact={false}>
              CONTACT
            </CustomLink>
          </ul>
          <button
            className="flex items-center justify-center gap-1 border-0 p-1 pl-2 pr-2 rounded-full bg-stone-200 text-gray-600 cursor-pointer"
            onClick={() => {
              setSearchModalOpen(true)
            }}>
            <BiSearchAlt2 />
            {`\u2318K`}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      {/* MOBILE - USER INFO / AUTH */}
      <div className="md:hidden flex items-center justify-end gap-1 mr-4 text-[13px] md:text-basez-100">
        {authState.status ? (
          <div>
            <div className="h-full flex items-center justify-center">
              <span className=" p-1 flex items-center justify-center font-light">{`${authState.username}`}</span>
            </div>
            <div
              className="hidden absolute z-20 right-0 bg-black border-[#b8d5e5] pl-5 pb-5 pt-2 transition-all ease-out duration-200 font-light justify-end items-center"
              style={{
                top: `${navbarHeight - borderWidth}rem`,
                width: `calc(50vw - ${borderWidth}rem)`,
                height: `${setttingsHeight_Authed}rem`,
              }}
              ref={settingsRef}>
              <button className="mr-5 gap-2 uppercase" onClick={logOut}>
                log out
              </button>
            </div>
            <div
              className="hidden absolute right-0 bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
              style={{
                width: `50vw`,
                height: `${borderWidth}rem`,
                top: `${navbarHeight + setttingsHeight_Authed - borderWidth}rem`,
              }}
              ref={settingsBorderBottom}></div>
            <div
              className="hidden absolute bg-[#d5e5b8] z-20 transition-all ease-out duration-400"
              style={{
                width: `${borderWidth}rem`,
                height: `${setttingsHeight_Authed}rem`,
                top: `${navbarHeight - borderWidth}rem`,
                left: "50vw",
              }}
              ref={settingsBorderRight}></div>
          </div>
        ) : (
          <div>
            <div
              className="absolute hidden z-20 right-0 bg-black border-[#b8d5e5]  pl-5 pb-5 pt-0 transition-all ease-out duration-200 font-light justify-end"
              style={{
                top: `${navbarHeight - borderWidth}rem`,
                width: `calc(50vw - ${borderWidth}rem)`,
                height: `${setttingsHeight_Unauthed}rem`,
              }}
              ref={settingsRef}>
              <ul className="flex flex-col text-right mr-5 md:mr-12 gap-2 uppercase">
                <CustomLink to="/login">log in</CustomLink>
                <CustomLink to="/register">register</CustomLink>
              </ul>
            </div>
            <div
              className="hidden absolute right-0 bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
              style={{
                width: `50vw`,
                height: `${borderWidth}rem`,
                top: `${navbarHeight + setttingsHeight_Unauthed - borderWidth}rem`,
              }}
              ref={settingsBorderBottom}></div>
            <div
              className="hidden absolute bg-[#d5e5b8] z-20 transition-all ease-out duration-400"
              style={{
                width: `${borderWidth}rem`,
                height: `${setttingsHeight_Unauthed}rem`,
                top: `${navbarHeight - borderWidth}rem`,
                left: "50vw",
              }}
              ref={settingsBorderRight}></div>
          </div>
        )}

        {!settingsOpened ? (
          <MdOutlineSettings
            className="text-xl mb-[2px]"
            onClick={() => setSettingsOpened(true)}
          />
        ) : (
          <MdClose
            className="text-xl mb-[2px]"
            onClick={() => setSettingsOpened(false)}
          />
        )}
      </div>

      {/* LAPTOP - USER INFO / AUTH */}
      {authState.status ? (
        <div className="hidden md:flex items-center justify-end gap-2 text-sm lg:text-base font-extralight">
          <div className="h-full flex items-center justify-center">
            <span>welcome,&nbsp;</span>
            <span className="font-bold">{`${authState.username}!`}</span>
          </div>
          <div className="font-thin text-base ">|</div>
          <button className="" onClick={logOut}>
            log out
          </button>
        </div>
      ) : (
        <div className="hidden md:flex flex items-center justify-end gap-2 text-base font-extralight">
          <CustomLink className="" to="/login">
            log in
          </CustomLink>
          <div className="">|</div>
          <CustomLink className="" to="/register">
            register
          </CustomLink>
        </div>
      )}
    </div>
  )
}
