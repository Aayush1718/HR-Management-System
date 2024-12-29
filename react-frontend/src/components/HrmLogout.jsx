import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function HrmLogout({children}) {
    const [error , setError] = useState(false)
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        const res = await axios.post('/api/v1/hrm/logout');
        console.log('logout successfully')
        navigate('/')
    } catch (error) {
        console.log(error);
        setError(true);
    }
  };

  return (
    <div>
      <header>
        <button onClick={handleLogout}
        className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >Logout</button>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default HrmLogout