import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from 'react-i18next';
import { open } from "@tauri-apps/api/dialog";
import { getFileNameFromPath } from "./helper";
import { ZipXmind } from "./ZipXmind";
import { XMindEmbedViewer } from "xmind-embed-viewer";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [xmindFilePath, setXmindFilePath] = useState("");
  const [isZipView, setIsZipView] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
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

  async function preview() {
    // const res = await fetch(name)
    const viewer = new XMindEmbedViewer({
      el: '#previewContainer',
      region: 'cn',
      file: await (await fetch(name)).arrayBuffer()
    });
    console.log("load xmind " + name);

    // viewer.load(await res.arrayBuffer());
    // fetch(xmindFilePath)
    //   .then(res => res.arrayBuffer())
    //   .then(file => viewer.load(file))
  }

  return (
    <>
      {showPreview ? (
        <div>
          <div className="preview">
            <div id="previewContainer"></div>
          </div>
          <button className="hideBtn" onClick={() => setShowPreview(false)}>Hide Preview</button>
        </div>
      ) : (
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
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPreview(true);
                    preview();
                  }}>{t('preview')}</button>
              </form>

              <p>{greetMsg}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
