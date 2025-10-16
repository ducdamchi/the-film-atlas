import UserFilmsTemplate from "./UserFilmsTemplate"

export default function Watchlist() {
  return (
    <>
      <UserFilmsTemplate queryString={`watchlist`} />
    </>
  )
}
