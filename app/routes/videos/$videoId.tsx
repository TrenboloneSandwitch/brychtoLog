import type { Video } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const video = await db.video.findUnique({
    where: { id: params.videoId },
  });

  if (!video) throw new Error("Video not found");
  return json(video);
};

export default function JokeRoute() {
  const video = useLoaderData<Video>();

  return (
    <div>
      <p>
        Nazev videa: <b>{video.name}</b>
      </p>
    </div>
  );
}
