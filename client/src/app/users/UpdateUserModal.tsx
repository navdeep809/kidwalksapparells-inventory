//   import React, { ChangeEvent, FormEvent, useState } from "react";
//   import Header from "@/app/(components)/Header";

// type UpdateUserFormData = {
//     name: string;
//     email: string;
//     role: string;
//     userId: string;
// };

// type UpdateUserModalProps = {
//     isOpen: boolean;
//     onClose: () => void;
//     onUpdate: (formData: UpdateUserFormData) => void;
// };

// const [user, setUserFormData] = useState<UpdateUserFormData>({
//     name: "",
//     email: "",
//     role: "",
//     userId: ""
// });

// const [role, setRole] = useState(user?.role);
// const [name, setName] = useState(user?.name);
// const [email, setEmail] = useState(user?.email);
// const [userId, setUserId] = useState(user?.userId);