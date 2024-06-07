import { FreshContext, Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import jwt from "jsonwebtoken";
import { setCookie } from "$std/http/cookie.ts";
import Login from "../components/Login.tsx";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

type Data = {
  userId: string;
  message: string;
};

export const handler: Handlers = {
  GET: (_req: Request, ctx: FreshContext<unknown, Data>) => {
    return ctx.render({ userId: "", message: "" })
  },

  POST: async (req: Request, ctx: FreshContext<unknown, Data>) => {
    const url = new URL(req.url);
    const form = await req.formData();
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    const API_URL = Deno.env.get("API_URL");
    if (!API_URL) {
      throw new Error("API_URL is not set in the environment");
    }

    const JWT_SECRET = Deno.env.get("JWT_SECRET");
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in the environment");
    }

    const response = await fetch(`${API_URL}/checkuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status == 404 || response.status == 400) {
      return ctx.render({
        userId: "",
        message: "Incorrect credentials or user does not exist",
      });
    }

    if (response.status == 200) {
      const { name, id } = await response.json();
      const token = jwt.sign(
        {
          email,
          id,
          name,
        },
        JWT_SECRET,
        {
          expiresIn: "24h",
        },
      );
      const headers = new Headers();

      setCookie(headers, {
        name: "auth",
        value: token,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/");
      return new Response(null, {
        status: 303,
        headers,
      });
    } else {
      return ctx.render({
        userId: "",
        message: "Unexpected error. Oops!",
      });
    }
  },
};

const Page = (props: PageProps<Data>) => (
  <Login message={props.data.message} />
)

export default Page;
