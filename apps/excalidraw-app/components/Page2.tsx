
import { Card } from "@repo/ui/card";
import Contacts from "@/icons/contacts";
import Pencil from "@/icons/pencil";
import LinkLogo from "@/icons/link";
import Folders from "@/icons/folders";
import Secure from "@/icons/secure";

export default function Page2() {
    return <div id="features" className="relative z-1 bg-linear-to-br from-gradientGreen to-gradientBlue">
        {/* <Image src={bgImage} className="absolute bg-center hidden sm:block w-full object-cover h-full opacity-20 -z-1" alt=""/> */}
        <div>
            <div className="text-shadow-[0_2px_4px_rgba(0,0,0,0.25)] text-3xl text-center font-bold py-6 font-heading text-textColor">
                Features
            </div>
            <div className="font-titillium flex flex-col gap-12 justify-center mt-4">
                <div className="flex justify-center">
                    <Card title="Real-Time Colaboration" icon={Contacts}>
                        Work together on the same canvas and see updates instantly. <br />
                        Every drawing action syncs live for all users
                    </Card>
                    <Card title="Simple Drawing Tools" icon={Pencil}>
                        Create rectangles, circles, lines, arrows, and text. <br />
                        Essential tools designed for quick visual thinking.
                    </Card>
                    <Card title="Shared Rooms" icon={LinkLogo}>
                        Create or join rooms to collaborate with others. <br />
                        Ideal for teams, classrooms, and group discussions.
                    </Card>
                </div>
                <div className="flex justify-center">
                    <Card title="Persistent Canvas State" icon={Folders}>
                        Previously drawn elements stay on the canvas. <br />
                        New users see the full drawing when they join.
                    </Card>
                    <Card title="Private & Secure Rooms" icon={Secure}>
                        Your canvas is visible only to room members. <br />
                        Collaborate safely in controlled shared spaces.
                    </Card>
                </div>
            </div>
        </div>
    </div>
}