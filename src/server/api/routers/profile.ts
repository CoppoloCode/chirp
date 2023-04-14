
import {clerkClient} from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";


export const profileRouter = createTRPCRouter({
 

    getUserById: publicProcedure.input(z.object({userId: z.string()})).query(async ({input}) =>{

        
        const user = await clerkClient.users.getUser(input.userId);


        if(!user){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found",
            });

        }

        return filterUserForClient(user);



    }),

    getFollowers: publicProcedure.input(z.object({userId: z.string()})).query(async ({ctx, input}) =>{

        const followers = await ctx.prisma.following.findMany({
            where:{
                follower: input.userId
            },
            take: 100,
            orderBy: [{follower: "desc"}],
        })

        return followers;
    }),

    getFollowerProfiles: publicProcedure.input(z.object({userIds: z.array(z.string())})).query(async ({ctx,input}) =>{

        const userData = await clerkClient.users.getUserList();
        const userProfiles = userData.map((user) => {return filterUserForClient(user)});
        return userProfiles;

    }),

   

});
