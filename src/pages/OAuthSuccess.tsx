
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const role = params.get("role"); 



    if (accessToken && refreshToken && role) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      
      if (role == "rider") navigate("/rider");
      else if (role == "driver") navigate("/driver");
      else navigate("/login"); 
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Logging in...</div>;
}
