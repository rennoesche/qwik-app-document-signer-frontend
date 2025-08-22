import { component$, $, useStore, useComputed$ } from '@builder.io/qwik';
import { LuArrowUpDown, LuCheckCircle, LuFilter, LuLoader } from '@qwikest/icons/lucide';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table/table';
import type { Document } from '~/utils/documents';
import { ActionDropdown } from '../ui/table/action-dropdown/action-dropdown';
import { CustomCheckbox } from '../ui/custom-checkbox/custom-checkbox';

type SortKey = 'file_name' | 'created_at' | 'signed_at';
type SordDirection = 'asc' | 'desc';

interface DocumentsTableProps {
  documents: Document[];
  onViewDocument$?: (document: Document) => void;
  onDownloadDocument$?: (document: Document) => void;
  onSignDocument$?: (document: Document) => void;
  isLoading?: boolean;
  state: stateFilter;
}

interface stateFilter {
  sort: {
    key: string,
    direction: string,
  },
  filter: string,
  selectedIds: number[],
}

export const stateFilter = () => {
  return useStore<stateFilter>({
    sort: {
      key: 'created_at' as SortKey,
      direction: 'desc' as SordDirection,
    },
    filter: "all",
    selectedIds: [],
  });
} 

export const DocumentsTable = component$<DocumentsTableProps>(({ 
  documents, 
  onViewDocument$,
  onDownloadDocument$, 
  onSignDocument$,
  isLoading = false,
  state
}) => {
  const processedDocuments = useComputed$(()=> {
    let filteredDocs = [...documents];

    if (state.filter === 'signed') {
      filteredDocs = filteredDocs.filter(doc => doc.signed_at);
    } else if (state.filter === 'pending') {
      filteredDocs = filteredDocs.filter(doc => !doc.signed_at);
    }

    filteredDocs.sort((a, b) => {
      const valA = a[state.sort.key as SortKey];
      const valB = b[state.sort.key as SortKey];

      if (valA === null) return 1;
      if (valB === null) return -1;
      if (valA < valB) return state.sort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return state.sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filteredDocs;
  });

  const handleSort = $((key: SortKey) => {
    if (state.sort.key === key) {
      state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.sort.key = key;
      state.sort.direction = 'asc';
    }
  });

  const handleSelectAll = $((checked: boolean) => {
    if (checked) {
      state.selectedIds = processedDocuments.value.map(doc => doc.id);
    } else {
      state.selectedIds = [];
    }
  });

  const handleSelectRow = $((docId: number, checked: boolean) => {
    if (checked) {
      state.selectedIds = [...state.selectedIds, docId];
    } else {
      state.selectedIds = state.selectedIds.filter(id => id !== docId);
    }
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = $((document: Document) => {
    if (document.signed_at) {
      return (
        <span class="inline-flex items-center justify-center rounded-md border py-0.5 text-xs text-muted-foreground px-1.5 font-medium w-fit whitespace-nowrap shrink-0 gap-1">
          <LuCheckCircle class="text-green-500"/>
          Signed ({document.signed_count}/{document.allowed_signer.length})
        </span>
      );
    }
    return (
      <span class="inline-flex items-center justify-center rounded-md border py-0.5 text-xs text-muted-foreground px-1.5 font-medium w-fit whitespace-nowrap shrink-0 gap-1">
        <LuLoader class="animate-spin"/>
        Pending
      </span>
    );
  });

  const isAllSelected = useComputed$(()=>
    processedDocuments.value.length > 0 && 
    state.selectedIds.length === processedDocuments.value.length
  );

  return (
    <>
      <div class="overflow-hidden rounded-lg h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-8">
                <CustomCheckbox
                    checked={isAllSelected.value}
                    onChange$={handleSelectAll}
                  />
              </TableHead>
              <TableHead>
                <button onClick$={()=> {handleSort('file_name')}} class="flex items-center gap-2 cursor-pointer hover:text-muted-foreground/80">
                Nama
                <LuArrowUpDown class="size-4"/>
                </button>
              </TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>
                <button onClick$={() => handleSort('created_at')} class="flex items-center gap-2 cursor-pointer hover:text-muted-foreground/80">
                  Waktu Unggah<LuArrowUpDown class="size-4"/>
                </button>
              </TableHead>
              <TableHead>
                <button onClick$={() => handleSort('signed_at')} class="flex items-center gap-2 cursor-pointer hover:text-muted-foreground/80">
                  Waktu Tanda Tangan<LuArrowUpDown class="size-4"/>
                </button>
              </TableHead>
              <TableHead class="">Penandatangan</TableHead>
              <TableHead class="">Status</TableHead>
              <TableHead class=""></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} class="text-center py-8">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto"></div>
                  <p class="mt-2 text-sm">Loading documents...</p>
                </TableCell>
              </TableRow>
            ) : processedDocuments.value.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} class="text-center py-8 ">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              processedDocuments.value.map((document) => {
                const isSelected = state.selectedIds.includes(document.id);
                return(
                  <TableRow key={document.id} class={`${isSelected? 'bg-muted/50': ''}`}>
                  <TableCell>
                    <CustomCheckbox
                        checked={isSelected}
                        onChange$={(checked) => {handleSelectRow(document.id, checked)}}
                      />
                  </TableCell>
                  <TableCell class="font-medium">
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold">{document.file_name}</span>
                      <span class="text-xs truncate max-w-xs">
                        SHA256: {document.document_hash.slice(0, 16)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="flex flex-col">
                      <span class="text-sm"> {document.reason? document.reason : "Tanpa Deskripsi"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span class="text-sm">
                      {formatDate(document.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span class="text-sm">
                      {formatDate(document.signed_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span class="text-sm font-medium">
                      {document.signed_count} / {document.allowed_signer.length}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(document)}
                  </TableCell>
                  <TableCell>
                    <ActionDropdown 
                      document={document}
                      onView$={onViewDocument$}
                      onDownload$={onDownloadDocument$}
                      onSign$={onSignDocument$}
                    />
                  </TableCell>
                </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
});