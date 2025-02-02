import { NodeClipboardData } from "@uimix/model/src/data/v1";
import { projectState } from "./ProjectState";
import { DefaultClipboardHandler } from "./DefaultClipboardHandler";
import { ClipboardHandler } from "../types/ClipboardHandler";
import isSvg from "is-svg";

// const mimeType = "application/x-macaron-nodes";

export class Clipboard {
  static handler: ClipboardHandler = new DefaultClipboardHandler();

  static async writeNodes(data: NodeClipboardData) {
    const text = JSON.stringify(data);
    await this.handler.set("text", text);
  }

  static async readNodes(): Promise<NodeClipboardData | undefined> {
    const imageDataURL = await this.handler.get("image");
    if (imageDataURL) {
      const [hash] = await projectState.project.imageManager.insertDataURL(
        imageDataURL
      );

      return {
        uimixClipboardVersion: "0.0.1",
        type: "nodes",
        nodes: [
          {
            id: "",
            type: "image",
            name: "Image",
            style: {
              width: { type: "hug" },
              height: { type: "hug" },
              imageHash: hash,
            },
            children: [],
          },
        ],
        images: {},
      };
    }

    const text = await this.handler?.get("text");
    if (text) {
      if (isSvg(text)) {
        return {
          uimixClipboardVersion: "0.0.1",
          type: "nodes",
          nodes: [
            {
              id: "",
              type: "svg",
              name: "SVG",
              style: {
                width: { type: "hug" },
                height: { type: "hug" },
                svgContent: text,
              },
              children: [],
            },
          ],
          images: {},
        };
      }

      try {
        return NodeClipboardData.parse(JSON.parse(text));
      } catch (e) {
        console.error(e);
        return;
      }
    }
  }
}
