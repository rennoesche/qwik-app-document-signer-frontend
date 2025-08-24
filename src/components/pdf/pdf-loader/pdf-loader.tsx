import { component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { qwikify$ } from '@builder.io/qwik-react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Progress } from '../../ui/progress';
import { PdfViewer } from '../pdf-viewer/pdf-viewer';

const ProgressBar = qwikify$(Progress, { eagerness: 'idle' });

export interface PdfLoaderProps {
  fileId: string;
  authToken: string;
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

export const PdfLoader = component$<PdfLoaderProps>((props) => {
  const loading = useSignal(true);
  const error = useSignal('');
  const loadingProgress = useSignal(0);
  
  const pdfDocument = useSignal<PDFDocumentProxy>();
  
  const store = usePdfViewerStore();

  useVisibleTask$(async () => {
    try {
      loading.value = true;
      loadingProgress.value = 0;
      error.value = '';

      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      loadingProgress.value = 10;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}documents/download?document_id=${props.fileId}`,
        {
          credentials: 'include',
          headers: { Authorization: `Bearer ${props.authToken}` },
        }
      );
      loadingProgress.value = 30;

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
          store.filename = filenameMatch[1]; // Set filename di store
        }
      }

      loadingProgress.value = 50;
      const pdfData = await response.arrayBuffer();
      loadingProgress.value = 70;
      const loadedPdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      loadingProgress.value = 90;
      
      pdfDocument.value = loadedPdf;

    } catch (err: any) {
      console.error('PDF fetch error:', err);
      error.value = err.message || 'An unexpected error occurred.';
    } finally {
      loading.value = false;
      loadingProgress.value = 100;
    }
  });

  return (
    <div class="w-full items-center">
      {loading.value && (
        <div class="flex w-full flex-col items-center justify-center p-8 text-gray-500">
          <ProgressBar value={loadingProgress.value} />
          <p class="mt-2">Loading document... {loadingProgress.value}%</p>
        </div>
      )}

      {!loading.value && error.value && (
        <div class="mx-auto my-8 w-full max-w-2xl rounded-md border border-red-400 bg-red-100 p-4 text-center text-red-700">
          {error.value}
        </div>
      )}

      {!loading.value && !error.value && pdfDocument.value && (
        <PdfViewer pdfDocument={pdfDocument.value} store={store} />
      )}
    </div>
  );
});