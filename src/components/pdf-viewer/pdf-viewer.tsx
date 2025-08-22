import { component$, h, isServer, useComputed$, useSignal, useStore, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { ScrollArea } from '../ui/scroll-area/scroll-area';

export interface PdfViewerProps {
  fileId: string;
  authToken: string;
  store: PdfViewerStore;
}
export interface PdfViewerStore {
  filename: string;
  scale: number;
}

export const usePdfViewerStore = () => {
  return useStore<PdfViewerStore>({
    filename: '',
    scale: 1.0,
  });
};

const widthMM = 210;
const heightMM = 297;
const mmToPoints = 72/25.4;

export const PdfViewer = component$<PdfViewerProps>((props) => {
  const pdfContainer = useSignal<HTMLDivElement>();
  const loading = useSignal(true);
  const error = useSignal('');
  const containerWidth = useSignal(0);
  const clickPosition = useSignal({ x: 0, y: 0, relativeX: 0, relativeY: 0, pageNum: 0 });
  
  const pdfDocument = useSignal<PDFDocumentProxy>();

  useTask$(({ track }) => {
    const width = track(() => containerWidth.value);

    if (isServer) return;

    if (width === 0) props.store.scale = 1.0;
    else if (width < 640) props.store.scale = 0.8;
    else if (width < 768) props.store.scale = 1.0;
    else if (width < 1024) props.store.scale = 1.2;
    else props.store.scale = 2.0;
  });

  useVisibleTask$(({ cleanup }) => {
    if (!pdfContainer.value || isServer) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        requestAnimationFrame(() => {
          containerWidth.value = entry.contentRect.width;
        });
      }
    });

    resizeObserver.observe(pdfContainer.value);
    cleanup(() => resizeObserver.disconnect());
  });

  useVisibleTask$(async () => {
    try {
      if (isServer) return;

      loading.value = true;
      error.value = '';

      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}documents/download?document_id=${props.fileId}`,
        {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${props.authToken}` }
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('Authentication required. Please log in.');
        if (response.status === 403) throw new Error('You do not have permission to access this document.');
        if (response.status === 404) throw new Error('Document not found.');
        throw new Error(`Failed to load document (Error ${response.status})`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          props.store.filename = filenameMatch[1];
        }
      }

      const pdfData = await response.arrayBuffer();
      const loadedPdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      
      pdfDocument.value = loadedPdf;

    } catch (err: any) {
      console.error('PDF fetch error:', err);
      error.value = err.message || 'An unexpected error occurred.';
    } finally {
      loading.value = false;
    }
  });

  useVisibleTask$(async ({ track, cleanup }) => {
    const currentScale = track(() => props.store.scale);

    const pdf = track(() => pdfDocument.value);
    const container = pdfContainer.value;

    if (!pdf || !container || isServer) return;

    container.innerHTML = ''; 
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: currentScale });

      const canvas = document.createElement('canvas');
      canvas.id = 'pdf-viewer';
      const context = canvas.getContext('2d');
      if (!context) continue;

      const pdfWidthPoints = viewport.width;
      const pdfHeightPoints = viewport.height;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.marginBottom = '1rem';
      canvas.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      canvas.dataset.pageNum = String(pageNum);

      container.appendChild(canvas);

      page.render({
        canvasContext: context,
        canvas,
        viewport
      });

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'CANVAS') return;

        const canvas = target as HTMLCanvasElement;
        const pageNum = parseInt(canvas.dataset.pageNum || '1');
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const pdfX = (x / rect.width) * pdfWidthPoints;
        const pdfY = pdfHeightPoints - (y / rect.height) * pdfHeightPoints;

        const mmX = pdfX / mmToPoints /props.store.scale;
        const mmY = pdfY / mmToPoints /props.store.scale;
        const relativeX = (mmX / widthMM) * 100;
        const relativeY = (mmY / heightMM) * 100;

        clickPosition.value = {
          x: mmX,
          y: mmY,
          pageNum,
          relativeX,
          relativeY
        };

        console.log(`Clicked at page ${pageNum}: ${mmX.toFixed(1)}mm x ${mmY.toFixed(1)}mm (${relativeX.toFixed(1)}%, ${relativeY.toFixed(1)}%)`);
      }

      container.addEventListener('click', handleClick);
      cleanup(() => container.removeEventListener('click', handleClick));
      
    }
  });

  return (
    <ScrollArea>
      <div class="items-center">
        {loading.value && (
          <div class="flex flex-col items-center justify-center p-8 text-gray-500 flex-1">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"/>
            <p>Loading document...</p>
          </div>
        )}
        
        {error.value && !loading.value && (
          <div class="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded-md w-full max-w-2xl">
            {error.value}
          </div>
        )}
        
        <div 
          ref={pdfContainer} 
          class={`flex flex-col w-full pdf-viewer transition-opacity duration-300 justify-center items-center ${
            loading.value || error.value ? 'hidden' : 'block'
          }`}
        />
        
      </div>
    </ScrollArea>
  );
});
