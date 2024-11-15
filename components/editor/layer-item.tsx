import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageLayer } from "@/types/editor";

interface LayerItemProps {
  layer: ImageLayer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onVisibilityToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

const LayerItem = ({
  layer,
  isSelected,
  onSelect,
  onVisibilityToggle,
  onOpacityChange,
}: LayerItemProps) => {
  return (
    <div
      className={cn(
        "p-2 rounded-md cursor-pointer hover:bg-accent mb-2 transition-colors duration-200",
        isSelected && "bg-accent ring-2 ring-primary"
      )}
      onClick={() => onSelect(layer.id)}
    >
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-md overflow-hidden">
          <Image
            src={layer.imageUrl}
            alt={layer.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm truncate">{layer.name}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onVisibilityToggle(layer.id);
              }}
            >
              {layer.isVisible ? (
                <EyeOpenIcon className="w-4 h-4" />
              ) : (
                <EyeClosedIcon className="w-4 h-4" />
              )}
            </Button>
            <Slider
              className="w-20"
              value={[layer.opacity * 100]}
              onValueChange={([value]) => {
                onOpacityChange(layer.id, value / 100);
              }}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { LayerItem }; 