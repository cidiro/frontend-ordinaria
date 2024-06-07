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

      if (response.status == 500) {
        return new Response("Unexpected error", {
          status: 302,
          headers,
        });
      }
      else if (response.status == 404) {
        return new Response("User not found with given userId", {
          status: 302,
          headers,
        });
      }
      else {
        return new Response("Other error", {
          status: 302,
          headers,
        });
      }
    }

    const videos = await response.json();
    return ctx.render({ videos });
  },

  POST: async (
    req: Request,
    ctx: FreshContext<State, Data>,
  ) => {
    const body = await req.json();
    const { videoId } = body;
    const userId = ctx.state.id;

    const response = await fetch(
      `${Deno.env.get("API_URL")}/fav/${userId}/${videoId}`,
      { method: "POST" },
    );

    if (!response.ok) {
      return new Response(null, {
        status: 500,
      })
    }

    return new Response(null, {
      status: 200,
    })
  },
};

const Page = (props: PageProps<Data>) => (
  <VideoList videos={props.data.videos} />
);

export default Page;
