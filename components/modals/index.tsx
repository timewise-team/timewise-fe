import { useCardModal } from "@/hooks/useCardModal";
import { CardWithList, Workspace } from "@/types/Board";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "../ui/dialog";
import Description from "./description";
import Actions from "./actions";
import Header from "./header";
import { fetchWorkspaceDetails, getCardByID } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Content from "./content";
import Tab from "./tab";
import * as React from "react";
import { checkSchedulePermission, ScheduleAction } from "@/constants/roles";
import { useStateContext } from "@/stores/StateContext";
import { getUserEmailByWorkspace } from "@/utils/userUtils";
import { Layout } from "lucide-react";
import { Separator } from "../ui/separator";

const CardModal = () => {
  const { id, isOpen, onClose, workspaceId } = useCardModal((state) => ({
    id: state.id,
    workspaceId: state.workspaceId,
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

  const { data: session } = useSession();
  const params = useParams();
  const { stateWorkspacesByEmail, stateUserEmails } = useStateContext();

  const { data: workspace } = useQuery<Workspace>({
    queryKey: ["workspaceDetails", params.organizationId],
    queryFn: () =>
      fetchWorkspaceDetails(params.organizationId as string, session),
    enabled: !!params.organizationId,
  });

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["detailCard", id],
    queryFn: async () => {
      const userEmail = getUserEmailByWorkspace(
        stateUserEmails,
        stateWorkspacesByEmail,
        Number(params.organizationId || workspaceId)
      );
      if (!userEmail) {
        return null;
      }
      return await getCardByID(
        {
          cardId: id,
          organizationId: params.organizationId || workspaceId,
          userEmail: userEmail.email,
        },
        session
      );
    },
    enabled: !!id && !!session,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white lg:max-w-[700px] max-h-[95vh] overflow-auto">
        {workspace ? (
          <div className="flex flex-row gap-x-2 items-center">
            <Layout className="w-5 h-5 mt-1 text-neutral-700" />
            <h1 className=" font-medium">
              {"|"} {workspace.title} {"/"}
            </h1>
            <h1 className="font-medium">{cardData?.status}</h1>
          </div>
        ) : (
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        )}
        <Separator />

        <div className="flex flex-row justify-between">
          {cardData ? (
            <div>
              <Header data={cardData} />
            </div>
          ) : (
            <Header.Skeleton />
          )}
          {cardData ? (
            <Actions
              data={cardData}
              organizationId={
                params.organizationId?.toString() || (workspaceId as string)
              }
            />
          ) : (
            <Actions.Skeleton />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-4">
            <div className="w-full space-y-5">
              {cardData ? <Content data={cardData} /> : <Content.Skeleton />}

              {cardData ? (
                <Description
                  data={cardData}
                  disabled={
                    !checkSchedulePermission(
                      cardData.extra_data,
                      ScheduleAction.description
                    )
                  }
                />
              ) : (
                <Description.Skeleton />
              )}

              <Tab id={id} data={cardData} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
