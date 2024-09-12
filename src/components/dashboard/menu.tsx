import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from '../../firebase';
import { useEffect, useState } from "react"
// @ts-ignore
export default function Menu({setDashboard}) {
    const [user, setUser] = useState<User | null>()
    const handleAuth = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        // @ts-ignore
        setUser(result.user);
      }
    
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user)
        })
    }, [])
    return (
        <NavigationMenu className="text-lg mt-5 mx-5">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm">Lockers</NavigationMenuTrigger>
                        <NavigationMenuContent>
                        <ul className="grid w-[100px] gap-3 p-4 md:w-[200px] md:grid-cols-2 lg:w-[250px] ">
                            <li>
                                <NavigationMenuLink className="text-sm hover:cursor-pointer" onClick={() => setDashboard("all-lockers")}>All Lockers</NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink className="text-sm hover:cursor-pointer" onClick={() => setDashboard("pending-orders")}>Pending Orders</NavigationMenuLink>
                            </li>
                        </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-sm">Elections</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-sm ml-5 rounded-md bg-green-100 p-2 text-center">{user? user.displayName: <button className="bg-green-100 rounded-md" onClick={handleAuth}>Sign In</button>}</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
    )
}