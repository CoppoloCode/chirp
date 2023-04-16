import type{ NextPage , GetStaticProps} from "next";
import Head from "next/head";
import { MainLayout, RightLayout, LeftLayout } from "~/components/layout";
import { GetFollowerProfiles } from "~/components/rightview";
import { LeftView } from "~/components/leftview";
import { api } from "~/utils/api";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";



const SinglePostPage: NextPage<{id: string}> = ({id}) => {
  const {data} = api.posts.getById.useQuery({
    id,
  });

  if(!data) return <div>404</div>;
  
  return (
    <div className="flex flex-col justify-center md:flex-row">
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <LeftLayout>
          <LeftView/>
        </LeftLayout>
      <MainLayout>
          <PostView {...data} />
      </MainLayout>
      <RightLayout>
          <GetFollowerProfiles/>
        </RightLayout>
    </div>
  );
};



export const getStaticProps: GetStaticProps = async (context) =>{

  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if(typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({id});

  return {
    props:{
      trpcState: ssg.dehydrate(),
      id,
    },
  }

};

export const getStaticPaths = () =>{
  return {paths: [], fallback:"blocking"};
};


export default SinglePostPage;
