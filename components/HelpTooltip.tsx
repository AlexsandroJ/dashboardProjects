// components/HelpTooltip.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import {
  useFloating,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  offset,
  flip,
  shift,
} from "@floating-ui/react";

interface HelpTooltipProps {
  title: string;
  description: string;
  example?: string;
}

const HelpTooltip = ({ title, description, example }: HelpTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right",
    middleware: [
      offset(10), // distância entre botão e tooltip
      flip(),     // muda posição se não couber
      shift(),    // ajusta posição suavemente
    ],
  });

  const hover = useHover(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <div className="relative inline-block">
      {/* Botão de ajuda */}
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        className="text-blue-500 hover:text-blue-700 focus:outline-none"
        aria-label="Ajuda"
      >
        <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
      </button>

      {/* Tooltip dentro de um portal (para evitar problemas com overflow) */}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="
              z-50 w-80 max-w-[90vw] p-4 mt-2 bg-white border border-gray-300 rounded shadow-lg
              text-sm text-gray-700 overflow-auto max-h-[80vh] transition-opacity duration-200
            "
          >
            <h4 className="font-semibold mb-2">{title}</h4>
            <p>{description}</p>
            {example && (
              <>
                <hr className="my-2" />
                <p className="text-gray-600 italic">Exemplo:</p>
                <pre className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs overflow-x-auto">
                  {example}
                </pre>
              </>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

export default HelpTooltip;