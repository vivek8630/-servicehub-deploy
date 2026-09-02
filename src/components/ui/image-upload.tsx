'use client'

import { useState, useRef } from 'react'
import { UploadCloud, X, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react'
import { Button } from './button'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
  accept?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Upload Image',
  accept = 'image/*',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        onChange(data.url)
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch {
      alert('Upload failed due to network error')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}

      {value ? (
        <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
          <img src={value} alt="Uploaded file" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl text-xs"
            >
              Change
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
                className="rounded-xl text-xs"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
            dragOver ? 'border-violet-500 bg-violet-50/50 scale-[0.99]' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center text-violet-600 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-medium">Uploading file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-slate-500 gap-1">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Click to upload or drag & drop</p>
              <p className="text-[10px] text-slate-400">PNG, JPG, WEBP or PDF up to 5MB</p>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
          }
        }}
        className="hidden"
      />
    </div>
  )
}
