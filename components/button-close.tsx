import { cn } from "@/lib/utils";
import CachedIcon from "@mui/icons-material/Cached";
import { Button, Tooltip } from "@mui/material";
const ButtonClose = ({
  onClick,
  className,
  classNameButton,
  ...props
}: {
  onClick: () => void;
  className?: string;
  classNameButton?: string;
  props?: any;
}) => {
  return (
    <div className={cn(" flex w-full justify-end mr-5 ", className)}>
      <Tooltip title="limpar dados">
        <Button
          {...props}
          variant="outlined"
          typeof="button"
          onClick={onClick}
          className="cursor-pointer mb-2"
        >
          <CachedIcon />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ButtonClose;
