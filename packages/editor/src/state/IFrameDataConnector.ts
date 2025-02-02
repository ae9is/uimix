import * as Y from "yjs";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import { ProjectState } from "./ProjectState";
import { action } from "mobx";
import {
  IEditorToRootRPCHandler,
  IRootToEditorRPCHandler,
} from "../types/IFrameRPC";
import { throttle } from "lodash-es";
import { ThumbnailTakerHost } from "./ThumbnailTakerHost";
import { Clipboard } from "./Clipboard";

export class IFrameDataConnector {
  constructor(state: ProjectState) {
    this.state = state;
    this.updates.push(Y.encodeStateAsUpdate(state.doc));

    this.state.doc.on("update", (data: Uint8Array) => {
      this.updates.push(data);
      this.sendUpdate();
    });

    this.state.project.imageManager.uploadImage = async (
      hash: string,
      contentType: string,
      data: Uint8Array
    ) => {
      return this.rpc.remote.uploadImage(hash, contentType, data);
    };

    this.rpc = new RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>(
      parentWindowTarget(),
      {
        update: action(async (data: Uint8Array) => {
          Y.applyUpdate(state.doc, data);
        }),
        init: action(async (data: Uint8Array, pageID?: string) => {
          Y.applyUpdate(state.doc, data);
          state.pageID = pageID ?? state.project.pages.all[0]?.id;
          state.undoManager.clear();
        }),
        updateCodeAssets: action(async (assets) => {
          this.state.project.localCodeAssets = assets;
        }),
      }
    );

    new ThumbnailTakerHost(state.project, (pngData) => {
      void this.rpc.remote.updateThumbnail(pngData);
    });

    void this.rpc.remote.ready();

    Clipboard.handler = {
      get: async (type) => {
        return this.rpc.remote.getClipboard(type);
      },
      set: async (type, text) => {
        void this.rpc.remote.setClipboard(type, text);
      },
    };

    void this.rpc.remote.getCodeAssets().then((assets) => {
      if (assets) {
        this.state.project.localCodeAssets = assets;
      }
    });
  }

  private state: ProjectState;
  private rpc: RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>;
  private updates: Uint8Array[] = [];

  private sendUpdate = throttle(() => {
    if (this.updates.length) {
      void this.rpc.remote.update(Y.mergeUpdates(this.updates));
      this.updates = [];
    }
  }, 100);
}
