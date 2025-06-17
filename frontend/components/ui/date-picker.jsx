"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DatePicker({ className, value, onChange, minDate }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef(null)

  const handleButtonClick = () => {
    inputRef.current?.showPicker()
  }

  const handleDateChange = (e) => {
    const date = new Date(e.target.value)
    onChange(date)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={handleButtonClick}
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP") : <span>Pick a date</span>}
      </Button>
      <input
        ref={inputRef}
        type="date"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        value={value ? format(value, "yyyy-MM-dd") : ""}
        onChange={handleDateChange}
        min={minDate ? format(minDate, "yyyy-MM-dd") : undefined}
      />
    </div>
  )
}