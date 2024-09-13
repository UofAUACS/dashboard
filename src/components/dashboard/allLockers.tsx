import { Locker } from "@/types"
import { useEffect, useState } from "react"
import { axiosInstance } from "@/requests"
import { User } from "firebase/auth"
import { auth } from "@/firebase"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

export default function AllLockers() {
    const [lockers, setLockers] = useState<Locker[]>([])
    const [user, setUser] = useState<User | null>(null)


    useEffect(() => {
        
        const getData = async () => {
            const token = await user?.getIdToken()
            const response = await axiosInstance.get('/lockers/get-all-lockers', {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            })
            // @ts-ignore
            const data: Locker[] = await response.data.lockers
            console.log(data)
            setLockers(data)
        }

        getData()

    }, [user])
    useEffect(() => {

        auth.onAuthStateChanged((user) => {
            setUser(user)
        })

    }, [])

    return (
        <div>
            <h2>
                
            </h2>
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-right">Locker No.</TableHead>
                    <TableHead className="">Combination</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="">Expiry</TableHead>
                    <TableHead className="">Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {lockers && lockers.length > 0 && lockers?.sort((l1:Locker, l2:Locker) => {
                    return l1.lockerNumber - l2.lockerNumber
                }).map((locker: Locker) => {
                    return (
                        <TableRow className={`${locker.ownerEmail? "" :"bg-green-100"}`}>
                            <TableCell className="text-right">{locker.lockerNumber}</TableCell>
                            <TableCell>{locker.combination}</TableCell>
                            <TableCell>{locker.ownerEmail}</TableCell>
                            <TableCell>{locker.status}</TableCell>
                            <TableCell>{locker.expiryDate} {locker.year}</TableCell>
                            <TableCell>{locker.notes}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
        </div>
    )
}