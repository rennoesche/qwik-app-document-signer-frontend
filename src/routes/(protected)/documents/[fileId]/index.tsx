import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { LuDownload, LuZoomIn, LuZoomOut } from '@qwikest/icons/lucide';
import { PdfViewer, usePdfViewerStore } from '~/components/pdf-viewer/pdf-viewer';

export const useAuthToken = routeLoader$(async ({cookie}) => {
  return {
    token: cookie.get('access_token')?.value || ''
  }
})

export const useFileId = routeLoader$(({ params }) => {
  return params.fileId;
});

export default component$(() => {
  const tokenAuth = useAuthToken();
  const fileId = useFileId();
  const pdfStore = usePdfViewerStore();

  return (
    <div class="w-full h-full bg-background rounded-xl border flex flex-col overflow-hidden">
          <header class="sticky top-0 flex py-4 border-b bg-background/95 backdrop-blur-xl rounded-t-xl shrink-0 items-center gap-2">
            <div class="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-8">
              <div class="w-full flex items-center">
                <h1 class="text-base font-bold py-1">{pdfStore.filename}</h1>
              </div>
              <div class="w-full flex items-center justify-center">
                <button class="rounded-full hover:bg-accent p-2" onClick$={()=>{if (pdfStore.scale < 3.0) {
                pdfStore.scale += 0.1;
              }}}>
                  <LuZoomIn class="size-5 cursor-pointer"/>
                </button>
                <span class="text-sm font-mono px-2 py-1 rounded w-16 text-center">
                  {Math.round(pdfStore.scale * 100).toFixed(0)}%
                </span>
                <button class="rounded-full hover:bg-accent p-2" onClick$={()=>{if (pdfStore.scale > 0.5) {
                pdfStore.scale -= 0.1;
              }}}>
                  <LuZoomOut class="size-5 cursor-pointer"/>
                </button>
              </div>
              <div class="w-full flex items-center justify-end">
                <button class="rounded-full hover:bg-accent p-2">
                  <LuDownload class="size-5 cursor-pointer"/>
                </button>
              </div>
            </div>
          </header>
    <PdfViewer fileId={fileId.value} authToken={tokenAuth.value.token} store={pdfStore} />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'PDF Viewer',
};