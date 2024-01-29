import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from 'react-i18next';
import { open } from "@tauri-apps/api/dialog";

export function ZipXmind() {
    const [zipMsg, setZipMsg] = useState("");
    const [name, setName] = useState("");
    const { t } = useTranslation();

    async function combine() {
        // alert("Compress..." + name);
        setZipMsg(await invoke("combine", { name }));
    }

    var folderXmind;
    async function openXmindFolder() {
        folderXmind = await open({
            directory: true,
        });
        if (folderXmind === null) {
            alert(t('nofoldername'));
        } else {
            // alert(folderXmind.toString());
            setName(folderXmind.toString());
        }
    }

    return (
        <div>
            <p>{t('descCompressXmindFolder')}</p>

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
                        combine();
                    }}>{t('combine')}</button>
            </form>

            <p>{zipMsg}</p>
        </div>
    );
}