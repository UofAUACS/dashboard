import axios from "axios"
import { useEffect, useState } from "react"
import {auth} from '../../firebase'
import { User } from "firebase/auth"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import type { Order } from "@/types"
  

export default function PendingLockers() {
    const [pendingOrders, setPendingOrders] = useState<Order[] | undefined>()
    const [user, setUser] = useState<User|null>(null)
    
    const updateOrders = (id: string) => {
        setPendingOrders(pendingOrders?.filter((order) => order.id !== id))
    }
    useEffect(() => {
        const getData = async () => {
            const token = await user?.getIdToken()
            const response = await axios.get('https://services.uacs.ca/orders/get-all-pending-orders', {
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
        <div className="w-screen ml-6">
            <h2>
                Pending Lockers
            </h2>
            <div className="flex flex-row flex-wrap  mt-4">
                {pendingOrders && pendingOrders.length > 0 && pendingOrders?.map((order: Order) => {
                    if (order && order.id && order.status === 'pending') {
                        return <Order order={order} key={order.id} updateOrder={updateOrders}/>
                    }
                })}
            </div>
        </div>
    )
}

const Order = ({order, updateOrder}: {order: Order, updateOrder: (id: string) => void}) => {
    const approveOrder = async () => {
        const token = await auth.currentUser?.getIdToken()
        const res = await axios.post(`https://services.uacs.ca/orders/approve-order?order_id=${order.id}`, {
            order_id: order.id
        }, {
            "headers": {
                "Authorization": `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            order.status = 'approved';
            updateOrder(order.id);
        }
    }
    const rejectOrder = async () => {
        const token = await auth.currentUser?.getIdToken()
        const res = await axios.post(`https://services.uacs.ca/orders/reject-order?order_id=${order.id}`, {
            order_id: order.id
        }, {
            "headers": {
                "Authorization": `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            order.status = 'rejected';
            updateOrder(order.id);
        }
    }
    const unixTimeZero = new Date(order.created_at);
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
            </CardContent>
            <CardFooter className="flex space-x-5">
                <button className="bg-green-500 text-white p-2 rounded-md w-20" onClick={approveOrder}>Approve</button>
                <button className="bg-red-500 text-white p-2 rounded-md w-20" onClick={rejectOrder}>Reject</button>
            </CardFooter>
        </Card>
    )
}