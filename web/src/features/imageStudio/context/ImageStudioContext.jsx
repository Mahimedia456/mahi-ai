import { createContext, useContext, useMemo, useState } from "react";

const ImageStudioContext = createContext(null);

export function ImageStudioProvider({ children }) {
  const [form, setForm] = useState({
    title: "",
    prompt: "",
    negativePrompt: "",
    exclusionPrompt: "",
    aspectRatio: "1:1",
    sampleCount: 1,
    styleKey: "cinematic",
    fidelityLevel: "STANDARD_01",
    entropy: 0.75,
    seed: "842913",
    steps: 20,
    guidanceScale: 7.5,
    presetId: null,
  });

  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const value = useMemo(
    () => ({
      form,
      setForm,
      currentJobId,
      setCurrentJobId,
      currentJob,
      setCurrentJob,
      selectedPreset,
      setSelectedPreset,
    }),
    [form, currentJobId, currentJob, selectedPreset]
  );

  return (
    <ImageStudioContext.Provider value={value}>
      {children}
    </ImageStudioContext.Provider>
  );
}

export function useImageStudio() {
  const ctx = useContext(ImageStudioContext);

  if (!ctx) {
    throw new Error("useImageStudio must be used inside ImageStudioProvider");
  }

  return ctx;
}