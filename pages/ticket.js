import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function TicketPage() {
  const [ticket, setTicket] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);
  const frameWidth = 720;
  const frameHeight = 405;

  useEffect(() => {
    const existingTicket = localStorage.getItem("ticket");

    if (existingTicket) {
      setTicket(existingTicket);
      return;
    }

    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const newTicket = `IDST-${randomNumber}`;

    localStorage.setItem("ticket", newTicket);
    setTicket(newTicket);

    fetch("/api/save-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticket: newTicket }),
    }).catch(() => {
      // Не ломаем интерфейс, если запись в базу не удалась
    });
  }, []);

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#000000",
        scale: 2,
      });

      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeTicket = (ticket || "lottery-ticket")
        .replace(/[^a-z0-9-]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

      link.href = imageUrl;
      link.download = safeTicket
        ? `lottery-ticket-${safeTicket}.png`
        : "lottery-ticket.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main
      className="ticket-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        color: "white",
        fontFamily: "monospace",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        ref={ticketRef}
        style={{
          position: "relative",
          containerType: "inline-size",
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          maxWidth: "92vw",
          maxHeight: "52vw",
          aspectRatio: "16 / 9",
          backgroundImage: "url('/images/ticket3.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "fadeIn 1.5s ease forwards",
          opacity: 0,
          overflow: "hidden",
        }}
      >
      
        <div
          style={{
            position: "absolute",
            top: "62%",
            left: "50%",
            width: "86%",
            transform: "translateX(-50%)",
            color: "rgba(66, 43, 1, 0.95)",
            fontFamily: "bahnschrift, monospace, sans-serif",
            fontSize: "clamp(16px, 5cqi, 48px)",
            letterSpacing: "clamp(1px, 0.45cqi, 3px)",
            fontWeight: "bold",
            wordBreak: "break-word",
            textAlign: "center",
            textShadow: "0 0 12px rgba(255, 255, 255, 0.56)",
          }}
        >
          {ticket || "..."}
        </div>
      </div>

      <button
        className="gold-button"
        style={{
          width: "min(420px, 92vw)",
          padding: "12px",
          borderRadius: "6px",
          cursor: "pointer",
          opacity: isDownloading ? 0.7 : 1,
          fontFamily: "monospace",
        }}
        onClick={handleDownloadTicket}
        disabled={isDownloading}
      >
        {isDownloading ? "Сохранение..." : "Скачать билет"}
      </button>

      <p style={{ margin: 0, fontSize: "12px", opacity: 0.35, textAlign: "center" }}>
        Номер билета сохраняется только в вашем браузере.
      </p>

      <style jsx global>{`
        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: black;
        }

        .ticket-page {
          background-image: url('/images/background.png');
          background-color: rgba(0, 0, 0, 0.7);
          background-blend-mode: darken;
          background-repeat: repeat;
          background-position: left top;
          background-size: 100% auto;
        }

        @media (orientation: landscape) {
          .ticket-page {
            background-size: 50% auto;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
