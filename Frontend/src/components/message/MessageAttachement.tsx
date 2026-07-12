import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProtectedMedia from "./ProtectedMedia";
import PdfViewer from "./PdfViewer";
import {
  Download,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

interface Props {
  file: any;
} 

export default function MessageAttachment({ file }: Props) {
  const extension =
    file.originalName?.split(".").pop()?.toLowerCase() || "";

  // ---------------- IMAGE ----------------

  if (file.type === "image") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="inline-block cursor-pointer">
            <ProtectedMedia
              url={file.previewUrl}
              type="image"
              alt={file.originalName}
              className="max-w-[220px] sm:max-w-[260px] md:max-w-[300px] max-h-72 rounded-xl object-cover border shadow-sm hover:opacity-90 transition"
            />
          </div>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-6xl h-[92vh] p-2">
          <div className="flex h-full items-center justify-center overflow-hidden">
            <ProtectedMedia
              url={file.previewUrl}
              type="image"
              alt={file.originalName}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ---------------- VIDEO ----------------

  if (file.type === "video") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="inline-block cursor-pointer">
            <ProtectedMedia
              url={file.previewUrl}
              type="video"
              className="max-w-[260px] rounded-xl shadow-sm"
            />
          </div>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-5xl p-2">
          <ProtectedMedia
            url={file.previewUrl}
            type="video"
            className="w-full max-h-[80vh] rounded-xl"
          />
        </DialogContent>
      </Dialog>
    );
  }

  // ---------------- PDF ----------------

  if (extension === "pdf") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex cursor-pointer items-center gap-3 rounded-xl border bg-muted p-3 transition hover:bg-muted/80">
            <FileText className="text-red-500" size={30} />

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {file.originalName}
              </p>

              <p className="text-xs text-muted-foreground">
                PDF Document
              </p>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="w-[98vw] max-w-6xl h-[95vh] p-0">
          <PdfViewer url={file.previewUrl} />
        </DialogContent>
      </Dialog>
    );
  }

  // ---------------- WORD ----------------

  if (["doc", "docx"].includes(extension)) {
    return (
      <FileCard
        icon={<FileText className="text-blue-500" />}
        file={file}
        subtitle="Word Document"
      />
    );
  }

  // ---------------- EXCEL ----------------

  if (["xls", "xlsx"].includes(extension)) {
    return (
      <FileCard
        icon={<FileSpreadsheet className="text-green-600" />}
        file={file}
        subtitle="Excel Spreadsheet"
      />
    );
  }

  // ---------------- ZIP ----------------

  if (["zip", "rar", "7z"].includes(extension)) {
    return (
      <FileCard
        icon={<FileArchive className="text-yellow-600" />}
        file={file}
        subtitle="Compressed Archive"
      />
    );
  }

  // ---------------- DEFAULT ----------------

  return (
    <FileCard
      icon={<FileImage />}
      file={file}
      subtitle="Attachment"
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
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted p-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="shrink-0">{icon}</div>

        <div className="min-w-0">
          <p className="truncate font-medium">
            {file.originalName}
          </p>

          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <a
        href={file.downloadUrl}
        download
        className="rounded-full p-2 transition hover:bg-background"
      >
        <Download size={18} />
      </a>
    </div>
  );
}