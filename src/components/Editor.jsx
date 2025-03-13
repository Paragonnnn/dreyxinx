import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toolbarOptions, formats } from "../tools";
import api from "../api";

const Editor = () => {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/author/upload-story-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = response.data.url;
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      if (range) {
        quill.insertEmbed(range.index, "image", imageUrl);
        quill.setSelection(range.index + 1);
      } else {
        quill.insertEmbed(quill.getLength(), "image", imageUrl);
        quill.setSelection(quill.getLength());
      }
    };
  };

  const modules = {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={setValue}
      modules={modules}
      formats={formats}
    />
  );
};

export default Editor;