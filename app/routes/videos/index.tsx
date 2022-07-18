import type { Video } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  videoListItem: Array<Pick<Video, "id" | "name">>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    videoListItem: await db.video.findMany({
      take: 3,
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
  };

  return json(data);
};

export default function VideosIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="mt-4">
      <h2>Seznam videi:</h2>
      <ul className="mt-1">
        {data.videoListItem.map((video) => (
          <li key={video.id}>
            <Link to={video.id} className="underline text-blue-600 hover:text-blue-800">
              {video.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
