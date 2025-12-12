import Link from "next/link"

export default function HeroSection() {
    return <div className="font-display text-center">
      <div>
        <div className="text-6xl font-bold mt-30">
            Collaborative Excalidraw <br />
            <span className="text-blue-700">Made Simple</span>
        </div>
        <div className="mt-2 text-neutral-500 text-md">
            create, collaborate, and share beautiful diagrams and sketches with our intutive <br />
            drawing tool.
        </div>
        <div className="mt-10">
            <Link href={"/SignIn"} className="bg-blue-700 text-white text-xl px-8 py-2 rounded mx-10 cursor-pointer">
                Sign In
            </Link>
            <Link href={"/SignUp"} className="text-blue-700 bg-neutral-200 text-xl px-8 py-2 rounded cursor-pointer">
                Sign Up
            </Link>
        </div>
      </div>
      <div>
        <div>

        </div>
      </div>
  </div>
}