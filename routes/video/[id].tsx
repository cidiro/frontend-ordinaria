import { FreshContext, Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/src/server/mod.ts";
import VideoDetail from "../../components/VideoDetail.tsx";
import { Video } from "../../types.ts";

type State = {
  id: string;
  name: string;
  email: string;
};

type Data = {
  video: Video;
  userId: string;
};

export const handler: Handlers<Data, State> = {
  GET: async (
    _req: Request,
    ctx: FreshContext<State, Data>,
  ) => {
    const userId = ctx.state.id;

    const API_URL = Deno.env.get("API_URL");
    if (!API_URL) {
      throw new Error("API_URL is not set in the environment");
    }

    const response = await fetch(
      `${API_URL}/video/${userId}/${ctx.params.id}`,
    );
    if (!response.ok) {
      const headers = new Headers({
        location: "/",
      });
      return new Response(null, {
        status: 302,
        headers,
      });
    }

    const video = await response.json();
    return ctx.render({ userId, video });
  },
};

const Page = (props: PageProps<Data>) => (
  <VideoDetail video={props.data.video} userId={props.data.userId} />
);

export default Page;
