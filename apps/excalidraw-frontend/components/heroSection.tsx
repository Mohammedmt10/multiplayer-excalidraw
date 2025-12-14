import Link from "next/link"
import { Button } from "@repo/ui/button"
import Share from "@/icons/shareIcon"
import Users from "@/icons/usersIcon"

export default function HeroSection() {
  let token
    const userInfo = async () => {
      token = localStorage.getItem("token")
    }
    userInfo
    return <div className="font-display text-center pt-30">
      <div>
        <div className="text-6xl font-bold">
            Collaborative Excalidraw <br />
            <span className="text-green-700">Made Simple</span>
        </div>
        <div className="mt-2 text-black-500 text-md">
            create, collaborate, and share beautiful diagrams and sketches with our intutive <br />
            drawing tool.
        </div>
        {token && <div className="mt-10">
            <Link href={"/SignIn"}>
              <Button varient="primary" size="md" type="button">Sign In</Button>
            </Link>
            <Link href={"/SignUp"}>
              <Button varient="secondary" size="md" type="button">Sign Up</Button>
            </Link>
        </div>}
        {!token && <div className="mt-10">
            <Link href={"/Room/joinRoom"}>
              <Button varient="primary" size="md" type="button">Join Room</Button>
            </Link>
            <Link href={"/Room/createRoom"}>
              <Button varient="secondary" size="md" type="button">Create Room</Button>
            </Link>
        </div>}
      </div>
      <div>
        <div className="flex gap-5 justify-center mt-10 bg-green-100 py-20">
            <div className="border-2 w-fit max-w-12x0 p-4 rounded border-green-700">
              <div className="flex gap-3 text-lg items-center font-semibold">
                <Share /> Real-time Collaboration
              </div>
              <div className="mt-5 text-start text-black-400">
                Work with the team in real time. Share your drawing instantly with a simple task
              </div>
            </div>
            <div className="border-2 w-fit max-w-12x0 p-4 rounded border-green-700">
              <div className="flex gap-3 text-lg items-center font-semibold">
                <Users /> Multiplayer Editing
              </div>
              <div className="mt-5 text-start text-black-400">
                Multiplayer users can edit the same canvas simultaneously See who's drawing what in real-time
              </div>
            </div>
        </div>
      </div>
  </div>
}