import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation, Trans } from 'react-i18next';
import { open } from "@tauri-apps/api/dialog";

export function ZipXmind() {
    const [name, setName] = useState("");
    const { t } = useTranslation();

    async function compress() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

    }

    var folderXmind;
    async function openXmindFolder() {
        folderXmind = await open({
            directory: true,
        });
        if (folderXmind === null) {
            alert("No folder name");
        } else {
            alert(folderXmind.toString());
            setName(folderXmind.toString());
        }
    }

    return (
        <div>
            <p>Compress XMind files</p>

            <form
                className="col"

            >
                <input
                    id="greet-input"
                    onClick={() => openXmindFolder()}
                    placeholder={t('inputFolder')}
                    value={name}
                />
                <p></p>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        compress();
                    }}>{t('combine')}</button>
            </form>
        </div>
    );
}