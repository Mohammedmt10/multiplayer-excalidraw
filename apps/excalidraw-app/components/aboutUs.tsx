import Footer from "./footer";

export default function AboutUs() {
    return <div className="bg-linear-to-tr pt-20 from-gradientGreen to-gradientBlue font-heading">
        <div id="aboutUs" className="text-center text-3xl font-bold text-textColor">
            About Us
        </div>
        <div className="text-center  px-100 font-medium py-5">
            We believe the strongest ideas begin visually and grow through collaboration. <br /> Our real-time whiteboard lets multiple users work together on a shared canvas, making brainstorming, design, and explanation seamless and engaging.
        </div>
        <div className="mt-10">
            <Footer />
        </div>
    </div>
}