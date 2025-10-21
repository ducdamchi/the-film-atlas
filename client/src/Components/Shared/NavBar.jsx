import { useContext, useEffect } from "react"
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { AuthContext } from "../../Utils/authContext"

export default function NavBar() {
  const { authState, setAuthState } = useContext(AuthContext)

  function CustomLink({ to, children, ...props }) {
    // to: URL path (e.g., "/about", "/contact")
    // children: Content inside the link (text, icons, etc.)
    // ...props: Any other props passed to the component (className, onClick, etc.)
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
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
    <div>
      <ul className="flex gap-7 p-2 border-1">
        {/* <CustomLink to="/">Search</CustomLink> */}

        {!authState.status ? (
          <>
            <CustomLink to="/">HOME</CustomLink>
            <CustomLink to="/login">LOG IN</CustomLink>
            <CustomLink to="/register">REGISTER</CustomLink>
          </>
        ) : (
          <>
            <CustomLink to="/">HOME</CustomLink>
            <CustomLink to="/map">MAP</CustomLink>
            <CustomLink to="/watchlist">WATCHLIST</CustomLink>

            <button onClick={logOut}>LOG OUT</button>
          </>
        )}
      </ul>
    </div>
  )
}
