import { FreshContext, Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/src/server/mod.ts";
import VideoList from "../components/VideoList.tsx";
import { Video } from "../types.ts";

type State = {
  id: string;
  name: string;
  email: string;
};

type Data = {
  videos: Video[];
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

    const response = await fetch(`${API_URL}/videos/${userId}`);
    if (!response.ok) {
      const headers = new Headers({
        location: "/",
      });
      return new Response(null, {
        status: 302,
        headers,
      });
    }

    const videos = await response.json();
    return ctx.render({ userId, videos });
  },
};

const Page = (props: PageProps<Data>) => (
  <VideoList videos={props.data.videos} userId={props.data.userId} />
);

export default Page;
