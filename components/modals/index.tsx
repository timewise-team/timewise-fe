const CardModal = () => {
  return <div>gelloasdas</div>;
};
// const { id, isOpen, onClose } = useCardModal((state) => ({
//   id: state.id,
//   isOpen: state.isOpen,
//   onClose: state.onClose,
// }));

// const { data: cardData } = useQuery<CardWithList>({
//   queryKey: ["card", id],
//   queryFn: () => fetcher(`/api/cards/${id}`),
// });
// return (
//   <Dialog open={isOpen} onOpenChange={onClose}>
//     <DialogContent>
//       {cardData ? <Header data={cardData} /> : <Header.Skeleton />}
//       <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
//         <div className="w-full space-y-6">
//           {cardData ? (
//             <Description data={cardData} />
//           ) : (
//             <Description.Skeleton />
//           )}
//         </div>
//       </div>
//       {cardData ? <Actions data={cardData} /> : <Actions.Skeleton />}
//     </DialogContent>
//   </Dialog>
// );
// };

export default CardModal;
