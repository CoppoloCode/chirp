import type { PropsWithChildren } from "react";

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
            <div className="md:w-1/4 p-2">
                 {props.children}
            </div>
        );

};

export const RightLayout = (props: PropsWithChildren) => {
    return (
            <div className="md:w-1/4 p-2 ">
               
            </div>
        );

};