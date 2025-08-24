import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { PdfViewer } from "../pdf-viewer/pdf-viewer"

export interface PdfLoaderProps { fileId: string; authToken: string; }
export interface PdfViewerStore { filename: string, scale: number }

export const PdfLoader = component$<{ store: PdfViewerStore, props: PdfLoaderProps }>(({ store, props }) => {
  const loading = useSignal(true)
  const error = useSignal<string | null>(null)
  const pdfUrlSig = useSignal<string | null>(null)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    try {
      loading.value = true
      error.value = null

      const apiUrl = `${import.meta.env.VITE_API_URL}documents/${props.fileId}/`

      const res = await fetch(apiUrl, {
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${props.authToken}`,
        },
      })
      if (!res.ok) throw new Error(`Failed to load PDF: ${res.statusText}`)

      const arrayBuffer = await res.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: "application/pdf" })
      pdfUrlSig.value = URL.createObjectURL(blob)

    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  })

  return (
    <div class="relative flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      {loading.value && (
        <div class="animate-pulse text-gray-600 dark:text-gray-300">
          Loading PDF...
        </div>
      )}
      {error.value && (
        <div class="text-red-600 dark:text-red-400">{error.value}</div>
      )}
      {!loading.value && !error.value && pdfUrlSig.value && (
        <PdfViewer pdfUrl={pdfUrlSig.value} store={store} />
      )}
    </div>
  )
})