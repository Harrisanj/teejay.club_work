import {
  ChangeEventHandler,
  DragEventHandler,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type State = {
  openFileDialog: () => void;
  isDragging: boolean;
  isDropping: boolean;
};

type Props = {
  onFileChange?: (file: File) => void;
  children: (state: State) => ReactNode;
};

export const Dropper = memo<Props>(({ onFileChange, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    const handleDragOver = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);
    window.addEventListener("drop", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    return () => {
      window.removeEventListener("drop", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files?.length) {
      return;
    }

    onFileChange?.(event.target.files[0]);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();

    setIsDragging(false);
    setIsDropping(false);

    if (!event.dataTransfer.files.length) {
      return;
    }

    onFileChange?.(event.dataTransfer.files[0]);
  };

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";

    setIsDropping(true);
  };

  const handleDragLeave: DragEventHandler<HTMLDivElement> = () => {
    setIsDropping(false);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />
      {children({
        isDragging,
        isDropping,
        openFileDialog,
      })}
    </div>
  );
});

Dropper.displayName = "Dropper";
