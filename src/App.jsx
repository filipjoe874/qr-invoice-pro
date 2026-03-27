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

    const reader = new FileReader();
    reader.onload = () => {
      setText(reader.result.slice(0, 2000));
    };
    reader.readAsText(file);
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
