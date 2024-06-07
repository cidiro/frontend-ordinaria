import { FreshContext, Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import jwt from "jsonwebtoken";
import { setCookie } from "$std/http/cookie.ts";
import Register from "../components/Register.tsx";

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
    const name = form.get("name")?.toString() || "";
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

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (response.status == 400 || response.status == 500) {
      return ctx.render({
        userId: "",
        message: "User with the same email already exists",
      });
    }

    if (response.status == 200) {
      const { id } = await response.json();
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
  <Register message={props.data.message} />
)

export default Page;
