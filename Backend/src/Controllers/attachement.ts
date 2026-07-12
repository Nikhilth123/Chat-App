import { Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import b2 from "../Config/b2";
import { Message } from "../Models/chat";
import { CustomError } from "../Middlewares/errormiddlewares";

export const previewAttachement = async (
  req: Request,
  res: Response
) => {
  const { attachementId } = req.params;

  const message = await Message.findOne({
    "attachements._id": attachementId,
  });

  if (!message) {
    throw new CustomError("Attachment not found", 404);
  }

  const attachement = message.attachements!.find(
    (a: any) => a._id.toString() === attachementId
  );

  if (!attachement) {
    throw new CustomError("Attachment not found", 404);
  }
console.log(attachement);
console.log("Key:", attachement.key);
  const object = await b2.send(
    new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: attachement.key,
    })
  );

  res.setHeader("Content-Type", attachement.mimeType);

  res.setHeader(
    "Content-Disposition",
    `inline; filename="${attachement.originalName}"`
  );

  (object.Body as NodeJS.ReadableStream).pipe(res);
};

export const downloadAttachement = async (
  req: Request,
  res: Response
) => {
  const { attachementId } = req.params;

  const message = await Message.findOne({
    "attachements._id": attachementId,
  });

  if (!message) {
    throw new CustomError("Attachment not found", 404);
  }

  const attachement = message.attachements!.find(
    (a: any) => a._id.toString() === attachementId
  );

  if (!attachement) {
    throw new CustomError("Attachment not found", 404);
  }

  const object = await b2.send(
    new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: attachement.key,
    })
  );

  res.setHeader("Content-Type", attachement.mimeType);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${attachement.originalName}"`
  );

  (object.Body as NodeJS.ReadableStream).pipe(res);
};