import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auditions/:path*",
    "/expenses/:path*",
    "/services/:path*",
  ],
};