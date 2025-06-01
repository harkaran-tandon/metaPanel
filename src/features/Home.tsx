import { UserButton } from "@clerk/clerk-react"

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserButton />
      </div>
      <p>Welcome to the internal tool builder!</p>
    </div>
  )
}