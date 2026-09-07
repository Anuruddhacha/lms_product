"use client";

import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  useGetAllUsersQuery,
  useDeleteUserAndDataByEmailMutation,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState, useMemo } from "react";

const AllUsers = () => {
  const { user, isLoaded } = useUser();
  const { data: users, isLoading: isLoadingUsers } = useGetAllUsersQuery(undefined, {
    skip: !isLoaded || !user,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Mutations for delete
  const [deleteUserAndDataByEmail] = useDeleteUserAndDataByEmailMutation();


  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users
      .filter((usr) => usr.id !== user?.id)
      .filter((usr) => {
        const term = searchTerm.toLowerCase();
        return (
          usr.name?.toLowerCase().includes(term) ||
          usr.email?.toLowerCase().includes(term) ||
          usr.phone?.toLowerCase().includes(term)
        );
      });
  }, [users, user?.id, searchTerm]);

 const handleDelete = async (email: string) => {
  if (!email) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete user with email: ${email}? This will delete the user and all related course requests and registrations.`
  );
  if (!confirmed) return;

  try {
    const response = await deleteUserAndDataByEmail(email).unwrap();
    alert(response.message || "User and related data deleted successfully.");
    // Optionally, refetch or update cache here
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete user and related data.");
  }
};


  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to view all students.</div>;

  return (
    <div className="billing">
      <div className="billing__container">
        <h2 className="billing__title">All Students</h2>
        <p className="text-muted-foreground mb-4">
          Total Students: {filteredUsers.length}
        </p>

        <Input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="mb-4 max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="billing__grid">
          {isLoadingUsers ? (
            <Loading />
          ) : (
            <Table className="billing__table">
              <TableHeader className="billing__table-header">
                <TableRow className="billing__table-header-row">
                  <TableHead className="billing__table-cell">Profile</TableHead>
                  <TableHead className="billing__table-cell">Name</TableHead>
                  <TableHead className="billing__table-cell">Email</TableHead>
                  <TableHead className="billing__table-cell">Phone</TableHead>
                  <TableHead className="billing__table-cell">Address</TableHead>
                  <TableHead className="billing__table-cell">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="billing__table-body">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((usr) => (
                    <TableRow key={usr.id} className="billing__table-row">
                      <TableCell className="billing__table-cell">
                        {usr.profileImage ? (
                          <Image
                            src={usr.profileImage}
                            alt={usr.name ?? "User"}
                            width={40}
                            height={40}
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                            unoptimized={
                              usr.profileImage.startsWith("http://") ||
                              usr.profileImage.startsWith("https://")
                            }
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600">
                            ?
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {usr.name}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {usr.email}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {usr.phone}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {usr.address || "-"}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(usr.email)}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
