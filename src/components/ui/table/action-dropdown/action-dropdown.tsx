import { component$, useSignal, $, QRL } from '@builder.io/qwik';
import { LuMoreVertical, LuEye, LuDownload, LuPenSquare } from '@qwikest/icons/lucide';
import type { Document } from '~/utils/documents';

interface ActionDropdownProps {
  document: Document;
  onView$?: QRL<(doc: Document) => void>;
  onDownload$?: QRL<(doc: Document) => void>;
  onSign$?: QRL<(doc: Document) => void>;
}

export const ActionDropdown = component$<ActionDropdownProps>((props) => {
  const isOpen = useSignal(false);

  const handleAction = $((action: QRL<(doc: Document) => void> | undefined) => {
    if (action) {
      action(props.document);
    }
    isOpen.value = false;
  });

  return (
    <div class="relative inline-block rounded-md text-left">
      <button
        onClick$={() => isOpen.value = !isOpen.value}
        onBlur$={() => setTimeout(() => isOpen.value = false, 150)} // blur, delay 150
        class="p-2 rounded-md hover:bg-accent"
      >
        <LuMoreVertical class="h-5 w-5" />
      </button>

      {isOpen.value && (
        <div class="origin-top-right absolute rounded-lg right-0 mt-1 p-1 w-48 shadow-lg bg-background z-10">
          <div class="flex flex-col gap-y-1" role="menu" aria-orientation="vertical">
            <button onClick$={() => handleAction(props.onView$)} class="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground" role="menuitem">
              <LuEye class="size-4" /> View
            </button>
            <button onClick$={() => handleAction(props.onDownload$)} class="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground" role="menuitem">
              <LuDownload class="size-4" /> Download
            </button>
            { props.document.allowed_signer.length !== props.document.signed_count && (
              <>
              <hr/>
              <button onClick$={() => handleAction(props.onSign$)} class="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground text-primary" role="menuitem">
                <LuPenSquare class="size-4" /> Sign
              </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});