import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation, Trans } from 'react-i18next';
import { open } from "@tauri-apps/api/dialog";
import { getFileNameFromPath } from "./helper";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [xmindFilePath, setXmindFilePath] = useState("");
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


  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

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
  );
}

export default App;
