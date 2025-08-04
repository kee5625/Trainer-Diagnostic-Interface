// src/components/generic/Card.jsx
import { useNavigate } from 'react-router-dom';

export default function Card({ route, imageUrl, title, description }) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(route)}
      className="rounded-xl mx-auto shadow-xl bg-cover bg-no-repeat bg-top
                 max-h-[500px] relative border-8 border-black transform duration-500
                 hover:-translate-y-6 group"
      style={{ backgroundImage: `url('${imageUrl}')` }}
    >
      <div className="bg-black relative h-full bg-opacity-65 group-hover:bg-opacity-0 max-h-[500px] flex flex-wrap flex-col pt-[21rem] hover:bg-opacity-75 transform duration-300">
        <div className="bg-black p-8 h-full justify-end flex flex-col">
          <h1 className="text-white mt-2 text-xl mb-5 transform  translate-y-20 uppercase group-hover:translate-y-0 duration-300 group-hover:text-orange-500">
            {title}
          </h1>
          <p className="opacity-0 text-white text-lg group-hover:opacity-80 transform duration-500">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
