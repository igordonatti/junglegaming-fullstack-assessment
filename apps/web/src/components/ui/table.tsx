import * as React from 'react'
import { cn } from '../../lib/utils'

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
}
export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} /> }
export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} /> }
export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) { return <tr className="border-b last:border-0" {...props} /> }
export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th className={cn('h-10 px-2 text-left align-middle font-medium', className)} {...props} /> }
export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className={cn('p-2 align-middle', className)} {...props} /> }


