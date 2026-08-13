"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

import type { UserRow } from "./data";

type ColumnActions = {
  onDelete: (user: UserRow) => void;
  onEdit: (user: UserRow) => void;
};

function UserCell({ user }: { user: UserRow }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="lg">
        {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground text-sm">{user.name}</div>
        <div className="truncate text-muted-foreground text-sm">{user.email}</div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge className="px-2 py-1 font-medium capitalize" variant="outline">
      {role}
    </Badge>
  );
}

export function getUsersColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<UserRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            aria-label="Select all users"
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            aria-label={`Select ${row.original.name}`}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
    {
      id: "search",
      accessorFn: (row) => `${row.name} ${row.username} ${row.email}`,
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => <UserCell user={row.original} />,
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => <div className="text-sm">@{row.original.username}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      filterFn: "equalsString",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      id: "createdAt",
      accessorFn: (row) => row.createdAt.getTime(),
      header: "Joined date",
      cell: ({ row }) => (
        <div className="text-foreground text-sm">{format(row.original.createdAt, "dd MMM yyyy, h:mm a")}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Open actions for ${row.original.name}`}
                className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                size="icon-sm"
                variant="ghost"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil /> Edit user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>
                <Trash2 /> Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ];
}
