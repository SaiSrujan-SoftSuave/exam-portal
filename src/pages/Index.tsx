import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as jose from "jose";
import { ExamLogin } from "@/components/ExamLogin";

const Index = () => {
  const [userCode, setUserCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const location = useLocation();

  useEffect(() => {
    const decodeToken = async () => {
      const token = new URLSearchParams(location.search).get("token");
      if (token) {
        try {
          const secret = new TextEncoder().encode("SecretKEY@123");
          const { payload } = await jose.jwtVerify(token, secret, {
            algorithms: ["HS256"],
          });

          if (payload.user_code && payload.passcode) {
            setUserCode(payload.user_code as string);
            setPasscode(payload.passcode as string);
          }
          if (payload.candidateId) {
            localStorage.setItem('candidateId', String(payload.candidateId));
          }
        } catch (error) {
          console.error("Failed to decode or verify token:", error);
        }
      }
    };

    decodeToken();
  }, [location.search]);

  return <ExamLogin userCode={userCode} passcode={passcode} />;
};

export default Index;
