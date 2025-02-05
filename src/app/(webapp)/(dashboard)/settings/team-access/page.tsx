"use client"

import { PageHeader } from "@/components/page-header"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  authentication: string
  lastLogin: string
}

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Victor Berroa",
    email: "victorb@email.com",
    role: "Owner",
    authentication: "Two-step",
    lastLogin: "Sep 24, 2024, 12:52",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "Analyst",
    authentication: "Two-step",
    lastLogin: "Sep 24, 2024, 12:52",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    role: "Analyst",
    authentication: "Two-step",
    lastLogin: "Oct 10, 2024, 14:20",
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    role: "Administrator",
    authentication: "Two-step",
    lastLogin: "Nov 3, 2024, 09:15",
  },
  {
    id: "5",
    name: "",
    email: "victorb@email.com",
    role: "Analyst",
    authentication: "",
    lastLogin: "Invitation sent",
  },
]

export default function TeamSecurity() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("analyst")
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const { toast } = useToast()

  const handleInvite = () => {
    // Handle the invite logic here
    setInviteOpen(false)
    setEmail("")
    setRole("analyst")
  }

  const handleReset = () => {
    // Handle the reset logic here
    setResetOpen(false)
    setSelectedMember(null)
  }

  const handleRemove = () => {
    if (selectedMember) {
      setTeamMembers(teamMembers.filter(member => member.id !== selectedMember.id))
      toast({
        variant: "destructive",
        title: "User Removed",
        description: `${selectedMember.email} has been successfully removed from the team.`,
      })
    }
    setRemoveOpen(false)
    setSelectedMember(null)
  }

  return (

    <div className="p-6">
          <PageHeader title="Team and security" subtitle="Manage Your Team's Access and Security Settings"/>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset two-step authentication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {selectedMember?.email} will receive an email with a link to remove two-step authentication
              from their account. Because two-step authentication is required for your team, they will
              be prompted to set up a new method before they can log in again.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setResetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReset}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove user from team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {selectedMember?.email} will no longer be able to access this account.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRemoveOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRemove}>
                Remove user
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="mb-4 flex justify-end">
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              Invite team member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite team members</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter team member email address and role
                </p>
                <Input
                  placeholder="email@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite}>Send invite</Button>
              </div>
            </div>
          </DialogContent>
      </Dialog>
      </div>
        <div className="border rounded-lg ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Authentication</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div>
                  {member.name}
                  {member.email && (
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.authentication}</TableCell>
              <TableCell>{member.lastLogin}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMember(member)
                        setResetOpen(true)
                      }}
                    >
                      Reset two-step authentication
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMember(member)
                        setRemoveOpen(true)
                      }}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}