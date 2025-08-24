import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import * as PdfJsLib from 'pdfjs-dist'
import { isServer } from '@builder.io/qwik/build'
import type { PdfViewerStore } from '../pdf-loader/pdf-loader'

export interface PdfViewerProps {
  pdfUrl: string
  store: PdfViewerStore
}

const widthMM = 210
const heightMM = 297
const mmToPoints = 72 / 25.4

export const PdfViewer = component$<PdfViewerProps>(({ pdfUrl, store }) => {
  const pdfContainer = useSignal<HTMLDivElement>()
  const containerWidth = useSignal(0)
  const clickPosition = useSignal({ x: 0, y: 0, relativeX: 0, relativeY: 0, pageNum: 0 })
  const pdfDocSig = useSignal<PDFDocumentProxy>()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    if (!pdfUrl) return
    PdfJsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJsLib.version}/pdf.worker.min.mjs`;
    const pdf = await PdfJsLib.getDocument(pdfUrl).promise;
    pdfDocSig.value = pdf
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const width = track(() => containerWidth.value)
    if (isServer) return
    if (width === 0) store.scale = 1.0
    else if (width < 640) store.scale = 0.6
    else if (width < 768) store.scale = 1.0
    else if (width < 1024) store.scale = 1.2
    else store.scale = 2.0
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (!pdfContainer.value) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })
    resizeObserver.observe(pdfContainer.value)
    cleanup(() => resizeObserver.disconnect())
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track, cleanup }) => {
    const currentScale = track(() => store.scale)
    const pdf = pdfDocSig.value
    const container = pdfContainer.value

    if (!pdf || !container) return

    container.innerHTML = ''

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page: PDFPageProxy = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: currentScale })
      const unscaledViewport = page.getViewport({ scale: 1.0 })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) continue

      canvas.height = viewport.height
      canvas.width = viewport.width
      canvas.style.marginBottom = '1rem'
      canvas.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'

      canvas.dataset.pageNum = String(pageNum)
      canvas.dataset.originalWidth = String(unscaledViewport.width)
      canvas.dataset.originalHeight = String(unscaledViewport.height)

      container.appendChild(canvas)

      await page.render({ canvasContext: context, canvas, viewport }).promise
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName !== 'CANVAS') return

      const canvas = target as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()

      const pageNum = parseInt(canvas.dataset.pageNum || '1')
      const originalWidth = parseFloat(canvas.dataset.originalWidth || '0')
      const originalHeight = parseFloat(canvas.dataset.originalHeight || '0')

      if (originalWidth === 0 || originalHeight === 0) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const pdfX = (x / rect.width) * originalWidth
      const pdfY = originalHeight - (y / rect.height) * originalHeight

      const mmX = pdfX / mmToPoints
      const mmY = pdfY / mmToPoints

      const relativeX = (mmX / widthMM) * 100
      const relativeY = (mmY / heightMM) * 100

      clickPosition.value = { x: mmX, y: mmY, pageNum, relativeX, relativeY }
      console.log(
        `Clicked at page ${pageNum}: ${mmX.toFixed(1)}mm x ${mmY.toFixed(1)}mm (${relativeX.toFixed(1)}%, ${relativeY.toFixed(1)}%)`
      )
    }

    container.addEventListener('click', handleClick)
    cleanup(() => container.removeEventListener('click', handleClick))
  })

  return (
    <div
      ref={pdfContainer}
      class="flex flex-col w-full pdf-viewer justify-center items-center"
    />
  )
})
