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

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  
import type { Order } from "@/types"
import { axiosInstance } from "@/requests"
  

export default function PendingLockers() {
    const [pendingOrders, setPendingOrders] = useState<Order[] | undefined>()
    const [user, setUser] = useState<User|null>(null)
    
    const updateOrders = (id: string) => {
        setPendingOrders(pendingOrders?.filter((order) => order.id !== id))
    }
    useEffect(() => {
        const getData = async () => {
            const token = await user?.getIdToken()
            const response = await axiosInstance.get('/orders/get-all-pending-orders', {
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
                Pending Orders
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
    const [note, setNote] = useState<string>('')
    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value)
    }
    const approveOrder = async () => {
        const token = await auth.currentUser?.getIdToken()
        const res = await axiosInstance.post(`/orders/approve-order?order_id=${order.id}`, {
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
    const rejectOrder = async (send_email: boolean) => {
        const token = await auth.currentUser?.getIdToken()
        const res = await axiosInstance.post(`/orders/reject-order?order_id=${order.id}&email=${send_email}`, {
            order_id: order.id,
            note: note
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
                <Popover>
                    <PopoverTrigger className="bg-white p-0">
                        <button className="bg-red-500 text-white p-2 rounded-md w-20">Reject</button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="flex flex-col space-y-2 p-2">
                            <p>Are you sure you want to reject this request?</p>
                            <input type="text" placeholder="Reason for rejection" className="p-2 rounded-md border" onChange={handleNoteChange}/>
                            <button className=" text-white p-2 rounded-md" onClick={() => rejectOrder(false)}>Reject without email</button>
                            <button className=" text-white p-2 rounded-md" onClick={() => rejectOrder(true)}>Reject with email</button>
                        </div>
                    </PopoverContent>
                </Popover>
            </CardFooter>
        </Card>
    )
}