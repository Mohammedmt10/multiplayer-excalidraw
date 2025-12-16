"use client";

import { useEffect, useState } from "react";

export default function ClientToken({
  children,
}: {
  children: (token: string) => React.ReactNode;
}) {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  return <>{children(token)}</>;
}
