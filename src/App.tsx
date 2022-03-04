import "./styles.css";

import {
  CardViewerRenderedFields,
  renderFields
} from "@highnoteplatform/card-viewer";
import type {
  CardViewerError,
  CardViewerFieldsInputError,
  CardViewerRequestError,
  InvalidCredentialError
} from "@highnoteplatform/card-viewer";
import React, { useEffect, useState } from "react";

interface UseCardViewerInput {
  clientToken: string;
  paymentCardId: string;
  // cardNumberRef: React.MutableRefObject<HTMLElement | null>;
  // cvvRef: React.MutableRefObject<HTMLElement | null>;
  // expirationDateRef: React.MutableRefObject<HTMLElement | null>;
}

// TODO: Need to use refs
const useCardViewer = ({
  clientToken,
  paymentCardId
}: UseCardViewerInput): {
  toggleCardNumberMask: CardViewerRenderedFields["toggleCardNumberMask"] | null;
} => {
  const [toggleCardNumberMask, setToggleCardNumberMask] = useState<
    CardViewerRenderedFields["toggleCardNumberMask"] | null
  >(null);

  const setUpFields = async () => {
    const renderedFields = await renderFields({
      clientToken,
      paymentCardId,

      onError: (
        error:
          | CardViewerError
          | CardViewerFieldsInputError
          | CardViewerRequestError
          | InvalidCredentialError
      ) => {
        // eslint-disable-next-line no-console
        console.error(`[Integrator error handler]:`, error);
      },

      elements: {
        cardNumber: {
          selector: "#cardNumber"
        },
        cvv: {
          selector: "#cvv"
        },
        expirationDate: {
          selector: "#expirationDate"
        }
      }
    });

    setToggleCardNumberMask(() => {
      return renderedFields.toggleCardNumberMask;
    });
  };

  useEffect(() => {
    setUpFields();
  }, []);

  return { toggleCardNumberMask };
};

export default function App() {
  const { toggleCardNumberMask } = useCardViewer({
    clientToken: "",
    paymentCardId: ""
  });

  const handleToggle = async () => {
    if (toggleCardNumberMask) {
      await toggleCardNumberMask();
    }
  };

  return (
    <div className="App">
      <div id="cardNumber"></div>
      <button id="toggle" onClick={handleToggle}>
        Toggle
      </button>
      <div id="cvv"></div>
      <div id="expirationDate"></div>
    </div>
  );
}
