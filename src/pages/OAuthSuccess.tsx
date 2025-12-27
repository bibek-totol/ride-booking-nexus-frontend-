import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userParam = params.get("user");

    if (!accessToken || !refreshToken || !userParam) {
      navigate("/login", { replace: true });
      return;
    }

    const user = JSON.parse(decodeURIComponent(userParam));

  
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    
    navigate(`/${user.role}`, { replace: true });

  }, [navigate]);

  return <div>Logging in with Google...</div>;
}
