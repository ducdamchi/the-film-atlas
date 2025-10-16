import UserFilmsTemplate from "./UserFilmsTemplate"

export default function Home() {
  return (
    <>
      <UserFilmsTemplate queryString={`liked-films`} />
    </>
  )
}
