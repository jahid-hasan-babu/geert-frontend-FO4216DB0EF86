"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("english")

  const handleSubmit = () => {
    console.log("Selected language:", selectedLanguage)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Language</h2>
          </div>

          <div className="space-y-4 mb-6">
            <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border bg-blue-50 border-blue-200">
                <RadioGroupItem value="english" id="english" className="text-blue-600" />
                <Label htmlFor="english" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                  English
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <RadioGroupItem value="dutch" id="dutch" />
                <Label htmlFor="dutch" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                  Dutch
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-base font-medium rounded-full"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
