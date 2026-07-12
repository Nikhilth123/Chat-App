import { useEffect, useState } from "react";

interface Props {
  url: string;
}

export default function PdfViewer({ url }: Props) {
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    let objectUrl = "";

    const load = async () => {
      try {
        const res = await fetch(url, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch PDF");

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
      <div className="flex h-full items-center justify-center">
        Loading PDF...
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      className="w-full h-full border-0"
      title="PDF Viewer"
    />
  );
}