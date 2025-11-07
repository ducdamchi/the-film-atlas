import { useContext, useEffect } from "react"
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { AuthContext } from "../../Utils/authContext"
import { BiSearchAlt2 } from "react-icons/bi"

export default function NavBar() {
  const { authState, setAuthState, searchModalOpen, setSearchModalOpen } =
    useContext(AuthContext)

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

  const logOut = () => {
    localStorage.removeItem("accessToken")
    setAuthState({ username: "", id: 0, status: false })
  }

  return (
    <div className="flex items-center justify-between w-full p-3 pl-[2rem] pr-[2rem] h-[4rem]">
      <div className="flex items-center justify-center gap-7">
        <div className="h-full flex items-center justify-center pt-1">
          <span className="text-md uppercase font-semibold ">
            The Film Atlas
          </span>
        </div>

        <div className="text-sm h-full mt-1 flex items-center gap-5">
          <ul className="flex gap-7 p-2 ">
            {/* <CustomLink to="/">Search</CustomLink> */}

            {!authState.status ? (
              <>
                <CustomLink to="/map">MAP</CustomLink>
                <CustomLink to="/" exact={true}>
                  FILMS
                </CustomLink>
                <CustomLink to="/directors">DIRECTORS</CustomLink>
              </>
            ) : (
              <>
                <CustomLink to="/map">MAP</CustomLink>
                <CustomLink to="/">FILMS</CustomLink>
                <CustomLink to="/directors">DIRECTORS</CustomLink>
              </>
            )}
          </ul>
          <button
            className="flex items-center justify-center gap-1 border-0 p-1 pl-2 pr-2 rounded-full bg-gray-200 text-gray-600 cursor-pointer"
            onClick={() => {
              setSearchModalOpen(true)
            }}>
            <BiSearchAlt2 />
            {`\u2318K`}
          </button>
        </div>
      </div>

      {authState.status ? (
        <div className="flex items-center justify-end gap-2">
          <div className="text-black text-sm h-full flex items-center justify-center">
            <span>welcome,&nbsp;</span>
            <span className="font-bold">{`${authState.username}!`}</span>
          </div>
          <div className="font-thin text-black text-base ">|</div>
          <button className="text-black text-sm" onClick={logOut}>
            log out
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-2">
          <CustomLink className="text-black text-sm" to="/login">
            log in
          </CustomLink>
          <div className="font-thin text-black text-base ">|</div>
          <CustomLink className="text-black text-sm" to="/register">
            register
          </CustomLink>
        </div>
      )}
    </div>
  )
}
