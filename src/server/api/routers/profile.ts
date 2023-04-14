
import {clerkClient} from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";


export const profileRouter = createTRPCRouter({
 
    getUserByUsername: publicProcedure.input(z.object({username: z.string(), userId: z.string()})).query(async ({input}) =>{
        
        
        const [user] = await clerkClient.users.getUserList({
            username: [input.username],
        });

        if(!user){

            const user = await clerkClient.users.getUser(input.userId);

            if(!user){
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User not found",
                });

            }
        
            return filterUserForClient(user);
        }

        return filterUserForClient(user);
    }),

   

});
