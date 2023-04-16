import type {RouterOutputs} from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regHeart} from '@fortawesome/free-regular-svg-icons';
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";


dayjs.extend(relativeTime);


type PostWithUser = RouterOutputs["posts"]["getAll"][number];



export const PostView = (props: PostWithUser) =>{

  const {post, author} = props;
  const ctx = api.useContext();
  
  let [heartColor, setColor] = useState("white");
  let [heartIcon, setIcon] = useState(regHeart);

  
  const {mutate: unlikePost , isLoading: unlikeLoading} = api.posts.unlikePost.useMutation({
      onSuccess: async ()=>{
        await ctx.posts.invalidate();
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
    onSuccess: async ()=>{
        await ctx.posts.invalidate();
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
  
  if(props.isLiked){
    heartIcon = solidHeart;
    heartColor = "rgb(244, 114, 182)"
  }


    return (
      <div key={post.id} className="flex flex-col p-4 border-b border-slate-400 gap-3">
        <div className="flex gap-3 ">
          <Image src={author.profileImageUrl} className="h-14 w-14 rounded-full" width={56} height={56} alt={`@${author.username}`}
          />
          <div className="flex flex-col">
            <div className="flex gap-1 text-slate-300">
              <Link href={`/@${author.id}`} key={author.id}>
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
          <button className="flex items-center gap-2 hover:text-pink-500" disabled={likeLoading || unlikeLoading} onMouseOver={()=>setColor("rgb(244, 114, 182)")} onMouseLeave={()=>setColor("white")} onClick={() => {
          const {post} = props;
          if(heartIcon === solidHeart){ 
            setColor("white")
            setIcon(regHeart);
            unlikePost({postId: post.id});
          }else{
            setColor("rgb(244, 114, 182)")
            setIcon(solidHeart);
            likePost({postId: post.id})
          }
        }}><FontAwesomeIcon className="p-2 hover:bg-pink-400 hover:bg-opacity-10 rounded-full" color={heartColor} icon={heartIcon} />{props.post.likes}</button>
        </div>
      </div>
    )
  
}


