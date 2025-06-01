// src/pages/LandingRedirect.tsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingRedirect() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const role = user?.publicMetadata?.role;
    if (role === "admin" || role === "editor") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, navigate]);

  return null; // or a spinner
}
