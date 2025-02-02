import { z } from "zod";
import { NodeJSON } from "./node/node.js";
import { StyleJSON } from "./style/style.js";

export const ColorToken = z.object({
  name: z.string(),
  value: z.string(),
  index: z.number(),
  page: z.string().optional(),
});
export type ColorToken = z.infer<typeof ColorToken>;

export const ImageType = z.enum(["image/png", "image/jpeg"]);
export type ImageType = z.infer<typeof ImageType>;

export const Image = z.object({
  width: z.number(),
  height: z.number(),
  type: ImageType,
  url: z.string(),
});

export type Image = z.infer<typeof Image>;

export const ProjectJSON = z.object({
  // TODO: version
  nodes: z.record(NodeJSON),
  styles: z.record(StyleJSON.partial()),
  componentURLs: z.array(z.string()).optional(),
  images: z.record(Image).optional(),
  colors: z.record(ColorToken).optional(),
});

export type ProjectJSON = z.infer<typeof ProjectJSON>;

export const PageJSON = z.object({
  nodes: z.record(NodeJSON),
  styles: z.record(StyleJSON.partial()),
  images: z.record(Image).optional(),
  colors: z.record(ColorToken).optional(),
});
export type PageJSON = z.infer<typeof PageJSON>;

export const ProjectManifestJSON = z.object({
  prebuiltAssets: z.array(z.string()).optional(),
  components: z
    .object({
      react: z.array(z.string()).optional(),
    })
    .optional(),
  designTokens: z.string().optional(),
});
export type ProjectManifestJSON = z.infer<typeof ProjectManifestJSON>;
