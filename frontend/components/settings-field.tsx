"use client";

import React, {useState} from "react";
import {Eye, EyeOff} from "lucide-react";


type SettingsFieldProps = {
    field: {
        name: string;
        value: string;
        onChange: React.ChangeEventHandler<HTMLInputElement>;
        onBlur: React.FocusEventHandler<HTMLInputElement>;
        ref: React.LegacyRef<HTMLInputElement>;
    };
    placeholder?: string;
    title?: string;
    visibilityToggle: boolean;
    error?: string;
    dataCy?: string;
};

export function SettingsField({title, visibilityToggle, placeholder, field, error, dataCy}: SettingsFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex flex-col mb-4">
            {title && <label className="ml-1 mb-1">{title}</label>}
            <div className="relative text-sm">
                <input
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    type={visibilityToggle ? (visible ? "text" : "password") : "text"}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:accent-gray-500"
                    data-cy={dataCy}
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
                {error && (
                    <div className="text-sm text-red-500 mt-1 ml-1" data-cy={dataCy?.replace("-input", "-message")}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
