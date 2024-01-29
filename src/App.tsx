import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from 'react-i18next';
import { open } from "@tauri-apps/api/dialog";
import { getFileNameFromPath } from "./helper";
import { ZipXmind } from "./ZipXmind";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [xmindFilePath, setXmindFilePath] = useState("");
  const [isZipView, setIsZipView] = useState(false)
  const { t } = useTranslation();

  async function extract() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("extract", { name }));
  }
  
  var fileXmind;
  async function openXmindFile() {
    fileXmind = await open({
      filters: [{
        name: 'Xmind',
        extensions: ['xmind']
      }]
    });
    if (fileXmind === null) {
      alert(t('nofilename'));
    } else {
      // alert(fileXmind.toString());
      setName(fileXmind.toString());
      setXmindFilePath(getFileNameFromPath(fileXmind.toString()));
    }
  }

  return (
    <div className="container">
      <h1>{t('xmindFileExtractOrCompress')}</h1>

      <p>{t('clickIconToSwitch')}</p>

      <div className="row">
        <a onClick={() => setIsZipView(!isZipView)} >
          <img src="/xmind-extractor.svg" className="logo xmind-extractor" alt="Vite logo" />
        </a>
      </div>

      {isZipView ? (
        <ZipXmind />
      ) : (
        <div>
          <p>{t('descExtractXmind')}</p>

          <form
            className="col"

          >
            <input
              id="greet-input"
              onClick={() => openXmindFile()}
              placeholder={t('inputName')}
              value={xmindFilePath}
            />
            <p></p>
            <button
              onClick={(e) => {
                e.preventDefault();
                extract();
              }}>{t('extract')}</button>
          </form>

          <p>{greetMsg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
