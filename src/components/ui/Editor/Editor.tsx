"use client"

import { useState } from "react"
import SunEditor from "suneditor-react"
import "suneditor/dist/css/suneditor.min.css"

interface EditorProps {
  contents?: string
  onBlur?: () => void
  onSave: (content: string) => void
}



export default function Editor({ contents = "", onBlur, onSave }: EditorProps) {

  const [content, setContent] = useState(contents)

  const handleChange = (value: string) => {
    setContent(value)
    onSave(value)
  }

  const handleBlur = () => {
    if (onBlur) onBlur()
  }








  return (
    <div className="w-full">
      <SunEditor
        setContents={content}
        onChange={handleChange}
        onBlur={handleBlur}
        height="400px"
        setOptions={{
          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["bold", "underline", "italic", "strike"],
            ["fontColor", "hiliteColor"],
            ["align", "list", "link"],
            ["table", "image", "video"],
            ["fullScreen", "codeView"],
          ],
          imageMultipleFile: true,
          imageUploadSizeLimit: 5000000, // 5MB
        }}
      />

    
    </div>
  )
}
