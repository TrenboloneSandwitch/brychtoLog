import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { VideoSchemaT } from "./new";

export const loader: LoaderFunction = async ({ params }) => {
  const video = await db.video.findUnique({
    where: { id: params.videoId },
    include: { playlists: true },
  });

  if (!video) throw new Error("Video not found");
  return json(video);
};

export default function JokeRoute() {
  const video = useLoaderData<VideoSchemaT>();

  return (
    <div>
      Nazev videa: <b>{video.name}</b>
      <pre>
        {JSON.stringify(video?.playlists?.map(({ name }) => name))}
        {JSON.stringify(video?.playlists?.map(({ time }) => time))}
      </pre>
    </div>
  );
}
