import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation, Trans } from 'react-i18next';
import { open } from "@tauri-apps/api/dialog";
import { getFileNameFromPath } from "./helper";
// import { ZipXmind } from "./ZipXmind";

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
      alert("No file name");
    } else {
      // alert(fileXmind.toString());
      setName(fileXmind.toString());
      setXmindFilePath(getFileNameFromPath(fileXmind.toString()));
    }
  }

  const [zipMsg, setZipMsg] = useState("");
  async function compress() {
    alert("Compress..." + name);
    setZipMsg(await invoke("combine", { name }));
}

  var folderXmind;
  async function openXmindFolder() {
      folderXmind = await open({
          directory: true,
      });
      if (folderXmind === null) {
          alert("No folder name");
      } else {
          // alert(folderXmind.toString());
          setName(folderXmind.toString());
      }
  }

  return (
    <div className="container">
      <h1>{t('xmindFileExtractOrCompress')}</h1>

      <div className="row">
        <a onClick={() => setIsZipView(!isZipView)} >
          <img src="/xmind-extractor.svg" className="logo xmind-extractor" alt="Vite logo" />
        </a>
      </div>

      {isZipView ? (
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
                      compress();
                  }}>{t('combine')}</button>
          </form>

          <p>{zipMsg}</p>
      </div>
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
