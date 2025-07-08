"use client";

import { useCreateUserMutation, useGetUsersQuery, User } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Pencil, PlusCircleIcon, Edit, Trash2 } from "lucide-react";
import CreateUserModal from "./CreateUserModal";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "role", headerName: "Role", width: 200 },
];

type UserFormData = {
  userId?: string;
  name: string;
  email: string;
  role: string;
};

const roles = ['Basic', 'Admin'];

const Users = () => {
  const [modal, setModal] = useState<{ show: boolean, data?: any }>({ show: false });
  const [users, setUsers] = useState<User[]>([])
  const { data, isError, isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data])

  const handleCreateUser = async (userData: UserFormData) => {

    if (userData?.userId) {
      //
      setUsers(users?.filter(u => u.userId === userData?.userId ? userData : u));
    } else {
      await createUser(userData);
      setUsers([userData as any, ...users]);
    }


  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !users) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch users</div>
    );
  }

  const handleEdit = (edit: any) => {
    setModal({ show: true, data: edit?.row })
  }

  const handleDelete = (edit: any) => {
    // await delete

    setUsers(users?.filter(u => u.userId !== edit?.row?.userId));
  }

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="flex justify-between items-center w-full mb-7">

        {/* LEFT SIDE */}
        <div className="flex justify-between items-center gap-5">
          <Header name="Users" />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-between items-center gap-5">
          <button className="flex items-center bg-blue-500 gap-5 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setModal({ show: true })}>
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" />
            Add User
          </button>

          {/* <button className="flex items-center gap-3 bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded">
               <Pencil className="w-5 h-5 mr-2 !text-gray-200" />  
               Update User
              </button> */}
        </div>
      </div>
      <div className="mx-auto pb-5 w-full">
        <DataGrid
          rows={users}
          columns={[...columns, {
            field: "actions", headerName: "Actions", width: 150, renderCell(params) {

              return (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(params)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(params)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )
            }
          }]}
          getRowId={(row) => row.userId}
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        />
      </div>
      {/* MODAL */}
      <CreateUserModal
        user={modal.data}
        isOpen={modal?.show}
        onClose={() => setModal({ show: false })}
        onCreate={handleCreateUser}
      />

    </div>
  );
};

export default Users;
