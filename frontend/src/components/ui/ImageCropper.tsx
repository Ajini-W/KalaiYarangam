"use client";

import * as React from "react";
import { Camera, ZoomIn, ZoomOut, RotateCw, Check, X, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

const MAX_SIZE_BEFORE_COMPRESS = 500 * 1024;
const AVATAR_SIZE = 300;

interface CropArea {
  x: number;
  y: number;
  size: number;
}

interface ImageCropperProps {
  currentAvatar: string | null;
  onSave: (base64: string) => Promise<void>;
  disabled?: boolean;
}

function compressImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;
      if (w > maxSize || h > maxSize) {
        const ratio = Math.min(maxSize / w, maxSize / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageCropper({ currentAvatar, onSave, disabled }: ImageCropperProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);
  const [source, setSource] = React.useState<string | null>(null);
  const [naturalW, setNaturalW] = React.useState(0);
  const [naturalH, setNaturalH] = React.useState(0);
  const [displayW, setDisplayW] = React.useState(0);
  const [displayH, setDisplayH] = React.useState(0);
  const [crop, setCrop] = React.useState<CropArea>({ x: 0, y: 0, size: 100 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [saving, setSaving] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    let dataUrl: string;
    if (file.size > MAX_SIZE_BEFORE_COMPRESS) {
      dataUrl = await compressImage(file, 1200);
    } else {
      dataUrl = await readFile(file);
    }

    const img = new Image();
    img.onload = () => {
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setSource(dataUrl);
      setOpen(true);
    };
    img.src = dataUrl;

    if (inputRef.current) inputRef.current.value = "";
  };

  React.useEffect(() => {
    if (!open || !source || !imageRef.current) return;
    const img = imageRef.current;
    const onLoad = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const maxDim = 500;
      const ratio = Math.min(maxDim / w, maxDim / h, 1);
      setDisplayW(Math.round(w * ratio));
      setDisplayH(Math.round(h * ratio));
      const size = Math.round(Math.min(w, h) * ratio * 0.8);
      setCrop({
        x: Math.round((Math.round(w * ratio) - size) / 2),
        y: Math.round((Math.round(h * ratio) - size) / 2),
        size,
      });
    };
    if (img.complete) onLoad();
    else img.onload = onLoad;
  }, [open, source]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    const size = crop.size;
    mx = Math.max(0, Math.min(mx, displayW - size));
    my = Math.max(0, Math.min(my, displayH - size));
    setCrop((prev) => ({ ...prev, x: mx, y: my }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCropConfirm = async () => {
    if (!source) return;
    setSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;
      const ctx = canvas.getContext("2d")!;
      const scaleX = naturalW / displayW;
      const scaleY = naturalH / displayH;
      const sx = crop.x * scaleX;
      const sy = crop.y * scaleY;
      const sw = crop.size * scaleX;
      const sh = crop.size * scaleY;
      const img = new Image();
      img.src = source;
      await new Promise((resolve) => { img.onload = resolve; });
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
      const finalBase64 = canvas.toDataURL("image/jpeg", 0.8);
      await onSave(finalBase64);
      setOpen(false);
      setSource(null);
    } catch {
      // Error handled by onSave caller
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={cn(
          "absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface transition-colors",
          currentAvatar
            ? "bg-surface-raised text-text-secondary hover:text-text-primary"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        aria-label="Upload photo"
      >
        <Camera size={14} />
      </button>

      {open && source && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-text-secondary" />
                <h3 className="text-base font-semibold text-text-primary">Crop Profile Picture</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image area */}
            <div
              ref={containerRef}
              className="relative mx-auto my-4 max-h-[400px] overflow-hidden cursor-crosshair"
              style={{ width: displayW || 400, height: displayH || 400 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={source}
                alt="Crop preview"
                className="block select-none pointer-events-none"
                style={{ width: displayW || "auto", height: displayH || "auto" }}
                draggable={false}
              />

              {/* Crop overlay */}
              {displayW > 0 && displayH > 0 && (
                <div
                  className="absolute border-2 border-white shadow-lg"
                  style={{
                    left: crop.x,
                    top: crop.y,
                    width: crop.size,
                    height: crop.size,
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Corner handles */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full border-2 border-white bg-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-primary" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-white bg-primary" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-primary" />
                </div>
              )}
            </div>

            {/* Hint */}
            <p className="text-center text-xs text-text-secondary mb-3 px-5">
              Drag to reposition the crop area. The final image will be {AVATAR_SIZE}x{AVATAR_SIZE}px.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCropConfirm} loading={saving}>
                <Check size={16} className="mr-1.5" />
                Save Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
