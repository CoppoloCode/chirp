import { useUser } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHouse, faPeopleGroup, faPerson} from "@fortawesome/free-solid-svg-icons";

export const MainLayout = (props: PropsWithChildren) => {
    return (
            <main className="flex w-screen md:w-1/3 h-screen">
                <div className="h-full w-full overflow-y-scroll border-x border-slate-400">
                    {props.children}
                </div>
            </main>
        );

};

export const LeftLayout = () => {
    const {isSignedIn} = useUser();
    return (
            <div className="flex flex-col md:w-1/4 p-2 justify-between items-center mt-16">
                {isSignedIn && <CreateNavigationWizard/>}
                {isSignedIn && <CreateProfileWizard/>}
            </div>
        );

};

export const RightLayout = () => {
    const {isSignedIn} = useUser();
    return (
            <div className="flex flex-col md:w-1/4 p-2 justify-between items-center mt-16 ">
               {isSignedIn && <CreateFollowingWizard/>}
            </div>
        );

};


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
    const name = user.username ? user.username : user.firstName + " " + user.lastName;

    return (
        <div className="flex flex-col gap-4 text-2xl">
            <Link className="flex items-center gap-3 p-2 justify-center bg-slate-600 bg-opacity-0 transition duration-500 ease-in-out hover:bg-opacity-50 rounded-full"href={`/`}><FontAwesomeIcon className="w-5 h-5" icon={faHouse} />Home</Link>
            <Link className="flex items-center gap-3 p-2 justify-center bg-slate-600 bg-opacity-0 transition duration-500 ease-in-out hover:bg-opacity-50 rounded-full"href={`/@${name}`}><FontAwesomeIcon className="w-5 h-5" icon={faPerson} />Profile</Link>
        </div>
    )


  }

  const CreateFollowingWizard = () =>{

    return (<div className="bg-slate-600 bg-opacity-50 rounded-lg p-2 h-96 w-80">
                <h1 className="flex items-center justify-center gap-2 text-3xl"><FontAwesomeIcon icon={faPeopleGroup} className="w-8 h-8"/>Following</h1>
                <div className="flex flex-col max-h-80 overflow-y-scroll">
                    
                </div>
            </div>)

  }