import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadBoxProps {
  label: string;
  description: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const ImageUploadBox = ({ label, description, file, onFileSelect }: ImageUploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      onFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      onFileSelect(droppedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`upload-zone relative min-h-[180px] flex flex-col items-center justify-center gap-3 ${
          file ? "has-file" : ""
        } ${isDragging ? "border-primary bg-accent/50" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {file ? (
          <>
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="max-h-[120px] max-w-full object-contain rounded"
              />
              <button
                onClick={handleRemove}
                className="absolute top-0 right-0 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-full px-2">
              {file.name}
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Click or drag to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadBox;
