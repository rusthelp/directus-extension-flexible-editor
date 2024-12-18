// https://tiptap.dev/api/nodes/image

import Image from "@tiptap/extension-image";
import { defineTool } from "../../lib";
import customMessages from "../../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import ImageButton from "./ImageButton.vue";

export default defineTool({
    key: "image",
    name: customMessages.tools.image,
    icon: "image",
    toolbarButton: ImageButton,
    extension: [Image.configure({
        inline: true,
    })],
    action: (editor: Editor) => {
        editor.chain().focus().setImage({src: ''}).run();
    },
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setImage({src: ''}).run(),
    disabledInSingleLineMode: true,
    active: () => false,
});
