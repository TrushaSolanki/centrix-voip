import { FC, useEffect } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
      <SidebarTrigger className="md:hidden -ml-1" />
      </div>
      <h1 className="text-3xl font-normal">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  )
}
