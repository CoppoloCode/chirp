import type{ NextPage , GetStaticProps} from "next";
import Head from "next/head";
import Image from "next/image";
import { MainLayout, LeftLayout, RightLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { LoadingPage } from "~/components/loading";
import { useUser } from "@clerk/nextjs";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";




const ProfileFeed = (props: {userId: string}) => {
  

  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({userId: props.userId})
  const likedPosts = api.posts.getLikedPostByUserId.useQuery({userId: props.userId ?? ""})?.data;

  if(likedPosts){
    for(let i = 0; i < likedPosts?.length; i++){
      data?.find((post) =>{if(post.post.id === likedPosts[i]?.postId){post.isLiked = true}})
    }
  }

  if(isLoading) return <LoadingPage/>
  if(!data || data.length === 0) return <div>User has not posted.</div>

  return <div className="flex flex-col">
        {data.map((fullPost) => (<PostView {...fullPost}key={fullPost.post.id} />))}
  </div>
} 

const ProfilePage: NextPage <{username: string }> = ({username}) => {

    const {user} = useUser();
    let [isFollowing, setFollow] = useState(false);
    const ctx = api.useContext();
    const {data, isLoading: isDataLoading} = api.profile.getUserByUsername.useQuery({username, userId: user?.id ?? ""});
    const followData = api.posts.validateFollow.useQuery({userId: user?.id ?? "", profileId: data?.id ?? ""}).data;

    const {mutate: unfollow , isLoading: unfollowLoading} = api.posts.unfollow.useMutation({
      onSuccess: async ()=>{
        await ctx.posts.invalidate();
      },
      onError: (e)=>{
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if(errorMessage && errorMessage[0]){
          toast.error(errorMessage[0]);
        }else{
          toast.error("Failed to unfollow. Try again later");
        }
      }
  });

  const {mutate: follow, isLoading: followLoading} = api.posts.follow.useMutation({
    onSuccess: async ()=>{
        await ctx.posts.invalidate();
    },
    onError: (e)=>{
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0]);
      }else{
        toast.error("Failed to follow. Try again later");
      }
    }
    
  });

    if(!user) return null;
    
    if(followData && followData.length > 0){
      isFollowing = true;
    }
    
    
    if(isDataLoading) return <LoadingPage/>;

    if(!data) return <div className="flex flex-col w-full h-screen justify-center items-center">404</div>;
    

    
    let userName = user.username;
    if(!userName) userName = user.firstName + " " + user.lastName;


    

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <div className="flex justify-center">
        <LeftLayout/>
        <MainLayout>
          <div className="relative h-36 border-slate-400 bg-slate-600">
            <Image src={data.profileImageUrl} 
            alt={`${data.username ?? ""}'s profile pic`} 
            width={128} 
            height={128}
            className="-mb-[64px] absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black bg-black"
            />
          </div>
          <div className="h-[64px]"></div>
          <div className="flex justify-between p-4 text-2xl font-bold">
            {`@${data.username ?? ""}`}
            {data.username !== userName && !isFollowing && <button disabled={followLoading || unfollowLoading} className="p-2 bg-slate-600 bg-opacity-10 transition duration-500 ease-in-out hover:bg-opacity-50 rounded-full" onClick={() => {setFollow(true);follow({userId: user.id, profileId: data.id})}}>Follow</button>}
            {data.username !== userName && isFollowing && <button disabled={followLoading || unfollowLoading} className="text-black p-2 bg-slate-100 bg-opacity-100 transition duration-500 ease-in-out hover:bg-opacity-50 rounded-full hover:text-red-500 before:content-['Following'] hover:before:content-['Unfollow']" onClick={() => {setFollow(false); unfollow({userId: user.id, profileId: data.id})}}></button>}
            </div>
          <div className="w-full border-b border-slate-400"></div>
          <ProfileFeed userId={data.id}/>
        </MainLayout>
        <RightLayout/>
      </div>
    </>
  );
};



export const getStaticProps: GetStaticProps = async (context) =>{

  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if(typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");
  
  
  await ssg.profile.getUserByUsername.prefetch({username: username, userId: ""});
  
  return {
    props:{
      trpcState: ssg.dehydrate(),
      username
    },
  }

};

export const getStaticPaths = () =>{
  return {paths: [], fallback:"blocking"};
};


export default ProfilePage;
