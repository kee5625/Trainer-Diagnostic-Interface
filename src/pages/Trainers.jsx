import { useNavigate } from 'react-router-dom';

export function Trainers(){
    const navigate = useNavigate();

    return(
        <div className='row-start-2 flex justify-center flex-col'>
            <h1 className='flex justify-center items-center text-3xl font-semibold leading-none tracking-tight  text-white '>Choose your trainer:</h1>
            <div className="grid grid-cols-1 gap-5 list-none md:grid-cols-3 mt-8 max-w-5xl mx-auto" role="list">
                <Card route="power-seat" imageUrl="bg_power_seat.png" title="01⏤ Power Seat" description="Simulating power seat functions & controls" />
                <Card route="air-conditioner" imageUrl="bg_ac.png" title="02⏤ Air Conditioning" description="Demonstrating automotive diagnostics and simulations" />
                <Card route="wiper-washer" imageUrl="bg_wiper_washer.png" title="03⏤ Windshield Wiper" description="Running wiper simulations with accuracy" />   
            </div> 
        </div>
    )
}

function Card({route, imageUrl, title, description}){
    const navigate = useNavigate();
    return (
        <article 
            onClick={() => navigate(`/${route}`)}
            className="rounded-xl mx-auto shadow-xl bg-contain bg-no-repeat bg-top max-h-[500px] relative border-8 border-black transform duration-500 hover:-translate-y-6 group" 
            style={{backgroundImage: `url('/${imageUrl}')`}}>
            
            <div className="bg-black relative h-full bg-opacity-65 group-hover:bg-opacity-0 max-h-[500px] flex flex-wrap flex-col pt-[21rem] hover:bg-opacity-75 transform duration-300">
                <div className=" bg-black p-8 h-full justify-end flex flex-col">
                    <h1 className="text-white mt-2 text-xl mb-5 transform  translate-y-20 uppercase group-hover:translate-y-0 duration-300 group-hover:text-orange-500"> {title}  </h1>
                    <p className="opacity-0 text-white text-xl group-hover:opacity-80 transform duration-500 ">  {description} </p>
                </div>
            </div>
        </article>
    )
}