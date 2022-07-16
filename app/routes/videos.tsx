import { Outlet, Link } from "@remix-run/react";

export default function VideosRoute() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bol ">Videos</h1>
      <main>
        <Outlet />
        <div className="mt-5">
          <span className="font-bold">Menu ➡️ </span>
          <Link
            to="/videos"
            className="underline text-blue-600 hover:text-blue-800 ml-2"
          >
            Index
          </Link>
          <Link
            to="/videos/new"
            className="underline text-blue-600 hover:text-blue-800 ml-2"
          >
            New
          </Link>
        </div>
      </main>
    </div>
  );
}
