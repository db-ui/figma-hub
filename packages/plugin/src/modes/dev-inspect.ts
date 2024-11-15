import {  sendMessage } from "../utils/index.js";
import { generateData } from "../utils/generate.js";
import {OutputNode, UiMessage} from "shared/data.js";

const handleSelectionChange = () => {
  const selection = figma.currentPage.selection;
  let validRoot = false;
  if (selection.length > 0 && selection.length < 2 && selection[0].parent) {
    validRoot = true;
  }
  sendMessage<boolean>({ type: "selectionchange", data: validRoot });
};

export const handleDevInspect = () => {
  figma.showUI(__html__);
  handleSelectionChange();
  figma.on("selectionchange", handleSelectionChange);
  figma.ui.onmessage = async (msg: UiMessage) => {
    if (msg.type === "generate") {
      sendMessage<string>({ type: "loading", data: "Loading nodes" });
      generateData(false).then((data) => {
        if (data) {
          sendMessage<OutputNode>({ type: "baseData", data });
          sendMessage<undefined>({ type: "error", data: undefined });
        } else {
          sendMessage<string>({ type: "error", data: "Failed to load" });
        }
      });
    } else if (msg.type === "css") {
      sendMessage<string>({
        type: "loading",
        data: "Loading css. This takes a long time.",
      });
      generateData(true).then((cssData) => {
        if (cssData) {
          sendMessage<OutputNode>({ type: "cssData", data: cssData });
          sendMessage<undefined>({ type: "loading", data: undefined });
          sendMessage<undefined>({ type: "error", data: undefined });
        } else {
          sendMessage<string>({
            type: "error",
            data: "Failed to load css data",
          });
        }
      });
    } else if (msg.type === "notify") {
      figma.notify(msg.data);
    } else if (msg.type === "setStorage") {
      await figma.clientStorage.setAsync(msg.data.key, msg.data.value);
    } else if (msg.type === "getStorage") {
      const value = await figma.clientStorage.getAsync(msg.data.key);
      sendMessage<string | null>({ type: "storage", data: value });
    }
  };
};
