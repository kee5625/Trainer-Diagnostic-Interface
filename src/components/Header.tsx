import { useNavigate } from "react-router-dom"


export default function Header() {
    const navigate =useNavigate();

    return (
        <div className="flex flex-row items-center justify-center gap-5 p-6">
            <a href='https://www.atechtraining.com/' target='blank'><img src="../atechlogo.webp" className="w-32"/></a>
            <div className="flex items-center gap-10">
                <button onClick={() => navigate("/")} className="text-lg text-white">Home</button>
                <button onClick={() => navigate("/trainers")} className="text-lg text-white">Trainers</button>
                <button className="text-lg text-white">Help</button>
            </div>
        </div>
    )
}