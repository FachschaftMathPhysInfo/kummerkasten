"use client"

import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

type SettingsFieldProps = {
    title?: string,
    visibilityToggle: boolean,
    placeholder: string,
}

export function SettingsField
({title, visibilityToggle, placeholder}: SettingsFieldProps) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="flex flex-col mb-4 ">
            <label className="ml-1 mb-1">{title}</label>
            <div className="relative text-sm">
                <input
                    type={visible ? "text" : "password"}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:accent-gray-500"
                />
                {visibilityToggle && (
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        {visible ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                )}
            </div>
        </div>
    );

}