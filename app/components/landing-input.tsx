"use client";

import { isMobile } from "react-device-detect";
import { Dispatch, SetStateAction, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Textarea from "react-textarea-autosize";
import { Button } from "@/components/ui/button";

export default function LandingInputSection({
  handleSubmit,
  input,
  setInput,
  isLoading,
}: {
  handleSubmit: () => void;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !isMobile) {
      if (!event.shiftKey) {
        event.preventDefault();
        preHandleSubmit();
      }
    }
  };

  const preHandleSubmit = () => {
    if (input.trim().length > 0) {
      handleSubmit();
    }
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="space-y-4 pb-16">
      <div className="relative flex items-center w-full">
        <Textarea
          autoFocus
          disabled={isLoading}
          value={input}
          rows={1}
          maxRows={12}
          ref={inputRef}
          onHeightChange={(height) => {
            // Ensure inputRef.current is defined
            if (!inputRef.current) return;

            // The initial height and left padding is 70px and 2rem
            const initialHeight = 70;
            // The initial border radius is 32px
            const initialBorder = 32;
            // The height is incremented by multiples of 20px
            const multiple = (height - initialHeight) / 20;

            // Decrease the border radius by 4px for each 20px height increase
            const newBorder = initialBorder - 4 * multiple;
            // The lowest border radius will be 8px
            inputRef.current.style.borderRadius = Math.max(8, newBorder) + "px";
          }}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ฉันอยากรู้ว่า..."
          className="resize-none w-full min-h-12 rounded-fill bg-muted border border-input pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'"
          onKeyDown={(event) => handleKeyDown(event)}
        />
        <Button
          type="submit"
          onClick={() => preHandleSubmit()}
          size={"icon"}
          variant={"ghost"}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          disabled={isLoading || input.length === 0}
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
}
