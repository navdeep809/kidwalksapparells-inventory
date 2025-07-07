import { ChangeEvent, useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader(){

    const [file, setFile] = useState<File | null>(null);
    //const []

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    return (
    <div>
        <input type="file" onChange={handleFileChange}/>
        {file && (
            <div className="mb-4 text-sm">
                <p>File name:{file.name}</p>
                <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                <p>Type:{file.type}</p>
            </div>
        )}
    </div>
);
}
