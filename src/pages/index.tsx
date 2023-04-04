import { type NextPage } from "next";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api"; 
import Image from "next/image";
import { LoadingPage, LoadingSpinner} from "~/components/loading";
import { useState } from "react";
import {toast } from "react-hot-toast";
import { MainLayout, LeftLayout, RightLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import Link from "next/link";


const CreatePostWizard = () => {
  const {user} = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();

  const{mutate , isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess: ()=>{
      setInput("");
      void ctx.posts.getAll.invalidate(); //wants a promise so use void to avoid error
    },
    onError: (e)=>{
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0]);
      }else{
        toast.error("Failed to post! Please try again later.");
      }
    }
  });

  if(!user) return null;

  return (
      <div className="flex gap-3 w-full">
        <Link href={`/@${user.username ?? ""}`}><Image src={user.profileImageUrl} alt="Projile image" className="h-14 w-14 rounded-full" width={56} height={56} /></Link>
        <input placeholder="Type some Emojis!" className="grow bg-transparent outline-none" type="text" value={input} 
        onChange={(e) => setInput(e.target.value)} 
        disabled={isPosting} 
        onKeyDown={(e)=>{if(e.key === "Enter"){
            e.preventDefault();
            if(input !== ""){
              mutate({content: input});
            }
          }
        }}/>
        {input !== "" && !isPosting &&  (<button onClick={()=> mutate({content: input})}>Post</button>)}
        {isPosting && <div className="flex justify-center items-center"><LoadingSpinner size={20}/></div>}
      </div>
      )
}



const Feed = () => {
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

    if(postsLoading) return <LoadingPage />;
    
    if(!data) return <div>Something went wrong</div>;

    return( <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id}/>
      ))}
      </div>);
}

const CreateProfileWizard = () =>{
  const {user} = useUser();

  if(!user) return null;

  return (<div id="profile" className="flex justify-around items-center">
            <SignOutButton />
            <Link href={`/@${user.username ?? ""}`}>
              <Image src={user.profileImageUrl} alt="Profile image" className="h-24 w-24 rounded-full" width={56} height={56} />
              <h1>{`@${user.username}`}</h1>
            </Link>
          </div>);

}

const Home: NextPage = () => {
  
  const {isLoaded: userLoaded, isSignedIn} = useUser(); 

  //start fetching asap
  api.posts.getAll.useQuery();
  
  //if Userdata did not load
  if(!userLoaded) return (<div></div>);

  
  return ( 
        <div className="flex flex-col justify-center md:flex-row">

          <LeftLayout>
            {!isSignedIn && (
                <div className="flex justify-center">
                  <SignInButton />
                </div>)}
            {isSignedIn && <CreateProfileWizard/>}
          </LeftLayout>
          <MainLayout>
            <div className="flex border-b border-slate-400 p-4">
              {isSignedIn && <CreatePostWizard/>}
            </div>
            {!isSignedIn && (
                <div className="flex justify-center">
                  <h1>Please Sign in to See Posts.</h1>
                </div>)}
            {isSignedIn && <Feed/>}
          </MainLayout>

          <RightLayout>

          </RightLayout>
        </div>

  );
};

export default Home;
