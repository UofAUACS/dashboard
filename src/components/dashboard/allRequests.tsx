import { useEffect, useState } from "react"
import {auth} from '../../firebase'
import { User } from "firebase/auth"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import type { Order } from "@/types"
import { axiosInstance } from "@/requests"
  

export default function AllOrders() {
    const [pendingOrders, setPendingOrders] = useState<Order[] | undefined>()
    const [user, setUser] = useState<User|null>(null)
    
    const updateOrders = (id: string) => {
        setPendingOrders(pendingOrders?.filter((order) => order.id !== id))
    }
    useEffect(() => {
        const getData = async () => {
            const token = await user?.getIdToken()
            const response = await axiosInstance.get('/orders/get-all-orders', {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            })
            // @ts-ignore
            const data:Order[] = await response.data.orders
            setPendingOrders(data)
        }

        getData()
    }, [user])

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user)
        })
    }, [])

    useEffect(() => {
        console.log(pendingOrders)
    }, [pendingOrders])
    return (
        <div className="ml-6">
            <h2>
                All Orders
            </h2>
            <div className="flex flex-row flex-wrap  mt-4">
                {pendingOrders && pendingOrders.length > 0 && pendingOrders?.map((order: Order) => {
                    return <Order order={order} key={order.id} updateOrder={updateOrders}/>
                })}
            </div>
        </div>
    )
}

const Order = ({order, updateOrder}: {order: Order, updateOrder: (id: string) => void}) => {
    const unixTimeZero = new Date(order.created_at);
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-200'
            case 'approved':
                return 'bg-green-200'
            case 'rejected':
                return 'bg-red-200'
            default:
                return 'bg-gray-200'
        }
    }
    return (
        <Card className="w-[300px] md:w-[450px] m-2">
            <CardHeader>
                <CardTitle>Locker Number {order.locker_id}</CardTitle>
                <CardDescription>{order.user_email}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Date Created: {unixTimeZero.toLocaleString("en-US", {dateStyle: "medium", timeStyle: "short"})}</p>
                <p>Transaction ID: {order.transaction_id}</p>
                <p>Expiry: {order.expiry} {order.year}</p>
                <p>Status: <span className={`px-1 rounded-sm ${getStatusColor(order.status)}`}>{order.status}</span></p>
            </CardContent>
        </Card>
    )
}