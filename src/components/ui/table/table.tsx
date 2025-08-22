import { component$, JSXOutput, Slot, type QwikIntrinsicElements } from '@builder.io/qwik';
import { cn } from '~/lib/utils';

export interface TableColumn<T> {
  key: string;
  header: string;
  cell?: (item: T) => string | JSXOutput;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: keyof T;
  onRowClick?: (item: T) => void;
  emptyMessage?: string | JSXOutput;
  className?: string;
  striped?: boolean;
  compact?: boolean;
}

export const Table = component$<QwikIntrinsicElements['table']>(({ class: className, ...props }) => {
  return (
    <div class="h-full overflow-x-auto">
      <table
        class={cn(
          'w-full caption-bottom text-sm border-collapse border',
          className
        )}
        {...props}
      >
        <Slot />
      </table>
    </div>
  );
});

export const TableHeader = component$<QwikIntrinsicElements['thead']>(({ class: className, ...props }) => {
  return (
    <thead
      class={cn(
        '[&_tr]:border-b bg-muted',
        className
      )}
      {...props}
    >
      <Slot />
    </thead>
  );
});

export const TableBody = component$<QwikIntrinsicElements['tbody']>(({ class: className, ...props }) => {
  return (
    <tbody
      class={cn(
        '[&_tr:last-child]:border-0',
        className
      )}
      {...props}
    >
      <Slot />
    </tbody>
  );
});

export const TableFooter = component$<QwikIntrinsicElements['tfoot']>(({ class: className, ...props }) => {
  return (
    <tfoot
      class={cn(
        'bg-primary font-medium text-primary-foreground',
        className
      )}
      {...props}
    >
      <Slot />
    </tfoot>
  );
});

export const TableRow = component$<QwikIntrinsicElements['tr']>(({ class: className, ...props }) => {
  return (
    <tr
      class={cn(
        'border-b transition-colors hover:bg-muted/50',
        className
      )}
      {...props}
    >
      <Slot />
    </tr>
  );
});

export const TableHead = component$<QwikIntrinsicElements['th']>(({ class: className, ...props }) => {
  return (
    <th
      class={cn(
        'h-12 px-4 text-left align-middle font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      <Slot />
    </th>
  );
});

export const TableCell = component$<QwikIntrinsicElements['td']>(({ class: className, ...props }) => {
  return (
    <td
      class={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      <Slot />
    </td>
  );
});

export const TableCaption = component$<QwikIntrinsicElements['caption']>(({ class: className, ...props }) => {
  return (
    <caption
      class={cn(
        'mt-4 text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      <Slot />
    </caption>
  );
});