import react from 'react';
import { Outlet } from 'react-router-dom';
import { MenuBar } from '../components/Menubar';
const Layout:react.FC=()=>{
    return(
        <div className='flex flex-row min-h-screen'>   
        <MenuBar></MenuBar>
        <div className='flex-1'>
            <Outlet></Outlet>
            </div>
    </div>
    )
}
export default Layout;