import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import "./App.css";
import download from "downloadjs";

export default function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");

  // useEffect(() => {
  //   fetch("https://pdf-lib.js.org/assets/with_update_sections.pdf").then(
  //     (res) => console.log(res)
  //   );
  // }, []);

  const fileReset = () => {
    setPdfFile(null);
    setFileTitle("");
  };

  const fileUpload = (e) => {
    // console.log(e.target.files[0]);

    let file = e.target.files[0];

    setFileTitle(file.name);

    let reader = new FileReader();

    // setPdfFile(reader.readAsArrayBuffer(file));
    reader.readAsArrayBuffer(file);

    reader.onload = function () {
      // console.log(reader.result);
      setPdfFile(reader.result);
    };
  };
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/sign" onClick={fileReset}>
                Sign PDF
              </Link>
            </li>
            <li>
              <Link to="/check" onClick={fileReset}>
                Check PDF Metadata
              </Link>
            </li>
          </ul>
        </nav>
        <Redirect exact from="/" to="/sign" />
        {pdfFile !== null ? (
          <div>
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              {/* <Route exact path="/"> */}
              {/* </Route> */}
              <Route path="/sign">
                <Sign pdfFile={pdfFile} title={fileTitle} />
              </Route>
              <Route path="/check">
                <CheckMetadata pdfFile={pdfFile} />
              </Route>
            </Switch>
          </div>
        ) : (
          <div>
            <h2>Upload Here</h2>
            <input
              type="file"
              id="pdf_picker"
              accept=".pdf"
              onChange={fileUpload}
            />
          </div>
        )}
      </div>
      <div>File Name: {fileTitle}</div>
    </Router>
  );
}

function Sign({ pdfFile, title }) {
  async function changeMetadata() {
    const pdfDoc = await PDFDocument.load(pdfFile, {
      ignoreEncryption: true,
    });
    pdfDoc.setSubject("");
    // pdfDoc.setAuthor(pdfDoc.getAuthor());
    // pdfDoc.setCreationDate(pdfDoc.getCreationDate());
    // pdfDoc.setCreator(pdfDoc.getCreator());
    // pdfDoc.setKeywords(pdfDoc.getKeywords);
    // pdfDoc.setModificationDate(pdfDoc.getModificationDate());
    // pdfDoc.setProducer(pdfDoc.getProducer());
    // pdfDoc.setTitle(pdfDoc.getTitle());
    // calculate signature
    pdfDoc.setSubject("Hello This is Signature");
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "(Signed)" + title, "application/pdf");
  }

  useEffect(() => {
    console.log(pdfFile, title);
  }, []);

  return (
    <div>
      <h2>Sign PDF and Save File</h2>
      <button onClick={changeMetadata}>Download Signed File</button>
    </div>
  );
}

function CheckMetadata({ pdfFile }) {
  const [metadata, setMetadata] = useState("");

  async function viewMetadata() {
    const pdfDoc = await PDFDocument.load(pdfFile, {
      updateMetadata: false,
    });
    // console.log(pdfDoc.getTitle());
    setMetadata(pdfDoc.getSubject());
  }

  useEffect(() => {
    console.log(pdfFile);
  }, []);

  return (
    <div>
      <button onClick={viewMetadata}>Display Metadata</button>
      <h2>Signature: {metadata}</h2>
    </div>
  );
}
