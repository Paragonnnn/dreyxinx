export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-us", options);
};

export const reduceContentLenght = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const copyToClipboard = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert("Link copied to clipboard");
  });
};

export const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }], // Subscript & Superscript
  [{ indent: "-1" }, { indent: "+1" }], // Indentations
  [{ align: [] }], // Text Alignment
  ["color"], // Text color
  ["link", "image", "video"], // Media
  ["clean"], // Remove formatting
];

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "script",
  "indent",
  "align",
  "color",
  "link",
  "image",
  "video",
];
