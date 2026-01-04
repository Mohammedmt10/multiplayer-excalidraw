import GitHub from "@/icons/gitHub";
import LinkedIn from "@/icons/linkedIn";
import Mail from "@/icons/mail";
import Phone from "@/icons/phone";

export default function Footer() {
    return <div className="bg-footerBg p-10 px-15 pr-25 font-rajdhani text-white flex justify-between">
        <div>
            <div className="text-xl font-bold py-2">
                Contact Us
            </div>
            <div className="flex items-center py-1 gap-4">
                <Phone />
                +91 9405363858
            </div>
            <div className="flex items-center py-1 gap-4">
                <Mail />
                mtajir903@gmail.com
            </div>
        </div>
        <div>
            <div className="text-xl font-bold py-2">
                Links
            </div>
            <div className="flex items-center py-1 gap-4">
                <GitHub />
                GitHub
            </div>
            <div className="flex items-center py-1 gap-4">
                <LinkedIn />
                LinkedIn
            </div>
        </div>
    </div>
}