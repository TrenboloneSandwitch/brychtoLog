import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import cs from "classnames";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { validationAction } from "~/utils/validation";

export type VideoSchemaT = z.infer<typeof Schema>;

const Schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  url: z
    .string({ required_error: "URL is required" })
    .url({ message: "Invalid url" }),
  playlists: z.array(
    z.object({
      name: z
        .string({ required_error: "playlists name is required" })
        .min(3, { message: "Name must be at least 3 characters long" }),
      time: z
        .string({ required_error: "Time is required" })
        .regex(/^[0-5]?\d:[0-5]\d$|^((?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$)/, {
          message: "Time must be in this format hh:mm:ss OR mm:ss",
        }),
    })
  ),
});

export const action: ActionFunction = async ({ request }) => {
  const { formData, errors } = await validationAction<VideoSchemaT>({
    request,
    schema: Schema,
  });

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  const prismaQueryData = {
    ...formData,
    playlists: {
      createMany: {
        data: [...formData.playlists],
      },
    },
  };

  const video = await db.video.create({ data: prismaQueryData });

  // const video = await db.video.create({ data: fields });
};

export default function NewVideoRoute() {
  const isInitalRender = React.useRef(true);
  const formRef = React.useRef(null);
  const videoFetcher = useFetcher();
  const [triggerClientValidation, setTriggerClientValidation] = useState(false);

  const {
    control,
    trigger,
    register,
    watch,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SchemaT>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      link: "",
      playlist: [{ name: "", time: "" }],
    },
  });

  console.log("errors: ", errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "playlist",
  });

  const appendvideo = React.useCallback(() => {
    append({ name: "", time: "" });
  }, [append]);

  React.useEffect(() => {
    if (fields.length === 0 && isInitalRender.current) {
      appendvideo();
    }

    if (isInitalRender.current) {
      isInitalRender.current = false;
    }
  }, [appendvideo, fields]);

  const memoizedVals = React.useMemo(
    () => JSON.stringify(getValues()),
    [getValues()]
  );

  React.useEffect(() => {
    const waitForErrors = async () => {
      const triggerResult = await trigger();
      if (triggerResult) {
        console.log("here we go");
        videoFetcher.submit(formRef.current, { method: "post" });
      }
    };

    if (isDirty || triggerClientValidation) {
      waitForErrors();
    }
  }, [isDirty, memoizedVals, trigger, triggerClientValidation]);

  function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setTriggerClientValidation(true);
  }

  return (
    <videoFetcher.Form
      method="post"
      action="/videos/new"
      ref={formRef}
      onSubmit={onSubmit}
    >
      <fieldset>
        <div className="mb-4">
          <label className="block mb-1 md:mb-0 pr-4">
            Name:
            <input
              disabled={isSubmitting}
              placeholder="Name"
              className="border-2 border-gray-200 rounded w-full"
              {...register("name")}
              name="name"
            />
          </label>
          {(videoFetcher?.data?.errors?.name || errors.name) && (
            <p className="text-sm text-red-600 mt-1">
              {videoFetcher?.data?.errors?.name || errors?.name?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 md:mb-0 pr-4">
            URL:
            <input
              disabled={isSubmitting}
              {...register("link")}
              name="link"
              placeholder="Link"
              className="border-2 border-gray-200 rounded w-full"
            />
          </label>
          {(videoFetcher?.data?.errors?.link || errors.link) && (
            <p className="text-sm text-red-600 mt-1">
              {videoFetcher?.data?.errors?.link || errors?.link?.message}
            </p>
          )}
        </div>
      </fieldset>
      {fields.map((video, videoIndex) => (
        <div key={video.id}>
          <fieldset className="flex flex-wrap mb-2">
            <label className="mb-1 w-1/3">
              Play Name:
              <input
                {...register(`playlist.${videoIndex}.name`)}
                name={`playlist[${videoIndex}][name]`}
                placeholder="Playlist name"
                className="border-2 border-gray-200 rounded w-full"
              />
              {(videoFetcher?.data?.errors?.playlist?.[videoIndex]?.name ||
                errors?.playlist?.[videoIndex]?.name) && (
                <p className="text-sm text-red-600 mt-1 w-full">
                  {videoFetcher?.data?.errors?.playlist?.[videoIndex]?.name ||
                    errors?.playlist?.[videoIndex]?.name?.message}
                </p>
              )}
            </label>
            <label className="mb-1 px-3 w-1/3">
              Time:
              <input
                {...register(`playlist.${videoIndex}.time`)}
                name={`playlist[${videoIndex}][time]`}
                placeholder="mm:ss neb hh:mm:ss"
                className="border-2 border-gray-200 rounded w-full"
              />
              {(videoFetcher?.data?.errors?.playlist?.[videoIndex]?.time ||
                errors?.playlist?.[videoIndex]?.time) && (
                <p className="text-sm text-red-600 mt-1 w-full">
                  {videoFetcher?.data?.errors?.playlist?.[videoIndex]?.time ||
                    errors?.playlist?.[videoIndex]?.time?.message}
                </p>
              )}
            </label>
            <button
              className={cs(
                "shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-1/3",
                {
                  "bg-red-500 hover:bg-red-400": fields.length > 1,
                  "bg-gray-300": fields.length <= 1,
                }
              )}
              type="button"
              disabled={fields.length <= 1}
              onClick={() => remove(videoIndex)}
            >
              Remove
            </button>
          </fieldset>
        </div>
      ))}
      <button
        type="button"
        onClick={appendvideo}
        className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      >
        Add video
      </button>
      <input
        disabled={isSubmitting}
        className="ml-3 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        type="submit"
      />

      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </videoFetcher.Form>
  );
}
