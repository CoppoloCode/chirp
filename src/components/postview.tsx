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




dayjs.extend(relativeTime);


type PostWithUser = RouterOutputs["posts"]["getAll"][number];


const ButtonPanel = (props: PostWithUser) =>{

  let [icon, setIcon] = useState(regHeart);
  
  const {post} = props;

  function checkLikeStatus (icon: IconDefinition){
    if(icon === solidHeart){
      unlikePost({postId: post.id});
    }else{
      likePost({postId: post.id})
    }
  }

  const {mutate: likePost, isLoading: likeLoading} = api.posts.likePost.useMutation({
    onSuccess: ()=>{
      setIcon(solidHeart);
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

  const {mutate: unlikePost, isLoading: unlikeLoading} = api.posts.unlikePost.useMutation({
    onSuccess: ()=>{
      setIcon(regHeart);
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

  return (<button disabled={likeLoading || unlikeLoading} onClick={() => checkLikeStatus(icon)}><FontAwesomeIcon  icon={icon} /></button>)
}



export const PostView = (props: PostWithUser) =>{

  const {post, author} = props;
 
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
