import { Button } from "@repo/ui/button"
import Image from "next/image"
import product from "@/images/product.png"
import toolBar from "@/images/toolBar.png"
import Link from "next/link"

export default function HeroSection() {
    return <div className="text-textColor px-18 w-full py-2 mb-14 flex justify-between items-center">
        <div className="max-w-120 flex flex-col gap-8">
            <div className="text-6xl font-bold font-heading leading-14">
                Collaborative
                Whiteboard
            </div>
            <div className="font-semibold font-titillium text-2xl">
                A simple, real-time whiteboard for drawing, planning, and explaining ideas together.
            </div>
            <div className="text-xl">
                Create rooms, invite others, and watch ideas come alive on a shared canvas.
            <div className="mt-6 pr-10 w-full font-heading font-semibold">
                <Link href={'/room'}>
                    <Button varient="primary" size="lg" type="button">
                        Join Room
                    </Button>
                </Link>
            </div>
            </div>
        </div>
        <div className="text-center">
            <div className="mb-8">
                <Image src={product} className="rounded-lg h-full aspect-video w-180 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" alt="" />
            </div>
            <div  className="px-30">
                <Image src={toolBar} className="w-full rounded-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" alt="" />
            </div>
        </div>
    </div>
}