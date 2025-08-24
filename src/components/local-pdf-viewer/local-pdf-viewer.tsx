import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export const LocalPdfViewer = component$(() => {
  const pdfDocument = useSignal<PDFDocumentProxy>();
  const pdfContainer = useSignal<HTMLDivElement>();
  const isLoading = useSignal(false);
  const error = useSignal('');
  const scale = useSignal(1.5);

  const handleFileChange = $(async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    pdfDocument.value = undefined;
    error.value = '';

    if (!file || file.type !== 'application/pdf') {
      error.value = 'Silakan pilih file dengan format .pdf';
      return;
    }

    isLoading.value = true;

    try {
      const pdfjsLib = await import('pdfjs-dist');

      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const fileReader = new FileReader();
      const promise = new Promise<ArrayBuffer>((resolve, reject) => {
        fileReader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        fileReader.onerror = (err) => reject(err);
        fileReader.readAsArrayBuffer(file);
      });

      const pdfData = await promise;
      const loadedPdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      pdfDocument.value = loadedPdf;

    } catch (err: any) {
      console.error('Gagal memuat PDF:', err);
      error.value = 'Gagal memuat atau membaca file PDF.';
    } finally {
      isLoading.value = false;
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    const pdf = track(() => pdfDocument.value);
    const currentScale = track(() => scale.value);
    const container = pdfContainer.value;

    if (!container) return;

    container.innerHTML = '';

    if (!pdf) return;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page: PDFPageProxy = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: currentScale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.marginBottom = '1rem';
      canvas.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

      container.appendChild(canvas);

      await page.render({
        canvasContext: context,
        canvas,
        viewport,
      }).promise;
    }
  });

  return (
    <div class="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      <div class="bg-gray-100 p-4 rounded-lg shadow-md mb-6 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <h2 class="text-lg font-semibold text-gray-700">Pilih File PDF Lokal</h2>
        <input
          type="file"
          accept=".pdf"
          class="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
          onChange$={handleFileChange}
        />
      </div>
      {isLoading.value && <p class="text-blue-600 my-4">Memuat dokumen...</p>}
      {error.value && <p class="text-red-600 bg-red-100 p-3 rounded-md my-4">{error.value}</p>}
      {pdfDocument.value && (
         <div class="text-center mb-4">
            <button onClick$={() => scale.value -= 0.2} class="bg-gray-200 px-3 py-1 rounded-l-md">-</button>
            <span class="bg-white px-4 py-1 border-y">Zoom: {(scale.value * 100).toFixed(0)}%</span>
            <button onClick$={() => scale.value += 0.2} class="bg-gray-200 px-3 py-1 rounded-r-md">+</button>
         </div>
      )}
      <div ref={pdfContainer} class="pdf-viewer-local" />
    </div>
  );
});