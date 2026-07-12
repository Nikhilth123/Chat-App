import { useEffect, useState } from "react";

interface Props {
  url: string;
  type: "image" | "video";
  className?: string;
  alt?: string;
}

export default function ProtectedMedia({
  url,
  type,
  className,
  alt,
}: Props) {
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    let objectUrl = "";

    const load = async () => {
      try {
        const res = await fetch(url, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch media");

        const blob = await res.blob();

        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error(err);
      }
    };

    load();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  if (!blobUrl) {
    return (
      <div className="w-40 h-40 flex items-center justify-center rounded-xl bg-muted animate-pulse">
        Loading...
      </div>
    );
  }

  if (type === "image") {
    return (
      <img
        src={blobUrl}
        alt={alt}
        loading="lazy"
        className={className}
      />
    );
  }

  return (
    <video
      src={blobUrl}
      controls
      className={className}
    />
  );
}