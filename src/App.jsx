import * as pdfjsLib from "pdfjs-dist";

// 🔥 QUAN TRỌNG NHẤT
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

import { useState } from "react";
import QRCode from "qrcode";

export default function App() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const handleFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFileName(file.name);
  setLoading(true);

  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map(item => item.str);
      fullText += strings.join(" ") + "\n";
    }

    setText(fullText);

  } catch (err) {
    console.error(err);
    alert("Lỗi đọc PDF");
  }

  setLoading(false);
};
  };

  const generateQR = async () => {
    if (!text) return;

    const data = {
      invoice_id: "AUTO",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      currency: "EUR",
      raw: text.slice(0, 500)
    };

    const url = await QRCode.toDataURL(JSON.stringify(data));
    setQrUrl(url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>QR Invoice Generator (FINAL)</h1>

      <input type="file" accept=".pdf,.txt" onChange={handleFile} />
      <p>{fileName}</p>

      <textarea
        rows={10}
        style={{ width: "100%", marginTop: 10 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />
      <button onClick={generateQR}>Generate QR</button>

      {qrUrl && (
        <div>
          <img src={qrUrl} alt="qr" />
        </div>
      )}
    </div>
  );
}
