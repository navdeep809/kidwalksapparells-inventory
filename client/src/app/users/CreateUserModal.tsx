import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import { User } from "@/state/api";

type UserFormData = {
  name: string;
  email: string;
  role: string;
};

type CreateUserModalProps = {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: UserFormData) => void;  
};

const CreateUserModal = ({
  user,
  isOpen,
  onClose,
  onCreate,
}: CreateUserModalProps) => {
    
const [formData, setFormData] = useState({
  userId: v4(),
  name: "",
  email: "",
  role: "" 
});
  
useEffect(()=>{

  if(user?.userId){
    setFormData({
      userId: user?.userId,
      name: user?.name,
      email: user?.email,
      role: user?.role
    });
  }

},[user])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value    
    });
  };
 
 const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
 };

if(!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

    return(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">        
        <Header name="New User" />
        <form onSubmit={handleSubmit} className="mt-5">

            {/*User Name */}
            <label htmlFor="name" className={labelCssStyles}>
                Full Name
            </label>
            <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
            />

            <label htmlFor="email" className={labelCssStyles}>
                Email
            </label>
            <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={inputCssStyles}
            required
            />

          {/* Role */}
          {/*TODO change to dropdown*/}
          <label htmlFor="role" className={labelCssStyles}>
             Role
            </label>
            <input
            type="text"
            name="role"
            placeholder="Role"
            onChange={handleChange}
            value={formData.role}
            className={inputCssStyles}        
            />

            {/*Create Button*/}
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Create
            </button>

            {/*Cancel button*/}
            <button onClick={onClose} type="button" className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
                Cancel
            </button>
        </form>
      </div>
    </div>
    );
};

export default CreateUserModal;
