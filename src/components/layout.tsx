import type { PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

export const MainLayout = (props: PropsWithChildren) => {
    return (
            <main className="flex w-screen md:w-1/3 h-screen">
                <div className="h-full w-full overflow-y-scroll border-x border-slate-400">
                    {props.children}
                </div>
            </main>
        );

};

export const LeftLayout = (props: PropsWithChildren) => {
    
    return (
            <div className="flex flex-col md:w-1/4 p-2 justify-between items-center mt-16">
                {props.children}
            </div>
        );

};

export const RightLayout = (props: PropsWithChildren) => {
    return (
            <div className="flex flex-col md:w-1/4 p-2 justify-between items-center mt-16 ">
              <div className="bg-slate-600 bg-opacity-50 rounded-lg p-2 h-96 w-80">
                <h1 className="flex items-center justify-center gap-2 text-3xl"><FontAwesomeIcon icon={faPeopleGroup} className="w-8 h-8"/>Following</h1>
                <div className="flex flex-col max-h-80 overflow-y-scroll">
                   {props.children}
                </div>
            </div>
               
            </div>
        );

};

