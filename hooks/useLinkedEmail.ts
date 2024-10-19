import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useLinkedEmails = () => {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["linked-email"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user_emails/get-linked-email`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    },
    enabled: !!session,
  });

  return { linkedEmails: data, isLoading };
};
