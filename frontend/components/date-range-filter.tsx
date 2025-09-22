import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@/components/ui/button"
import {CalendarIcon, RotateCcw} from "lucide-react"
import {format} from "date-fns"
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import * as React from "react"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";

interface DateRangeFilterProps {
  startDate: Date | null
  setStartDate: (date: Date | null) => void
  endDate: Date | null
  setEndDate: (date: Date | null) => void
  mobile?: boolean
}

export function DateRangeFilter({startDate, setStartDate, endDate, setEndDate, mobile}: DateRangeFilterProps) {
  if (mobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-row gap-4 items-start justify-center">
          <div className="flex flex-row items-center gap-0">
            <Sheet>
              <SheetHeader className="m-0 p-0">
                <SheetTitle className="m-0 p-0">
                  <VisuallyHidden>Date Picker</VisuallyHidden>
                </SheetTitle>
              </SheetHeader>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className={"w-fit justify-between"}
                  data-cy={'calendar-start'}
                >
                  {startDate ? format(startDate, "dd.MM.yy") : "Start"}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[350px] p-2 items-center">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={(date) => setStartDate(date || null)}
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className="mt-1"> bis</div>
          <div className="flex flex-row items-center gap-0">
            <Sheet>
              <SheetHeader className="m-0 p-0">
                <SheetTitle className="m-0 p-0">
                  <VisuallyHidden>Date Picker</VisuallyHidden>
                </SheetTitle>
              </SheetHeader>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className={"w-fit justify-between"}
                  data-cy={'calendar-end'}
                >
                  {endDate ? format(endDate, "dd.MM.yy") : "Ende"}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[350px] p-2 items-center">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={(date) => setEndDate(date || null)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex items-center mt-2 mb-0">
          {(startDate || endDate) && (
            <div className="flex items-center mt-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center gap-2"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <RotateCcw/> Zurücksetzen
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(!!startDate && "border !border-accent")}
                  data-cy="desktop-calendar-start">
            <CalendarIcon className="mr-1 h-4 w-4"/>
            {startDate ? format(startDate, "dd.MM.yy") : <span>Start</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className={'flex flex-col'}>
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => setStartDate(date || null)}
              hidden={endDate ? {after: endDate} : undefined}
            />
            <Button
              variant={"outline"}
              disabled={!startDate}
              onClick={() => setStartDate(null)}
              className={'w-full justify-center items-center gap-2'}
              data-cy={'start-calendar-reset'}
            >
              <RotateCcw/>
              Zurücksetzen
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(!!endDate && "border !border-accent")} data-cy="desktop-calendar-end">
            <CalendarIcon className="mr-1 h-4 w-4"/>
            {endDate ? format(endDate, "dd.MM.yy") : <span>Ende</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className={'flex flex-col'}>
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => setEndDate(date || null)}
              hidden={startDate ? {before: startDate} : undefined}
            />
            <Button
              variant={"outline"}
              disabled={!endDate}
              onClick={() => setEndDate(null)}
              className={'w-full justify-center items-center gap-2'}
              data-cy={'end-calendar-reset'}
            >
              <RotateCcw/>
              Zurücksetzen
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
