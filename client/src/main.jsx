import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient , QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import About from './pages/About.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import MainLayout from "./layout/MainLayout.jsx"
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/700.css';
import Complaint from './pages/Complaint.jsx'
import ViewComplaints from './pages/ViewComplaints.jsx'


const queryClient=new QueryClient();


const router=createBrowserRouter([
  {path:"/",element:<MainLayout/>,
    children:[
      {path:"/",element:<Home/>},
      {path:"/about",element:<About/>},
      {path:"/leaderboard",element:<Leaderboard/>},
      {path:"/complaints",element:<Complaint/>},
      {path:"/viewcomplaints",element:<ViewComplaints/>},
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <RouterProvider router={router}  />
    </QueryClientProvider >
  </StrictMode>,
)
