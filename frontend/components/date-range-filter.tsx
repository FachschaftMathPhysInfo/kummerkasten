import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@/components/ui/button"
import {CalendarIcon} from "lucide-react"
import {format} from "date-fns"
import * as React from "react"

interface DateRangeFilterProps {
    startDate: Date | null
    setStartDate: (date: Date | null) => void
    endDate: Date | null
    setEndDate: (date: Date | null) => void
}

export function DateRangeFilter({startDate, setStartDate, endDate, setEndDate}: DateRangeFilterProps) {
    return (
        <div className="flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="max-w-[100px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {startDate ? format(startDate, "PPP") : <span>Start</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={startDate || undefined}
                        onSelect={(date) => setStartDate(date || null)}
                    />
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="max-w-[100px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {endDate ? format(endDate, "PPP") : <span>Ende</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={endDate || undefined}
                        onSelect={(date) => setEndDate(date || null)}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
