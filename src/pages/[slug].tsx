import type{ NextPage , GetStaticProps} from "next";
import Head from "next/head";
import Image from "next/image";
import { MainLayout, LeftLayout, RightLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { LoadingPage } from "~/components/loading";
import {CreateProfileWizard} from "~/pages/index"
import { useUser } from "@clerk/nextjs";



const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({userId: props.userId})

  if(isLoading) return <LoadingPage/>
  if(!data || data.length === 0) return <div>User has not posted.</div>

  return <div className="flex flex-col">
        {data.map((fullPost) => (<PostView {...fullPost}key={fullPost.post.id} />))}
  </div>
} 

const ProfilePage: NextPage<{username: string}> = ({username}) => {

  const {isSignedIn} = useUser();

  
  const {data} = api.profile.getUserByUsername.useQuery({
    username,
  });
  
  if(!data) return <div className="flex flex-col w-full h-screen justify-center items-center">404</div>;
  

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <div className="flex justify-center">
        <LeftLayout>
            {isSignedIn && <CreateProfileWizard/>}
        </LeftLayout>
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
          <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
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

  await ssg.profile.getUserByUsername.prefetch({username});

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
