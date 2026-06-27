import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Download,
  FileText,
  FileArchive,
  FileSpreadsheet,
  FileVideo,
  FileImage,
} from "lucide-react";

interface Props {
  file: any;
}

export default function MessageAttachment({ file }: Props) {
  const extension =
    file.originalName?.split(".").pop()?.toLowerCase() || "";

  // IMAGE
  if (file.type === "image") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <img
            src={file.previewUrl}
            alt={file.originalName}
            className="w-56 max-h-72 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
          />
        </DialogTrigger>

        <DialogContent className="max-w-5xl p-2">
          <img
            src={file.previewUrl}
            alt={file.originalName}
            className="w-full rounded-lg"
          />
        </DialogContent>
      </Dialog>
    );
  }

  // VIDEO
  if (file.type === "video") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <video
            className="w-60 rounded-lg cursor-pointer"
            muted
          >
            <source src={file.previewUrl} />
          </video>
        </DialogTrigger>

        <DialogContent className="max-w-5xl">
          <video
            controls
            autoPlay
            className="w-full rounded-lg"
          >
            <source src={file.previewUrl} />
          </video>
        </DialogContent>
      </Dialog>
    );
  }

  // PDF
  if (extension === "pdf") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl cursor-pointer hover:bg-gray-200">
            <FileText size={28} />
            <div>
              <p className="font-medium">{file.originalName}</p>
              <p className="text-xs text-gray-500">PDF Document</p>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-6xl h-[90vh]">
          <iframe
            src={file.previewUrl}
            className="w-full h-full rounded-lg"
          />
        </DialogContent>
      </Dialog>
    );
  }

  // WORD
  if (["doc", "docx"].includes(extension)) {
    return (
      <FileCard
        icon={<FileText />}
        file={file}
        subtitle="Word Document"
      />
    );
  }

  // EXCEL
  if (["xls", "xlsx"].includes(extension)) {
    return (
      <FileCard
        icon={<FileSpreadsheet />}
        file={file}
        subtitle="Excel Sheet"
      />
    );
  }

  // ZIP
  if (["zip", "rar"].includes(extension)) {
    return (
      <FileCard
        icon={<FileArchive />}
        file={file}
        subtitle="Compressed File"
      />
    );
  }

  // Default
  return (
    <FileCard
      icon={<FileImage />}
      file={file}
      subtitle="Attachement"
    />
  );
}

function FileCard({
  file,
  subtitle,
  icon,
}: {
  file: any;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
      <div className="flex gap-3 items-center">
        {icon}

        <div>
          <p className="font-medium break-all">
            {file.originalName}
          </p>

          <p className="text-xs text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>

      <a
        href={file.downloadUrl}
      download
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <Download size={18} />
      </a>
    </div>
  );
}