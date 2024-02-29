import { cn } from "@/lib/utils";

interface HeadingTextProps {
  title: string;
  description: string;
  color?: string;
}

const HeadingText = ({ title, description, color }: HeadingTextProps) => {
  return (
    <div className="">
      <h1 className={cn("text-3xl font-bold  mb-0 pb-0", color)}>{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default HeadingText;
