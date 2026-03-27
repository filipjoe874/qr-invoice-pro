import { useState } from "react";
import QRCode from "qrcode";

// ✅ PDF.js chuẩn cho Vite + Vercel
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function App() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // 📄 Đọc PDF
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("FILE:", file);

    setFileName(file.name);
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      console.log("PDF pages:", pdf.numPages);

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const strings = content.items.map((item) => item.str);
        fullText += strings.join(" ") + "\n";
      }

      console.log("PDF TEXT:", fullText);

      setText(fullText);
    } catch (err) {
      console.error("PDF ERROR:", err);
      alert("❌ Lỗi đọc PDF");
    }

    setLoading(false);
  };

  // 🔥 Tạo QR chuẩn kế toán (basic)
  const generateQR = async () => {
    if (!text) {
      alert("⚠️ Chưa có dữ liệu hóa đơn");
      return;
    }

    const data = {
      nr: "AUTO",
      dt: new Date().toISOString().split("T")[0],
      sum: 0,
      cur: "EUR",
      raw: text.slice(0, 500)
    };

    const url = await QRCode.toDataURL(JSON.stringify(data));
    setQrUrl(url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>QR Invoice Generator (FINAL PRO)</h1>

      {/* Upload */}
      <input type="file" accept=".pdf" onChange={handleFile} />
      <p>{fileName}</p>

      {/* Loading */}
      {loading && <p>⏳ Đang đọc PDF (5–10s)...</p>}

      {/* Text */}
      <textarea
        rows={12}
        style={{ width: "100%", marginTop: 10 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text từ hóa đơn sẽ xuất hiện ở đây..."
      />

      <br />

      {/* Button */}
      <button onClick={generateQR}>
        Generate QR
      </button>

      {/* QR */}
      {qrUrl && (
        <div style={{ marginTop: 20 }}>
          <img src={qrUrl} alt="qr" />
        </div>
      )}
    </div>
  );
}
