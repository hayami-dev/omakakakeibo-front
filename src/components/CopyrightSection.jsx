import { useNavigate } from "react-router";
import Button from "./ui/Button";

export default function CopyrightSection() {
  const navigate = useNavigate();

  return (
    <div className="h-fit flex p-4 pt-0 justify-between items-center">
      <small>© 2026 Omakakakeibo</small>
      <Button
        variant="text"
        size="sm"
        className="w-fit!"
        onClick={() => navigate("/license")}
      >
        license
      </Button>
    </div>
  );
}
