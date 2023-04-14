import { useUser } from "@clerk/nextjs"
import { api } from "~/utils/api";
import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "./loading";

type ProfileData = RouterOutputs["profile"]["getUserById"];
 

const CreateFollowingWizard = (props: ProfileData) =>{

    const profile = props;
    if(!profile) return null;

    return (
            <Link href={`/@${profile.id}`}><div className="flex justify-between items-center p-4 hover:cursor-pointer bg-slate-900 bg-opacity-0 transition duration-500 ease-in-out hover:bg-opacity-60 rounded-xl">
                <div className="flex gap-3">
                    <Image src={profile?.profileImageUrl} alt={profile?.id} className="flex rounded-full" width={48} height={48}></Image> 
                    <p className="text-lg pb-3">{profile?.username}</p>
                </div>
                <FontAwesomeIcon className="h-8 w-8" icon={faPerson}></FontAwesomeIcon>     
            </div></Link>
            )
  
  }



export const GetFollowerProfiles = () =>{

    const {user} = useUser();

    if(!user) return null;

    const {data , isLoading: dataLoading } = api.profile.getFollowers.useQuery({userId: user.id});
    const followees = data?.map((follow) =>{return follow.followee});
    const {data: profilesData , isLoading: profilesLoading} = api.profile.getFollowerProfiles.useQuery({userIds: followees ?? [""]});
    let followeeProfiles = [];

    if(dataLoading || profilesLoading) return <div className="flex h-80 justify-center items-center"><LoadingSpinner size={56}/></div>;

    if(followees?.length === 0) return <div className="flex justify-center items-center pt-4">Follow Some People!</div>;
    if(!followees) return null;

    for(let i = 0; i < followees?.length; i++){
        followeeProfiles?.push(profilesData?.find((profile) => {if(profile.id === followees?.at(i)){return profile}}));
    }
    

    return (<div className="flex flex-col gap-3 pt-4">{followeeProfiles.map((profile)=>(
        <CreateFollowingWizard {...profile as ProfileData} key={profile?.id}/>
        ))}
    </div>)


}
