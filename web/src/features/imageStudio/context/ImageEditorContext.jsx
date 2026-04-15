import { createContext, useContext, useMemo, useState } from "react";

const ImageEditorContext = createContext(null);

export function ImageEditorProvider({ children }) {
  const [inputFile, setInputFile] = useState(null);
  const [inputPath, setInputPath] = useState("");
  const [inputPreview, setInputPreview] = useState("");
  const [activeJob, setActiveJob] = useState(null);

  const value = useMemo(
    () => ({
      inputFile,
      setInputFile,
      inputPath,
      setInputPath,
      inputPreview,
      setInputPreview,
      activeJob,
      setActiveJob,
      clearEditorState() {
        setInputFile(null);
        setInputPath("");
        setInputPreview("");
        setActiveJob(null);
      },
    }),
    [inputFile, inputPath, inputPreview, activeJob]
  );

  return (
    <ImageEditorContext.Provider value={value}>
      {children}
    </ImageEditorContext.Provider>
  );
}

export function useImageEditor() {
  const context = useContext(ImageEditorContext);

  if (!context) {
    throw new Error("useImageEditor must be used inside ImageEditorProvider");
  }

  return context;
}