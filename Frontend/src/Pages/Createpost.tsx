import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  Video,
  FileText,
  X
} from "lucide-react";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // File handler
  const handleFiles = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video" | "file"
  ) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    if (type === "image") setImages((p) => [...p, ...selected]);
    if (type === "video") setVideos((p) => [...p, ...selected]);
    if (type === "file") setFiles((p) => [...p, ...selected]);
  };

  const removeItem = (index: number, type: string) => {
    if (type === "image") setImages((p) => p.filter((_, i) => i !== index));
    if (type === "video") setVideos((p) => p.filter((_, i) => i !== index));
    if (type === "file") setFiles((p) => p.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async () => {
    if (
      !title &&
      !text &&
      !images.length &&
      !videos.length &&
      !files.length
    ) {
      alert("Post cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);

    images.forEach((img) => formData.append("images", img));
    videos.forEach((vid) => formData.append("videos", vid));
    files.forEach((f) => formData.append("files", f));

    try {
      setLoading(true);

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      // Reset
      setTitle("");
      setText("");
      setImages([]);
      setVideos([]);
      setFiles([]);

      alert("Posted!");
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-xl rounded-2xl shadow-md">
        <CardContent className="p-5 space-y-4">

          {/* TITLE */}
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />

          {/* TEXT */}
          <Textarea
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-none focus-visible:ring-0 resize-none"
          />

          {/* MEDIA PREVIEW */}
          <div className="space-y-2">

            {/* Images */}
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => removeItem(i, "image")}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Videos */}
            <div className="flex flex-wrap gap-2">
              {videos.map((vid, i) => (
                <div key={i} className="relative">
                  <video
                    src={URL.createObjectURL(vid)}
                    className="w-28 h-20 rounded"
                    controls
                  />
                  <button
                    onClick={() => removeItem(i, "video")}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Files */}
            {files.map((file, i) => (
              <div key={i} className="flex justify-between bg-muted p-2 rounded">
                <span>{file.name}</span>
                <button onClick={() => removeItem(i, "file")}>
                  <X size={16} />
                </button>
              </div>
            ))}

          </div>

          {/* ACTION BAR */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex gap-4 text-gray-500">

              <button onClick={() => imageRef.current?.click()}>
                <ImageIcon />
              </button>

              <button onClick={() => videoRef.current?.click()}>
                <Video />
              </button>

              <button onClick={() => fileRef.current?.click()}>
                <FileText />
              </button>

            </div>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>

          {/* Hidden Inputs */}
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            ref={imageRef}
            onChange={(e) => handleFiles(e, "image")}
          />

          <input
            type="file"
            multiple
            accept="video/*"
            hidden
            ref={videoRef}
            onChange={(e) => handleFiles(e, "video")}
          />

          <input
            type="file"
            multiple
            hidden
            ref={fileRef}
            onChange={(e) => handleFiles(e, "file")}
          />

        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;