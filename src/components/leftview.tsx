import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHouse, faPerson} from "@fortawesome/free-solid-svg-icons";


const CreateProfileWizard = () =>{

    const {user} = useUser();
    
    if(!user) return null;
    
  
    const [isHidden, setHidden] = useState(true);
    const name = user.username ? user.username : user.firstName + " " + user.lastName;
  
    return (<div className="flex flex-col items-center gap-2">
              <div className="flex-col border gap-2 border-white rounded-lg w-36 p-2" hidden={isHidden}>
                <div className="flex justify-end p-1">
                    <button onClick={()=>setHidden(!isHidden)}>X</button>
                </div>
                <div
                  className={`
                bg-black pointer-events-auto flex flex-col items-center`}>
                    <SignOutButton />
                </div>
              </div>
              <button onClick={() => {setHidden(!isHidden)}}>
                <div className="flex items-center p-2 gap-4 bg-slate-600 bg-opacity-0 transition duration-500 ease-in-out hover:bg-opacity-50 rounded-full">
                  <div className="flex items-center gap-3">
                    <Image src={user.profileImageUrl} alt="Profile image" className="h-12 w-12 rounded-full" width={56} height={56} />
                    <h1>{name}</h1>
                  </div>
                  <div>
                    • • •
                  </div>
                </div>
              </button>
            </div>);
    
  
  }
  
  const CreateNavigationWizard = () =>{
  
    const {user} = useUser();
    if(!user) return null;
  
    return (
        <div className="flex flex-col gap-4 text-2xl">
            <Link className="flex items-center gap-3 p-2 justify-center bg-slate-600 bg-opacity-0 transition duration-500 ease-in-out hover:bg-opacity-50 rounded-full"href={`/`}><FontAwesomeIcon className="w-5 h-5" icon={faHouse} />Home</Link>
            <Link className="flex items-center gap-3 p-2 justify-center bg-slate-600 bg-opacity-0 transition duration-500 ease-in-out hover:bg-opacity-50 rounded-full"href={`/@${user.id}`}><FontAwesomeIcon className="w-5 h-5" icon={faPerson} />Profile</Link>
        </div>
    )
  
  
  }

export const LeftView = () => {
    
    return (
       <>
        <CreateNavigationWizard/>
        <CreateProfileWizard/>
       </>
    )

}