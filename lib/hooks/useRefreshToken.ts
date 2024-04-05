"use client";

import axios from "@/lib/axios";
import { signIn, useSession } from "next-auth/react";
export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    try {
      console.log("resfreshing token");
      const res = await axios.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user.refreshToken}`,
          },
        }
      );
      if (session) {
        update({
          ...session,
          user: {
            ...session?.user,
            accessToken: res.data.accessToken,
          },
        });
        session.user.accessToken = res.data.accessToken;
      } else signIn();
    } catch (error) {
      signIn();
    }
  };
  return refreshToken;
};
