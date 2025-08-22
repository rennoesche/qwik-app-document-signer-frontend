import { $, component$, useComputed$, useContext } from '@builder.io/qwik';
import { routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city'; 
import { NavContext } from '~/utils/context/nav-items-context';
import { DocumentsTable, stateFilter } from '~/components/documents-table/documents-table';
import { ScrollArea } from '~/components/ui/scroll-area/scroll-area';
import { SearchBar } from '~/components/ui/search-bar/search-bar';
import { DocumentsResponse, type Document as DocumentItem } from '~/utils/documents'; 
import { LuFilter } from '@qwikest/icons/lucide';
import { Button } from '~/components/ui/button/button';

export const useDocuments = routeLoader$(async ({ cookie, fail }) => {
  try {
    const token = cookie.get('access_token')?.value;
    
    if (!token) {
      return fail(401, { message: 'Authentication required' });
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}documents/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) return fail(401, { message: 'Authentication failed' });
      if (response.status === 403) return fail(403, { message: 'Access denied' });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DocumentsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return fail(500, { message: 'Failed to load documents' });
  }
});

export default component$(() => {
  const loc = useLocation();
  const navStore = useContext(NavContext);
  const nav = useNavigate(); 

  const label = useComputed$(() => {
    const currentPath = loc.url.pathname;
    const allNavItems = [...navStore.navItems, ];

    const activeItem = allNavItems
      .filter(i => currentPath.startsWith(i.href))
      .sort((a, b) => b.href.length - a.href.length)[0];

    return activeItem ? activeItem.label : 'Documents';
  });

  const documentsData = useDocuments();
  const state = stateFilter();

  const handleViewDocument = $((document: DocumentItem) => {
    console.log('View document:', document);
    nav(`/documents/${document.id}`); 
  });

  const handleSignDocument = $((document: DocumentItem) => {
    console.log('Sign document:', document);
    nav(`/sign/${document.id}`); 
  });

  const handleDownloadDocument = $((document: DocumentItem) => {
    console.log('Download document:', document);
  })

  if (documentsData.value.message) {
    return (
      <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {documentsData.value.message}
          </div>
        </div>
      </div>
);
}
  
  return (
    <div class="flex h-full flex-col overflow-hidden rounded-xl border bg-background">
      <header class="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <h1 class="text-base font-bold">{label.value}</h1>
        </div> 
      </header>
      
      <div class="flex flex-1 flex-col gap-y-2 overflow-auto p-4">
        <div class="flex md:justify-between gap-x-2 px-2 items-center">
          <Button/>
          <div class="flex inline-flex items-center">
            {/* <SearchBar/> */}
            <div class="p-4 flex items-center">
              <LuFilter class="h-4 w-4 text-muted-foreground"/>
              <span class="text-sm font-medium mx-2">Filter:</span>
              <div class="border">
                <button onClick$={() => state.filter = 'all'} class={`px-3 py-2 text-sm ${state.filter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>All</button>
                <button onClick$={() => state.filter = 'signed'} class={`px-3 py-2 text-sm ${state.filter === 'signed' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>Signed</button>
                <button onClick$={() => state.filter = 'pending'} class={`px-3 py-2 text-sm ${state.filter === 'pending' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>Pending</button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 outline-none relative flex flex-col gap-4">
          <ScrollArea>
            <DocumentsTable
              documents={documentsData.value || []}
              onViewDocument$={handleViewDocument}
              onSignDocument$={handleSignDocument}
              onDownloadDocument={handleDownloadDocument}
              state={state}
            />
          </ScrollArea>
        </div>
      </div>
      
    </div>
  );
});
