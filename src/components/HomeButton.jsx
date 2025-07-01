// components/HomeButton.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { MdHome } from 'react-icons/md';
import { disconnectBle } from './bluetooth';

export default function HomeButton(){
    const navigate = useNavigate();
    const location = useLocation();

    if(location.pathname == '/') return null;

    return (
        <button
            onClick={() =>{
                navigate('/');
                disconnectBle();
            }}
            className='home-btn'
        >
        <MdHome size={30} aria-hidden />
        </button>
    );
}