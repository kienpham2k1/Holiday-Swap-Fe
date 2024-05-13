import { useParams } from "next/navigation";
import { useMemo } from "react";

const useExchange = () => {
  const params = useParams();

  const exchangeId = useMemo(() => {
    if (!params?.exchangeId) {
      return "";
    }
    return params.exchangeId as string;
  }, [params?.exchangeId]);

  const isOpen = useMemo(() => !!exchangeId, [exchangeId]);

  return {
    exchangeId,
    isOpen
  };
};

export default useExchange;
