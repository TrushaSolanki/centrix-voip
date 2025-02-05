import { PageHeader } from '@/components/page-header'
import UserProfile from '@/components/ProfilePage'
import React from 'react'

export default function page() {
  return (
    <div className="p-6">
      <PageHeader
        title="My Account"
        subtitle="Access and control your personal details, security settings, and
        preferences here."
      />
      <UserProfile />
    </div>
  )
}
