import type {RouterOutputs} from "~/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart as regHeart} from '@fortawesome/free-regular-svg-icons'
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";


dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

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
      <button><FontAwesomeIcon icon={regHeart} /></button>
    </div>
  </div>
)
}
