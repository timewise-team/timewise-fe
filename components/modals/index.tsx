import { useCardModal } from "@/hooks/useCardModal";
import { CardWithList } from "@/types/Board";
import { useQuery } from "@tanstack/react-query";
import {Dialog, DialogContent, DialogTitle} from "../ui/dialog";
import Description from "./description";
import Actions from "./actions";
import Header from "./header";
import { getCardByID } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Content from "./content";
import Tab from "./tab";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import * as React from "react";

const CardModal = () => {
  const { id, isOpen, onClose, workspaceId } = useCardModal((state) => ({
    id: state.id,
    workspaceId: state.workspaceId,
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

  const { data: session } = useSession();
  const params = useParams();

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["detailCard", id],
    queryFn: async () => {
      const data = await getCardByID(
        { cardId: id, organizationId: params.organizationId || workspaceId },
        session
      );
      return data;
    },
    enabled: !!id && !!session,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white lg:max-w-[800px] max-h-[95vh] overflow-auto">
        <VisuallyHidden>
          <DialogTitle>Command Dialog</DialogTitle>
        </VisuallyHidden>
        {cardData ? <Header data={cardData} /> : <Header.Skeleton />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {cardData ? <Content data={cardData} /> : <Content.Skeleton />}
              {cardData ? (
                <Description data={cardData} />
              ) : (
                <Description.Skeleton />
              )}
              <Tab id={id} data={cardData} />
            </div>
          </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
