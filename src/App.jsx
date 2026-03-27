import { useState } from "react";
import QRCode from "qrcode";

// ✅ FIX CHUẨN VERCEL
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function App() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    console.log("INPUT TRIGGERED");

    const file = e.target.files[0];
    if (!file) return;

    console.log("FILE OK:", file.name);

    setFileName(file.name);
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      console.log("PDF LOADED:", pdf.numPages);

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const strings = content.items.map((item) => item.str);
        fullText += strings.join(" ") + "\n";
      }

      console.log("TEXT OK:", fullText);

      setText(fullText);
    } catch (err) {
      console.error("PDF ERROR:", err);
      alert("❌ Không đọc được PDF");
    }

    setLoading(false);
  };

  const generateQR = async () => {
    if (!text) {
      alert("⚠️ Chưa có dữ liệu");
      return;
    }

    const data = {
      nr: "AUTO",
      dt: new Date().toISOString().split("T")[0],
      sum: 0,
      cur: "EUR",
      raw: text.slice(0, 500),
    };

    const url = await QRCode.toDataURL(JSON.stringify(data));
    setQrUrl(url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>QR Invoice Generator (FINAL FIX)</h1>

      <input type="file" accept=".pdf" onChange={handleFile} />
      <p>{fileName}</p>

      {loading && <p>⏳ Đang đọc PDF...</p>}

      <textarea
        rows={12}
        style={{ width: "100%", marginTop: 10 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />

      <button onClick={generateQR}>Generate QR</button>

      {qrUrl && (
        <div style={{ marginTop: 20 }}>
          <img src={qrUrl} alt="qr" />
        </div>
      )}
    </div>
  );
}
