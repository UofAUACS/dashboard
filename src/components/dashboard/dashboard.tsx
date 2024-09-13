import { useState } from "react";
import Menu from "./menu";
import AllLockers from "./allLockers";
import PendingLockers from "./pendingLockers";
import Elections from "./elections";
import AllOrders from "./allRequests";
  
export default function Dashboard() {
    const [dashboardComponent, setDashboardComponent] = useState('all-lockers')
    const setDashboard = (component: string) => {
        setDashboardComponent(component);
    }
    const renderComponent = () => {
        switch (dashboardComponent) {
            case 'all-lockers':
                return <AllLockers/>
            case 'pending-orders':
                return <PendingLockers/>
            case 'elections':
                return <Elections/>
            case 'all-orders':
                return <AllOrders/>
            default:
                return <AllLockers/>
        }
    }
    return (
        <div className='mt-5'>
            <h1 className='text-4xl font-bold ml-4'>Dashboard</h1>
            <Menu setDashboard = {setDashboard}/>
            <div className='mt-5'>
                {renderComponent()}
            </div>
        </div>
    )
}