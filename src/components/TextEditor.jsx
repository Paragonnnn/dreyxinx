import React, { useEffect, useRef, useCallback, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "../api";
const TextEditor = () => {
  const wrapperRef = useRef(null);
  const quillRef = useRef(null);
  const [content, setContent] = useState("");

  // useEffect(() => {
  //   if (quillRef.current) {
  //     const quill = quillRef.current;
  //     quill.on("text-change", () => {
  //       setContent(quill.root.innerHTML);
  //     });
  //   }
  // }, []);

  // Image Upload Handler
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const imageData = new FormData();
      imageData.append("file", file);

      try {
        const response = await api.post(
          "/author/upload-story-image",
          imageData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const imageUrl = response.data.url;
        const quill = quillRef.current;

        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", imageUrl);
          quill.setSelection(range.index + 1);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
  };

  // Initialize Quill
  const initializeQuill = useCallback(() => {
    if (!wrapperRef.current) return;

    wrapperRef.current.innerHTML = "";
    const editor = document.createElement("div");
    wrapperRef.current.append(editor);

    const quill = new Quill(editor, {
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            ["image", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
          ],
          handlers: {
            image: handleImageUpload, // Custom image upload handler
          },
        },
      },
      theme: "snow",
    });
    quillRef.current = quill;
    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
      console.log(quill.getContents());
      console.log(quill.root);
    });
  }, []);

  useEffect(() => {
    initializeQuill();
    console.log(quillRef.current);
  }, [initializeQuill]);

  const handleSaveStory = async () => {
    try {
      const response = await api.post("/author/stories", {
        content,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Save story failed:", error);
    }
  }

  return (
    <div>
      <div id="container" ref={wrapperRef}></div>
      <button onClick={handleSaveStory}>Save Story</button>
      {/* <div>Live content</div> */}
      {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
    </div>
  );
};

export default TextEditor;
