// import { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import api from "../api/axios";

// export default function FilePreview() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const [contentType, setContentType] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewText, setPreviewText] = useState(null);
//   const [csvRows, setCsvRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadFile = async () => {
//       const res = await api.get(
//         `/admin/files/${id}/preview`,
//         { responseType: "blob" }
//       );

//       const type = res.headers["content-type"];
//       setContentType(type);

//       // PDF / IMAGE
//       if (type.includes("pdf") || type.startsWith("image/")) {
//         setPreviewUrl(URL.createObjectURL(res.data));
//       }
//       // TEXT BASED
//       else {
//         const text = await res.data.text();

//         if (type.includes("json")) {
//           setPreviewText(JSON.stringify(JSON.parse(text), null, 2));
//         } else if (type.includes("xml")) {
//           setPreviewText(formatXML(text));
//         } else if (type.includes("csv")) {
//           setCsvRows(parseCSV(text));
//         } else {
//           setPreviewText(text); // txt
//         }
//       }

//       setLoading(false);
//     };

//     loadFile();

//     return () => previewUrl && URL.revokeObjectURL(previewUrl);
//   }, [id]);

//   const downloadFile = () => {
//     const blob = previewUrl
//       ? fetch(previewUrl).then(r => r.blob())
//       : new Blob([previewText || ""], { type: contentType });

//     Promise.resolve(blob).then(b => {
//       const url = URL.createObjectURL(b);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = state?.fileName || "download";
//       a.click();
//       URL.revokeObjectURL(url);
//     });
//   };

//   /* ===== HELPERS ===== */
//   const parseCSV = (text) =>
//     text.split("\n").filter(Boolean).map(row => row.split(","));

//   const formatXML = (xml) => {
//     let formatted = "";
//     let pad = 0;
//     xml.replace(/(>)(<)(\/*)/g, "$1\n$2$3")
//       .split("\n")
//       .forEach(node => {
//         if (node.match(/^<\/\w/)) pad--;
//         formatted += "  ".repeat(pad) + node + "\n";
//         if (node.match(/^<\w[^>]*[^\/]>$/)) pad++;
//       });
//     return formatted;
//   };

//   if (loading) return <p className="p-4">Loading preview…</p>;

//   return (
//     <div className="container-fluid p-4">

//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5>{state?.fileName}</h5>
//         <div className="d-flex gap-2">
//           <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
//             Back
//           </button>
//           <button className="btn btn-primary" onClick={downloadFile}>
//             Download
//           </button>
//         </div>
//       </div>

//       {/* PREVIEW */}
//       <div className="border rounded p-3 bg-light" style={{ height: "80vh", overflow: "auto" }}>

//         {/* PDF */}
//         {contentType?.includes("pdf") && (
//           <iframe
//             src={previewUrl}
//             style={{ width: "100%", height: "100%", border: "none" }}
//           />
//         )}

//         {/* IMAGE */}
//         {contentType?.startsWith("image/") && (
//           <img src={previewUrl} className="img-fluid mx-auto d-block" />
//         )}

//         {/* CSV */}
//         {contentType?.includes("csv") && (
//           <table className="table table-sm table-bordered">
//             <tbody>
//               {csvRows.map((row, i) => (
//                 <tr key={i}>
//                   {row.map((cell, j) => (
//                     <td key={j}>{cell}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {/* JSON / XML / TXT */}
//         {previewText && (
//           <pre className="bg-white p-3 rounded">
//             <code>{previewText}</code>
//           </pre>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function FilePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [contentType, setContentType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [csvRows, setCsvRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 DETECT ADMIN vs USER
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const loadFile = async () => {
      const endpoint = isAdmin
        ? `/admin/files/${id}/preview`
        : `/files/${id}/preview`;

      const res = await api.get(endpoint, {
        responseType: "blob",
      });

      const type = res.headers["content-type"];
      setContentType(type);

      // PDF / IMAGE
      if (type.includes("pdf") || type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(res.data));
      }
      // TEXT BASED
      else {
        const text = await res.data.text();

        if (type.includes("json")) {
          setPreviewText(JSON.stringify(JSON.parse(text), null, 2));
        } else if (type.includes("xml")) {
          setPreviewText(formatXML(text));
        } else if (type.includes("csv")) {
          setCsvRows(parseCSV(text));
        } else {
          setPreviewText(text); // txt
        }
      }

      setLoading(false);
    };

    loadFile();

    return () => {
      previewUrl && URL.revokeObjectURL(previewUrl);
    };
  }, [id, isAdmin]);

  const downloadFile = () => {
    const blob = previewUrl
      ? fetch(previewUrl).then((r) => r.blob())
      : new Blob([previewText || ""], { type: contentType });

    Promise.resolve(blob).then((b) => {
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url;
      a.download = state?.fileName || "download";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  /* ===== HELPERS ===== */
  const parseCSV = (text) =>
    text.split("\n").filter(Boolean).map((row) => row.split(","));

  const formatXML = (xml) => {
    let formatted = "";
    let pad = 0;
    xml
      .replace(/(>)(<)(\/*)/g, "$1\n$2$3")
      .split("\n")
      .forEach((node) => {
        if (node.match(/^<\/\w/)) pad--;
        formatted += "  ".repeat(pad) + node + "\n";
        if (node.match(/^<\w[^>]*[^\/]>$/)) pad++;
      });
    return formatted;
  };

  if (loading) return <p className="p-4">Loading preview…</p>;

  return (
    <div className="container-fluid p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>{state?.fileName}</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button className="btn btn-primary" onClick={downloadFile}>
            Download
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      <div
        className="border rounded p-3 bg-light"
        style={{ height: "80vh", overflow: "auto" }}
      >
        {/* PDF */}
        {contentType?.includes("pdf") && (
          <iframe
            src={previewUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}

        {/* IMAGE */}
        {contentType?.startsWith("image/") && (
          <img src={previewUrl} className="img-fluid mx-auto d-block" />
        )}

        {/* CSV */}
        {contentType?.includes("csv") && (
          <table className="table table-sm table-bordered">
            <tbody>
              {csvRows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* JSON / XML / TXT */}
        {previewText && (
          <pre className="bg-white p-3 rounded">
            <code>{previewText}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
