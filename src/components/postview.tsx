import type {RouterOutputs} from "~/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {IconDefinition, faHeart as regHeart} from '@fortawesome/free-regular-svg-icons'
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";





dayjs.extend(relativeTime);


type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const ButtonPanel = (props: PostWithUser ) =>{

  const {user} = useUser();
  let [heartIcon, setIcon] = useState(regHeart);
  const ctx = api.useContext();

  const likedPosts = api.posts.getLikedPostByUserId.useQuery({userId: user?.id ?? ""})?.data;
  likedPosts?.find((post: any) => { if(post.postId === props.post.id){heartIcon = solidHeart;}})
  
  
 
  const {mutate: unlikePost , isLoading: unlikeLoading} = api.posts.unlikePost.useMutation({
      onSuccess: ()=>{
        setIcon(regHeart);
        void ctx.posts.invalidate();
      },
      onError: (e)=>{
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if(errorMessage && errorMessage[0]){
          toast.error(errorMessage[0]);
        }else{
          toast.error("Failed to unlike post. Try again later");
        }
      }
  });

 const {mutate: likePost, isLoading: likeLoading} = api.posts.likePost.useMutation({
    onSuccess: ()=>{
      setIcon(solidHeart);
      void ctx.posts.invalidate();
    },
    onError: (e)=>{
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0]);
      }else{
        toast.error("Failed to like post. Try again later");
      }
    }
    
  });

  return (<button className="flex items-center gap-2" disabled={likeLoading || unlikeLoading} onClick={() => {
        const {post} = props;
        if(heartIcon === solidHeart){
          unlikePost({postId: post.id});
        }else{
          likePost({postId: post.id})
        }
      }}><FontAwesomeIcon className="h-5 w-5" icon={heartIcon} />{props.post.likes}</button>)
}





export const PostView = (props: PostWithUser) =>{

  const {post, author} = props;
  const {user} = useUser();
  
 
    return (
      <div key={post.id} className="flex flex-col p-4 border-b border-slate-400 gap-3">
        <div className="flex gap-3 ">
          <Image src={author.profileImageUrl} className="h-14 w-14 rounded-full" width={56} height={56} alt={`@${author.username}`}
          />
          <div className="flex flex-col">
            <div className="flex gap-1 text-slate-300">
              <Link href={`/@${author.username}`}>
                <span>{`@${author.username}`}</span>
              </Link>
              <Link href={`/post/${post.id}`}>
                <span className="font-thin text-slate-500">{`- ${dayjs(post.createdAt).fromNow()}`}</span>
              </Link>
            </div>
            <span className="text-2xl">{post.content}</span>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <ButtonPanel {...props} key={post.id}/>
        </div>
      </div>
    )
  
}
